<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée'], JSON_UNESCAPED_UNICODE);
    exit;
}

$root = dirname(__DIR__);
$keyPath = $root . '/config/portal-secret.php';

$expectedKey = getenv('SIP_PORTAL_KEY');
if ($expectedKey === false || $expectedKey === '') {
    if (!is_readable($keyPath)) {
        http_response_code(503);
        echo json_encode([
            'ok' => false,
            'error' => 'Configuration manquante : copiez config/portal-secret.example.php vers config/portal-secret.php ou définissez SIP_PORTAL_KEY.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $loaded = require $keyPath;
    $expectedKey = is_string($loaded) ? $loaded : '';
}

if ($expectedKey === '' || strlen($expectedKey) < 16) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'error' => 'Clé portail invalide ou trop courte (minimum 16 caractères).',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Corps vide'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $data = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'JSON invalide'], JSON_UNESCAPED_UNICODE);
    exit;
}

$keyIn = isset($data['key']) && is_string($data['key']) ? $data['key'] : '';

if (!hash_equals(hash('sha256', $keyIn), hash('sha256', $expectedKey))) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Clé incorrecte'], JSON_UNESCAPED_UNICODE);
    exit;
}

$fuelPath = $root . '/data/fuel-prices.json';
$newsPath = $root . '/data/actualites.json';

$saved = [];

try {
    if (array_key_exists('fuel', $data)) {
        $fuel = validateFuelPayload($data['fuel']);
        writeJsonAtomic($fuelPath, $fuel);
        $saved[] = 'fuel-prices.json';
    }

    if (array_key_exists('actualites', $data)) {
        $news = validateActualitesPayload($data['actualites']);
        writeJsonAtomic($newsPath, $news);
        $saved[] = 'actualites.json';
    }

    if ($saved === []) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'Aucune donnée à enregistrer : envoyez un objet "fuel" et/ou "actualites".',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['ok' => true, 'saved' => $saved], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'error' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
}

/**
 * @param mixed $fuel
 * @return array{super: int|float, gasoil: int|float, petrole: int|float, date: string}
 */
function validateFuelPayload($fuel): array
{
    if (!is_array($fuel)) {
        throw new InvalidArgumentException('Bloc "fuel" invalide.');
    }

    foreach (['super', 'gasoil', 'petrole'] as $k) {
        if (!array_key_exists($k, $fuel)) {
            throw new InvalidArgumentException('Champ fuel manquant : ' . $k);
        }
    }

    $date = $fuel['date'] ?? '';
    if (!is_string($date) || trim($date) === '') {
        throw new InvalidArgumentException('Libellé de période (date) obligatoire.');
    }
    $date = trim($date);
    if (strlen($date) > 120) {
        throw new InvalidArgumentException('Libellé de période trop long.');
    }

    $out = ['date' => $date];
    foreach (['super', 'gasoil', 'petrole'] as $k) {
        $out[$k] = validatePriceNumber($fuel[$k], $k);
    }

    return $out;
}

/**
 * @param mixed $value
 */
function validatePriceNumber($value, string $field): float
{
    if (is_string($value)) {
        $value = str_replace(',', '.', trim($value));
    }
    if (!is_numeric($value)) {
        throw new InvalidArgumentException('Prix invalide pour : ' . $field);
    }
    $n = (float) $value;
    if ($n <= 0 || $n > 999999) {
        throw new InvalidArgumentException('Prix hors plage pour : ' . $field);
    }

    return round($n, 2);
}

/**
 * @param mixed $payload
 * @return array{items: list<array{id: string, date: string, dateLabel: string, title: string, excerpt: string}>}
 */
function validateActualitesPayload($payload): array
{
    if (!is_array($payload)) {
        throw new InvalidArgumentException('Bloc "actualites" invalide.');
    }

    $items = $payload['items'] ?? null;
    if (!is_array($items)) {
        throw new InvalidArgumentException('Liste "items" manquante ou invalide.');
    }

    $seen = [];
    $clean = [];

    foreach ($items as $i => $row) {
        if (!is_array($row)) {
            throw new InvalidArgumentException('Actualité #' . ($i + 1) . ' : format invalide.');
        }

        $id = isset($row['id']) && is_string($row['id']) ? trim($row['id']) : '';
        $idLen = function_exists('mb_strlen') ? mb_strlen($id, 'UTF-8') : strlen($id);
        if ($id === '' || $idLen > 96 || !preg_match('/^[\p{L}\p{N}_-]+$/u', $id)) {
            throw new InvalidArgumentException('Identifiant invalide à la ligne ' . ($i + 1) . ' (lettres, chiffres, tirets).');
        }
        if (isset($seen[$id])) {
            throw new InvalidArgumentException('Identifiant dupliqué : ' . $id);
        }
        $seen[$id] = true;

        $date = isset($row['date']) && is_string($row['date']) ? trim($row['date']) : '';
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            throw new InvalidArgumentException('Date ISO (AAAA-MM-JJ) invalide pour : ' . $id);
        }

        $dateLabel = isset($row['dateLabel']) && is_string($row['dateLabel']) ? trim($row['dateLabel']) : '';
        if ($dateLabel === '' || strlen($dateLabel) > 160) {
            throw new InvalidArgumentException('Libellé de date invalide pour : ' . $id);
        }

        $title = isset($row['title']) && is_string($row['title']) ? trim($row['title']) : '';
        if ($title === '' || strlen($title) > 300) {
            throw new InvalidArgumentException('Titre invalide pour : ' . $id);
        }

        $excerpt = isset($row['excerpt']) && is_string($row['excerpt']) ? trim($row['excerpt']) : '';
        if ($excerpt === '' || strlen($excerpt) > 2000) {
            throw new InvalidArgumentException('Résumé invalide pour : ' . $id);
        }

        $image = validateOptionalImagePath($row['image'] ?? null);
        $readMore = validateOptionalReadMoreUrl($row['readMoreUrl'] ?? null);

        $entry = [
            'id' => $id,
            'date' => $date,
            'dateLabel' => $dateLabel,
            'title' => $title,
            'excerpt' => $excerpt,
        ];

        if ($image !== '') {
            $entry['image'] = $image;
        }
        if ($readMore !== '') {
            $entry['readMoreUrl'] = $readMore;
        }

        $clean[] = $entry;
    }

    return ['items' => $clean];
}

function validateOptionalImagePath($raw): string
{
    if (!is_string($raw)) {
        return '';
    }
    $p = trim($raw);
    if ($p === '') {
        return '';
    }
    if (!preg_match('#^assets/images/[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(jpe?g|png|webp)$#i', $p)) {
        throw new InvalidArgumentException(
            'Chemin image invalide pour une actualité (attendu : assets/images/nom.jpg ou .png/.webp).'
        );
    }

    return $p;
}

/**
 * @param mixed $raw
 */
function validateOptionalReadMoreUrl($raw): string
{
    if (!is_string($raw)) {
        return '';
    }
    $u = trim($raw);
    if ($u === '') {
        return '';
    }
    if (strlen($u) > 400) {
        throw new InvalidArgumentException('URL « Lire la suite » trop longue.');
    }
    $lower = strtolower($u);
    if (strpos($lower, 'javascript:') === 0 || strpos($lower, 'data:') === 0) {
        throw new InvalidArgumentException('Schéma d’URL non autorisé pour « Lire la suite ».');
    }
    if (preg_match('/[\s<>"\']/', $u)) {
        throw new InvalidArgumentException('URL « Lire la suite » : caractères interdits.');
    }

    return $u;
}

/**
 * @param mixed $data
 */
function writeJsonAtomic(string $path, $data): void
{
    $dir = dirname($path);
    if (!is_dir($dir) || !is_writable($dir)) {
        throw new RuntimeException('Dossier data inaccessible en écriture.');
    }

    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';

    if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false) {
        throw new RuntimeException('Écriture temporaire impossible.');
    }

    if (!rename($tmp, $path)) {
        @unlink($tmp);
        throw new RuntimeException('Écriture finale impossible.');
    }
}
