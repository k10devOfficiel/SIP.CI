<?php

declare(strict_types=1);

/**
 * Génère un captcha arithmétique local (session PHP).
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée'], JSON_UNESCAPED_UNICODE);
    exit;
}

require __DIR__ . '/lib/mail-bootstrap.php';

try {
    $cfg = sip_mail_config();
    $pepper = isset($cfg['form_pepper']) && is_string($cfg['form_pepper']) ? $cfg['form_pepper'] : '';
    if (strlen($pepper) < 16) {
        throw new RuntimeException('form_pepper trop court.');
    }

    sip_form_session_start();

    $a = random_int(2, 12);
    $b = random_int(2, 12);
    $sum = (string) ($a + $b);
    $token = bin2hex(random_bytes(16));

    if (!isset($_SESSION['sip_captcha']) || !is_array($_SESSION['sip_captcha'])) {
        $_SESSION['sip_captcha'] = [];
    }

    foreach ($_SESSION['sip_captcha'] as $k => $meta) {
        if (!is_array($meta) || ($meta['exp'] ?? 0) < time()) {
            unset($_SESSION['sip_captcha'][$k]);
        }
    }

    $_SESSION['sip_captcha'][$token] = [
        'hash' => hash_hmac('sha256', $sum, $pepper),
        'exp' => time() + 900,
    ];

    echo json_encode([
        'ok' => true,
        'token' => $token,
        'question' => $a . ' + ' . $b,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Captcha indisponible.'], JSON_UNESCAPED_UNICODE);
}
