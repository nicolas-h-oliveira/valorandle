# 🎮 Valorandle

Mini-jeu inspiré de Wordle, dans l'univers de Valorant, pensé pour une intégration en Activité Discord (Embedded App).

## ✨ Aperçu

Le projet propose actuellement deux modes :

- `Devine l'agent` (interface prête, logique en cours)
- `Devine l'abilité` (jouable)

L'application est une SPA en JavaScript vanilla, avec une direction visuelle inspirée de Valorant (`#ff4655`, UI sombre).

## ✅ Fonctionnalités actuelles

- `Devine l'abilité` : une compétence est cachée derrière une grille `4x4`.
- `Progression visuelle` : à chaque erreur, un carré se révèle.
- `Navigation fluide` : passage menu <-> jeu sans rechargement de page.
- `Discord SDK` : connexion via `@discord/embedded-app-sdk`.
- `Devine l'agent` : écran présent, logique partielle.

## 🧱 Stack technique

- `HTML5 / CSS3 / JavaScript (ES Modules)`
- `Vite`
- `@discord/embedded-app-sdk`
- `cloudflared`

## 📂 Structure du dépôt

Le dépôt contient un dossier racine et l'application dans `valorandle/`.

```text
.
|- README.md
`- valorandle/
   |- index.html
   |- package.json
   |- vite.config.js
   |- public/
   |  `- abilities/
   `- src/
      |- main.js
      |- style.css
      |- guessAbilites.js
      |- guessAgents.js
      |- data/
      |  |- abilities.js
      |  `- agents.js
      `- game/
         `- gameLogic.js
```

## 🚀 Démarrage rapide

### Prérequis

1. Installer [Node.js](https://nodejs.org/).
2. Installer [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).
3. Avoir une application configurée sur le [Portail Développeur Discord](https://discord.com/developers/applications).

### Installation

Depuis la racine du dépôt :

```bash
cd valorandle
npm install
```

## 🔁 Routine de lancement (Discord Activity)

### Terminal 1 - lancer Vite

```bash
cd valorandle
npm run dev -- --host
```

### Terminal 2 - ouvrir le tunnel Cloudflare

```bash
cloudflared tunnel --url http://127.0.0.1:5173
```

### Mettre à jour l'URL dans Discord

1. Copier l'URL renvoyée par Cloudflare (`https://xxxx.trycloudflare.com`).
2. Aller sur `Discord Developer Portal > Votre App > Activities`.
3. Mettre à jour `URL Mappings` avec cette URL.
4. Dans Discord desktop : `Ctrl + R`, rejoindre un salon vocal, puis lancer l'activité.

## 🛠️ Scripts npm

À exécuter depuis `valorandle/` :

```bash
npm run dev
npm run build
npm run preview
```

## 📝 Notes de développement

- Le `Client ID` Discord est défini dans `valorandle/src/main.js`.
- Les images de compétences sont stockées dans `valorandle/public/abilities/`.
- Le mode `Devine l'agent` est visible dans l'UI, mais sa logique complète reste à finaliser.

## 👥 Auteurs

- Dayane69
- Mouhamad-Amine
