# Site Web de l'Entreprise Pétrolière

## Description
Ce dossier contient le site web institutionnel de l'entreprise de pétrole.

## Structure du projet
```
website/
├── assets/          # Images, CSS, JavaScript
├── pages/           # Pages du site
├── components/      # Composants réutilisables
├── config/          # Fichiers de configuration
├── data/           # JSON (actualités, prix widget, …)
├── .htaccess        # Apache : redirection HTTPS (production)
├── README.md        # Ce fichier
```

## Pages prévues
- Accueil
- À propos
- Nos services
- Nos stations
- Contact
- Actualités

## Technologies
- HTML5
- CSS3
- JavaScript (Vanilla ou framework)
- Responsive Design

## Développement
Le site web sera développé progressivement avec une approche mobile-first.

## Widget prix carburants (toutes les pages)

Les montants du widget flottant **ne sont plus dans le fichier JavaScript**. Ils sont lus depuis :

`website/data/fuel-prices.json`

**Pour une mise à jour mensuelle**, ouvrir ce fichier et modifier uniquement :

- `super`, `gasoil`, `petrole` — nombres (FCFA par litre)
- `date` — libellé affiché sous les prix (ex. `"Juin 2026"`)

Enregistrer le fichier puis déployer / publier sur le serveur. Le navigateur recharge les données avec `cache: no-cache` pour limiter les prix obsolètes en cache.

Les valeurs dans `widget.js` (`DEFAULT_FUEL_PRICES`) servent uniquement de secours si le JSON est introuvable ou invalide.

## HTTPS (forcer)

Le fichier **`website/.htaccess`** :

- exempte **`localhost`** / **`127.0.0.1`** (développement sans certificat) ;
- redirige **`www.sip-ci.com`** vers **`https://sip-ci.com`** (URL canonique en apex) ;
- redirige toute connexion HTTP vers **HTTPS** sur le même nom d’hôte (`RewriteRule … https://%{HTTP_HOST}…`), ce qui fonctionne aussi pour sous-domaines de préproduction.

En production : le **VirtualHost** doit écouter le **443** avec un **certificat TLS valide** reconnu par les navigateurs (Let’s Encrypt, certificat hébergeur, etc.). Si le **document root** Apache n’est pas le dossier `website/`, dupliquez ces règles au niveau qui sert réellement **`sip-ci.com`**.

Derrière **CDN ou reverse-proxy** : assurez-vous que **`X-Forwarded-Proto: https`** est bien envoyé quand le visiteur est en HTTPS ; en **Cloudflare**, privilégiez **Full (strict)** avec un certificat valide sur l’origine pour éviter les boucles ou les erreurs de confiance.

### « Votre connexion n'est pas privée » après activation du `.htaccess`

Ce message **ne signifie pas** que `.htaccess` « injecte une attaque » : **Chrome / Edge / Firefox signalent que le HTTPS affiché n’est pas fiable.**

Causes habituelles sur **`sip-ci.com`** avant ou après mise en redirection :

| Cause | À vérifier |
|--------|-------------|
| Aucun certificat SSL sur le serveur | Panneau hébergeur : activer **SSL**, ou installer **Certbot Let’s Encrypt** sur le VPS. |
| Certificat **auto-signé** ou de test | Remplacer par un certificat **public reconnu**. |
| Certificat **expiré** ou **révoqué** | Renouveler dans le panneau ou via `certbot renew`. |
| Certificat **pour un autre domaine** (ex. ancien CDN, `www.` seulement alors que vous ouvrez l’apex) | Dans le CSR / cert SAN : inclure **`sip-ci.com`** et **`www.sip-ci.com`** si les deux sont utilisés. |
| Mauvaise **chaîne complète** (intermédiaires manquants) | Recoller la **fullchain** fournie par l’AC dans la config serveur. |

**Tant que le certificat n’est pas correct**, vous pouvez **renommer temporairement `.htaccess`** (voir § *Secours temporaire* ci-dessous) pour retrouver du **HTTP** le temps du correctif avec l’hébergeur.

En résumé : **`.htaccess` envoie vers `https://` ; au serveur, il doit exister une connexion HTTPS propre avec un certificat de confiance pour `sip-ci.com`.**

### « Avant `.htaccess` tout allait bien » — mais j’ai installé un SSL et ça bloque encore

Ce n’est **pas un bug du fichier** : avant, vous voyiez très probablement le site en **`http://…`** sans chiffrement. En **`http:`**, Chrome ne compare rien avec un autorité — **aucun contrôle du certificat**, donc **aucun grand bandeau d’alerte**.

Dès que le `.htaccess` force **`https:`**, **chaque problème latent** du HTTPS apparaît.

Quand votre hébergeur vous dit « le certificat est installé » mais le navigateur continue d’avertir, en pratique c’est encore souvent l’un des cas suivants :

| Cas | À vérifier avec l’hébergeur |
|-----|------------------------------|
| **Chaîne incomplète** (intermédiaires manquants) | Déposer **fullchain** / certificat + bundle fourni avec le `.crt`. |
| **Certificat sur le mauvais vhost** | Le domaine **`sip-ci.com`** (apex) doit être sur le même vhost **`443`** que votre site, pas celui du serveur par défaut avec un ancien CN. |
| **SAN incomplet** | Le CSR / le cert doit lister **`sip-ci.com`** et **`www.sip-ci.com`** si les deux sont utilisés. |
| **Deux IPs différentes** | `sip-ci.com` et `www` pointent-elles vers le même serveur ? un cert installé « à côté » ne sert à rien. |
| **Cloudflare / CDN** | Mode pas en **Full (strict)** alors que l’origine n’a pas de TLS correct ; ou **Always Use HTTPS** côté CF sans cert bon sur l’origine. |

**Contrôle gratuit** : analysez votre domaine sur [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=sip-ci.com) et envoyez à l’hébergeur le détail (**chain issues**, **cert mismatch**, **hostname**).

### Secours temporaire (comme avant d’utiliser HTTPS)

Si vous devez **rouvrir le site en HTTP** le temps du ticket support (**non recommandé** pour un site public définitivement), renommez **`website/.htaccess`** en **`.htaccess.off`** sur le serveur (Apache ne lit plus les règles). Remettez le nom **`.htaccess`** dès que **https://sip-ci.com** s’affiche sans erreur avec un cadenas valide dans le navigateur.

