import './style.css';
import { DiscordSDK } from "@discord/embedded-app-sdk";
import { initAbilityGame } from './guessAbilites.js';

const discordSdk = new DiscordSDK("1479482492150091971"); // Ton Client ID

async function setupDiscordSdk() {
  // 1. On attend que Discord soit prêt
  await discordSdk.ready();
  console.log("Le SDK Discord est prêt !");
  
  // 2. On récupère nos éléments HTML
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const startBtn = document.getElementById('start-btn');
  const agentGameScreen = document.getElementById('game-container');
  const backToMenuAgentBtn = document.getElementById('back-to-menu-btn-agent');
  
  // 3. On cache le chargement et on affiche l'accueil
  loadingScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');
  agentGameScreen.classList.add('hidden'); // On s'assure que le jeu d'agent est caché au départ

  // 4. On écoute le clic sur le bouton Commencer
  startBtn.addEventListener('click', () => {
    console.log("Le joueur a cliqué sur Commencer !");
    homeScreen.classList.add('hidden');
    agentGameScreen.classList.remove('hidden');
  });

  if (backToMenuAgentBtn) {
    backToMenuAgentBtn.addEventListener('click', () => {
      agentGameScreen.classList.add('hidden');
      homeScreen.classList.remove('hidden');
    });
  }

  initAbilityGame();
  
}

// On lance la fonction
setupDiscordSdk();