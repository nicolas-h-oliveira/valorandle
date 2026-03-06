import './style.css';
import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK("1479482492150091971"); // Ton Client ID

async function setupDiscordSdk() {
  // 1. On attend que Discord soit prêt
  await discordSdk.ready();
  console.log("Le SDK Discord est prêt !");
  
  // 2. On récupère nos éléments HTML
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const startBtn = document.getElementById('start-btn');
  
  // 3. On cache le chargement et on affiche l'accueil
  loadingScreen.classList.add('hidden');
  homeScreen.classList.remove('hidden');

  // 4. On écoute le clic sur le bouton Commencer
  startBtn.addEventListener('click', () => {
    console.log("Le joueur a cliqué sur Commencer !");
    // C'est ici qu'on lancera la page de jeu plus tard !
  });
}

// On lance la fonction
setupDiscordSdk();