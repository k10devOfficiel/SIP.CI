<?php

declare(strict_types=1);

/**
 * Client SMTP minimal (AUTH LOGIN, SSL implicite port 465).
 */
final class SipSmtpClient
{
    /** @var resource|null */
    private $socket = null;

    public function __construct(
        private readonly string $host,
        private readonly int $port,
        private readonly string $username,
        private readonly string $password,
        private readonly string $fromAddress,
        private readonly string $fromName,
        private readonly bool $verifyTls = true,
    ) {
    }

    /**
     * Envoie un e-mail texte brut à plusieurs destinataires.
     *
     * @param list<string> $recipients
     */
    public function send(array $recipients, string $subject, string $bodyPlain, ?string $replyTo = null): void
    {
        $recipients = array_values(array_unique(array_filter(array_map('trim', $recipients))));
        if ($recipients === []) {
            throw new InvalidArgumentException('Aucun destinataire.');
        }

        foreach ($recipients as $rcpt) {
            if (!filter_var($rcpt, FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException('Adresse destinataire invalide.');
            }
        }

        $this->connect();
        try {
            $ehlo = $this->cmd('EHLO sip-ci.net');
            $this->expect($ehlo, [250]);

            if (stripos($ehlo, 'AUTH') === false) {
                throw new RuntimeException('SMTP : AUTH non supporté.');
            }

            $this->expect($this->cmd('AUTH LOGIN'), [334]);
            $this->expect($this->cmd(base64_encode($this->username)), [334]);
            $this->expect($this->cmd(base64_encode($this->password)), [235]);

            $this->expect($this->cmd('MAIL FROM:<' . $this->fromAddress . '>'), [250]);

            foreach ($recipients as $rcpt) {
                $this->expect($this->cmd('RCPT TO:<' . $rcpt . '>'), [250, 251]);
            }

            $this->expect($this->cmd('DATA'), [354]);

            $headers = [
                'From: ' . $this->encodeAddress($this->fromName, $this->fromAddress),
                'MIME-Version: 1.0',
                'Content-Type: text/plain; charset=UTF-8',
                'Content-Transfer-Encoding: 8bit',
                'Subject: ' . $this->encodeHeader($subject),
                'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            ];

            if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
                $headers[] = 'Reply-To: ' . $replyTo;
            }

            $message = implode("\r\n", $headers) . "\r\n\r\n" . $this->dotStuff($bodyPlain) . "\r\n.";
            $this->sendRaw($message . "\r\n");
            $this->expect($this->readResponse(), [250]);

            $this->cmd('QUIT');
        } finally {
            $this->disconnect();
        }
    }

    private function connect(): void
    {
        $ctx = stream_context_create([
            'ssl' => [
                'verify_peer' => $this->verifyTls,
                'verify_peer_name' => $this->verifyTls,
                'allow_self_signed' => !$this->verifyTls,
            ],
        ]);

        $errno = 0;
        $errstr = '';
        $socket = @stream_socket_client(
            'ssl://' . $this->host . ':' . $this->port,
            $errno,
            $errstr,
            30,
            STREAM_CLIENT_CONNECT,
            $ctx
        );

        if ($socket === false) {
            throw new RuntimeException('Connexion SMTP impossible : ' . $errstr);
        }

        stream_set_timeout($socket, 30);
        $this->socket = $socket;
        $this->expect($this->readResponse(), [220]);
    }

    private function disconnect(): void
    {
        if (is_resource($this->socket)) {
            fclose($this->socket);
        }
        $this->socket = null;
    }

    /** @param list<int> $codes */
    private function expect(string $response, array $codes): void
    {
        $code = (int) substr($response, 0, 3);
        if (!in_array($code, $codes, true)) {
            throw new RuntimeException('SMTP inattendu : ' . trim($response));
        }
    }

    private function cmd(string $line): string
    {
        $this->sendRaw($line . "\r\n");

        return $this->readResponse();
    }

    private function sendRaw(string $data): void
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('Socket SMTP fermé.');
        }
        $written = fwrite($this->socket, $data);
        if ($written === false) {
            throw new RuntimeException('Échec écriture SMTP.');
        }
    }

    private function readResponse(): string
    {
        if (!is_resource($this->socket)) {
            throw new RuntimeException('Socket SMTP fermé.');
        }

        $data = '';
        while (($line = fgets($this->socket, 515)) !== false) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }

        if ($data === '') {
            throw new RuntimeException('Réponse SMTP vide.');
        }

        return $data;
    }

    private function dotStuff(string $body): string
    {
        $body = str_replace(["\r\n", "\r"], "\n", $body);
        $lines = explode("\n", $body);
        $out = [];
        foreach ($lines as $line) {
            if (str_starts_with($line, '.')) {
                $line = '.' . $line;
            }
            $out[] = $line;
        }

        return implode("\r\n", $out);
    }

    private function encodeHeader(string $value): string
    {
        if (preg_match('/[^\x20-\x7E]/', $value)) {
            return '=?UTF-8?B?' . base64_encode($value) . '?=';
        }

        return $value;
    }

    private function encodeAddress(string $name, string $email): string
    {
        return $this->encodeHeader($name) . ' <' . $email . '>';
    }
}
