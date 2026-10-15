<?php

declare(strict_types=1);

/**
 * Nettoie une valeur texte de formulaire (suppression HTML, scripts, caractères de contrôle).
 */
function sip_sanitize_form_text(string $value, int $maxLen, bool $preserveLineBreaks = true): string
{
    $value = trim($value);
    if ($value === '') {
        return '';
    }

    $value = str_replace("\0", '', $value);

    $value = preg_replace('/<\s*(script|iframe|object|embed|link|meta|style)[^>]*>.*?<\s*\/\s*\1\s*>/isu', '', $value) ?? $value;
    $value = strip_tags($value);
    $value = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $value = strip_tags($value);

    $dangerPatterns = [
        '/javascript\s*:/iu',
        '/vbscript\s*:/iu',
        '/data\s*:\s*text\/html/iu',
        '/<\s*script/iu',
        '/on[a-z]+\s*=/iu',
        '/expression\s*\(/iu',
    ];
    foreach ($dangerPatterns as $pattern) {
        $value = preg_replace($pattern, '', $value) ?? $value;
    }

    if ($preserveLineBreaks) {
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? $value;
    } else {
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? $value;
        $value = preg_replace('/[\r\n]+/u', ' ', $value) ?? $value;
        $value = preg_replace('/\s+/u', ' ', $value) ?? $value;
    }

    $value = trim($value);
    if ($maxLen > 0 && mb_strlen($value) > $maxLen) {
        $value = mb_substr($value, 0, $maxLen);
    }

    return $value;
}

/**
 * Normalise un champ formulaire (types non string exclus).
 *
 * @param mixed $value
 */
function sip_str_field($value, int $maxLen, bool $preserveLineBreaks = true): string
{
    if (!is_string($value)) {
        return '';
    }

    return sip_sanitize_form_text($value, $maxLen, $preserveLineBreaks);
}
