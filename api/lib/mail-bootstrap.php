<?php

declare(strict_types=1);

/**
 * Charge la configuration mail (env > mail-config.php).
 *
 * @return array<string, mixed>
 */
function sip_mail_config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }

    $root = dirname(__DIR__, 2);
    $path = $root . '/config/mail-config.php';

    if (!is_readable($path)) {
        throw new RuntimeException('Configuration mail manquante (config/mail-config.php).');
    }

    $loaded = require $path;
    if (!is_array($loaded)) {
        throw new RuntimeException('Configuration mail invalide.');
    }

    $envMap = [
        'MAIL_HOST' => ['smtp', 'host'],
        'MAIL_PORT' => ['smtp', 'port'],
        'MAIL_USERNAME' => ['smtp', 'username'],
        'MAIL_PASSWORD' => ['smtp', 'password'],
        'MAIL_FROM_ADDRESS' => ['from', 'address'],
        'MAIL_FROM_NAME' => ['from', 'name'],
    ];

    foreach ($envMap as $envKey => $pathKeys) {
        $val = getenv($envKey);
        if ($val !== false && $val !== '') {
            if ($envKey === 'MAIL_PORT') {
                $loaded['smtp']['port'] = (int) $val;
            } else {
                $ref = &$loaded;
                foreach ($pathKeys as $i => $key) {
                    if ($i === count($pathKeys) - 1) {
                        $ref[$key] = $val;
                    } else {
                        if (!isset($ref[$key]) || !is_array($ref[$key])) {
                            $ref[$key] = [];
                        }
                        $ref = &$ref[$key];
                    }
                }
            }
        }
    }

    $cfg = $loaded;

    return $cfg;
}

/**
 * Démarre la session PHP pour captcha / anti-spam.
 */
function sip_form_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('SIPFORM');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}
