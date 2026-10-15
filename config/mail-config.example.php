<?php

declare(strict_types=1);

/**
 * Copiez ce fichier vers mail-config.php et renseignez le mot de passe SMTP.
 * Ne commitez pas mail-config.php (voir .gitignore).
 *
 * Variables d'environnement optionnelles (prioritaires si définies) :
 * MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM_ADDRESS, MAIL_FROM_NAME
 */
return [
    'form_pepper' => 'CHANGEZ_CETTE_CHAINE_SECRETE_FORMULAIRES_32_CHARS_MIN',

    'smtp' => [
        'host' => 'mail.sip-ci.net',
        'port' => 465,
        'encryption' => 'ssl',
        'username' => 'contact@sip-ci.net',
        'password' => 'VOTRE_MOT_DE_PASSE_SMTP',
        'verify_tls' => true,
    ],

    'from' => [
        'address' => 'contact@sip-ci.net',
        'name' => 'SIP Fidelity',
    ],

    /** Destinataires des formulaires site vitrine */
    'recipients' => [
        'info' => 'info@sip-ci.com',
        'commercial' => 'commercial@sip-ci.com',
    ],
];
