# Pipeline Motion Design : Triade Agent1M, Agent2M & Agent3M

Ce pipeline d'agents IA spécialisés automatise et professionnalise la conception, l'intégration et la validation des animations web et du motion design.

---

## 🏗️ Architecture de la Triade

```
       [ Demande Utilisateur ]
                  │
                  ▼
   ┌─────────────────────────────┐
   │          Agent1M            │  🔎 Veille & Inspiration Web
   │  (agent1m-motion-scout)     │  Dribbble, Awwwards, CodePen, Mobbin
   └──────────────┬──────────────┘
                  │  Dossier d'inspiration & timings
                  ▼
   ┌─────────────────────────────┐
   │          Agent2M            │  📐 Conception & Implémentation
   │  (agent2m-motion-architect) │  Chorégraphie, CSS GPU, Tokens, a11y
   └──────────────┬──────────────┘
                  │  Code prêt & Guide de recette
                  ▼
   ┌─────────────────────────────┐
   │          Agent3M            │  🧪 Audit Qualité & Recette
   │     (agent3m-motion-qa)     │  Fluidité 60 FPS, browser tests, WCAG
   └──────────────┬──────────────┘
                  │
      [ Verdict : Validé / Tickets de correction ]
```

---

## 👥 Fiches Récapitulatives des Agents

| Agent | Identifiant | Mission principale | Outils autorisés | Livrable clé |
| :--- | :--- | :--- | :--- | :--- |
| **Agent1M** | `agent1m-motion-scout` | Recherche sur le web les meilleures inspirations, tendances, patterns d'animation et physiques de mouvement. | `search_web`, `read_url_content` | Dossier d'inspiration créative et physique de mouvement. |
| **Agent2M** | `agent2m-motion-architect` | Analyse les inspirations d'Agent1M, structure la chorégraphie d'animation, écrit et injecte le code CSS/JS 100% GPU-accéléré. | `view_file`, `write_to_file`, `replace_file_content` | Code d'animation intégré et guide de recette technique. |
| **Agent3M** | `agent3m-motion-qa` | Teste in situ les animations dans le navigateur, mesure la fluidité (60 FPS), vérifie l'accessibilité (`prefers-reduced-motion`) et le responsive. | `view_file`, `browser_subagent`, `run_command` | Verdict de conformité (Approuvé / Rejeté) avec tickets de correction. |

---

## 🚀 Comment Lancer la Triade (Exemples de Prompts)

### Scénario 1 : Lancer le flux complet de bout en bout
> *"Je veux animer les cartes de la section Nos Services sur la page d'accueil. Fais intervenir Agent1M pour trouver des inspirations d'animations subtiles et modernes, puis Agent2M pour concevoir et intégrer le code, et enfin Agent3M pour tester le bon fonctionnement et la fluidité."*

### Scénario 2 : Utiliser Agent1M isolément (Inspiration)
> *"@agent1m-motion-scout trouve-moi des idées de transitions de page et d'animations de curseur pour un site B2B industriel moderne."*

### Scénario 3 : Utiliser Agent2M isolément (Développement)
> *"@agent2m-motion-architect applique un effet de parallax léger sur les images des stations avec un timing fluide et le support de prefers-reduced-motion."*

### Scénario 4 : Utiliser Agent3M isolément (Recette)
> *"@agent3m-motion-qa teste les animations de la page d'accueil dans le navigateur et vérifie si le taux de rafraîchissement reste à 60 FPS sans saccades."*
