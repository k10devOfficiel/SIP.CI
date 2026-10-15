<?php

declare(strict_types=1);

/**
 * Envoi des formulaires contact / devis par SMTP (info + commercial).
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée'], JSON_UNESCAPED_UNICODE);
    exit;
}

require __DIR__ . '/lib/mail-bootstrap.php';
require __DIR__ . '/lib/form-sanitize.php';
require __DIR__ . '/lib/SipSmtpClient.php';

/**
 * @param array<string, mixed> $cfg
 *
 * @return list<string>
 */
function sip_form_recipients(array $cfg): array
{
    $rec = $cfg['recipients'] ?? [];
    $list = [];
    if (is_array($rec)) {
        foreach (['info', 'commercial'] as $key) {
            if (!empty($rec[$key]) && is_string($rec[$key])) {
                $list[] = $rec[$key];
            }
        }
    }

    return array_values(array_unique($list));
}

/**
 * @param array<string, mixed> $data
 *
 * @return array{subject: string, body: string, replyTo: string|null}
 */
function sip_build_contact_mail(array $data): array
{
    $nom = sip_str_field($data['nom'] ?? '', 120, false);
    $prenom = sip_str_field($data['prenom'] ?? '', 120, false);
    $email = sip_str_field($data['email'] ?? '', 180, false);
    $telephone = sip_str_field($data['telephone'] ?? '', 40, false);
    $sujet = sip_str_field($data['sujet'] ?? '', 40, false);
    $message = sip_str_field($data['message'] ?? '', 8000, true);

    if ($nom === '' || $prenom === '' || $email === '' || $sujet === '' || $message === '') {
        throw new InvalidArgumentException('Champs obligatoires manquants.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('E-mail invalide.');
    }

    $sujetLabels = [
        'info' => 'Demande d\'information',
        'devis' => 'Demande de devis',
        'reclamation' => 'Réclamation',
        'partenariat' => 'Partenariat',
        'franchise' => 'Devenir franchisé',
        'autre' => 'Autre',
    ];
    if (!array_key_exists($sujet, $sujetLabels)) {
        throw new InvalidArgumentException('Sujet invalide.');
    }
    $sujetLabel = $sujetLabels[$sujet];

    $body = "Formulaire : Contact site SIP\r\n";
    $body .= "----------------------------\r\n";
    $body .= 'Nom : ' . $nom . ' ' . $prenom . "\r\n";
    $body .= 'E-mail : ' . $email . "\r\n";
    $body .= 'Téléphone : ' . ($telephone !== '' ? $telephone : '—') . "\r\n";
    $body .= 'Sujet : ' . $sujetLabel . "\r\n\r\n";
    $body .= "Message :\r\n" . $message . "\r\n";

    return [
        'subject' => '[SIP Site] Contact — ' . $sujetLabel . ' — ' . $nom,
        'body' => $body,
        'replyTo' => $email,
    ];
}

/**
 * @param array<string, mixed> $data
 *
 * @return array{subject: string, body: string, replyTo: string|null}
 */
function sip_build_devis_mail(array $data): array
{
    $nom = sip_str_field($data['nom'] ?? '', 120, false);
    $prenom = sip_str_field($data['prenom'] ?? '', 120, false);
    $email = sip_str_field($data['email'] ?? '', 180, false);
    $telephone = sip_str_field($data['telephone'] ?? '', 40, false);
    $societe = sip_str_field($data['societe'] ?? '', 200, false);
    $typeDemande = sip_str_field($data['type_demande'] ?? '', 40, false);
    $produit = sip_str_field($data['produit'] ?? '', 40, false);
    $quantite = sip_str_field($data['quantite'] ?? '', 120, false);
    $message = sip_str_field($data['message'] ?? '', 8000, true);

    if ($nom === '' || $prenom === '' || $email === '' || $telephone === '' || $typeDemande === '' || $produit === '') {
        throw new InvalidArgumentException('Champs obligatoires manquants.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('E-mail invalide.');
    }

    $allowedTypes = ['devis', 'commande'];
    $allowedProducts = ['super', 'gasoil', 'petrole', 'lubrifiants', 'gaz', 'services'];
    if (!in_array($typeDemande, $allowedTypes, true)) {
        throw new InvalidArgumentException('Type de demande invalide.');
    }
    if (!in_array($produit, $allowedProducts, true)) {
        throw new InvalidArgumentException('Produit invalide.');
    }

    $body = "Formulaire : Demande de devis site SIP\r\n";
    $body .= "----------------------------\r\n";
    $body .= 'Nom : ' . $nom . ' ' . $prenom . "\r\n";
    $body .= 'E-mail : ' . $email . "\r\n";
    $body .= 'Téléphone : ' . $telephone . "\r\n";
    $body .= 'Société : ' . ($societe !== '' ? $societe : '—') . "\r\n";
    $body .= 'Type : ' . $typeDemande . "\r\n";
    $body .= 'Produit : ' . $produit . "\r\n";
    $body .= 'Quantité : ' . ($quantite !== '' ? $quantite : '—') . "\r\n\r\n";
    $body .= "Détails :\r\n" . ($message !== '' ? $message : '—') . "\r\n";

    $who = $societe !== '' ? $societe : $nom;

    return [
        'subject' => '[SIP Site] Devis — ' . $produit . ' — ' . $who,
        'body' => $body,
        'replyTo' => $email,
    ];
}

try {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        throw new InvalidArgumentException('Corps vide.');
    }

    $payload = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
    if (!is_array($payload)) {
        throw new InvalidArgumentException('JSON invalide.');
    }

    $honeypot = sip_str_field($payload['website'] ?? '', 200);
    if ($honeypot !== '') {
        echo json_encode(['ok' => true, 'message' => 'Merci.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $formType = sip_str_field($payload['form'] ?? '', 20);
    if (!in_array($formType, ['contact', 'devis'], true)) {
        throw new InvalidArgumentException('Type de formulaire inconnu.');
    }

    $cfg = sip_mail_config();
    $pepper = isset($cfg['form_pepper']) && is_string($cfg['form_pepper']) ? $cfg['form_pepper'] : '';
    if (strlen($pepper) < 16) {
        throw new RuntimeException('Configuration formulaire incomplète.');
    }

    sip_form_session_start();

    $lastSend = $_SESSION['sip_last_form_send'] ?? 0;
    if (is_int($lastSend) && time() - $lastSend < 45) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Veuillez patienter avant un nouvel envoi.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $token = sip_str_field($payload['captcha_token'] ?? '', 64);
    $answer = sip_str_field($payload['captcha_answer'] ?? '', 10);
    if ($token === '' || $answer === '' || !ctype_digit($answer)) {
        throw new InvalidArgumentException('Captcha invalide.');
    }

    $store = $_SESSION['sip_captcha'][$token] ?? null;
    if (!is_array($store) || ($store['exp'] ?? 0) < time()) {
        throw new InvalidArgumentException('Captcha expiré. Rechargez la question.');
    }

    $expectedHash = is_string($store['hash'] ?? null) ? $store['hash'] : '';
    $givenHash = hash_hmac('sha256', $answer, $pepper);
    if ($expectedHash === '' || !hash_equals($expectedHash, $givenHash)) {
        throw new InvalidArgumentException('Réponse anti-spam incorrecte.');
    }
    unset($_SESSION['sip_captcha'][$token]);

    $fields = $payload['fields'] ?? [];
    if (!is_array($fields)) {
        throw new InvalidArgumentException('Champs invalides.');
    }

    $mail = $formType === 'contact' ? sip_build_contact_mail($fields) : sip_build_devis_mail($fields);

    $smtp = $cfg['smtp'] ?? [];
    if (!is_array($smtp)) {
        throw new RuntimeException('SMTP non configuré.');
    }

    $client = new SipSmtpClient(
        (string) ($smtp['host'] ?? ''),
        (int) ($smtp['port'] ?? 465),
        (string) ($smtp['username'] ?? ''),
        (string) ($smtp['password'] ?? ''),
        (string) ($cfg['from']['address'] ?? $smtp['username'] ?? ''),
        (string) ($cfg['from']['name'] ?? 'SIP'),
        (bool) ($smtp['verify_tls'] ?? true),
    );

    $client->send(sip_form_recipients($cfg), $mail['subject'], $mail['body'], $mail['replyTo']);

    $_SESSION['sip_last_form_send'] = time();

    echo json_encode([
        'ok' => true,
        'message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
    ], JSON_UNESCAPED_UNICODE);
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Envoi impossible pour le moment. Réessayez ou contactez-nous par téléphone.'], JSON_UNESCAPED_UNICODE);
}
