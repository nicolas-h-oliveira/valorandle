import './style.css';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import { initAbilityGame } from './guessAbilites.js';
import { initAgentGame } from './guessAgents.js';

const DISCORD_CLIENT_ID = '1479482492150091971';
const DISCORD_READY_TIMEOUT_MS = 2500;

async function waitForDiscordSdk() {
  try {
    const discordSdk = new DiscordSDK(DISCORD_CLIENT_ID);

    await Promise.race([
      discordSdk.ready(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Discord SDK timeout')), DISCORD_READY_TIMEOUT_MS);
      }),
    ]);

    console.log('Discord SDK pret.');
  } catch (error) {
    // The app should still run in a normal browser when Discord SDK is unavailable.
    console.warn('Discord SDK indisponible, lancement en mode navigateur.', error);
  }
}

function showHomeScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const homeScreen = document.getElementById('home-screen');
  const agentGameScreen = document.getElementById('agent-game-screen');
  const abilityGameScreen = document.getElementById('ability-game-screen');

  loadingScreen?.classList.add('hidden');
  homeScreen?.classList.remove('hidden');
  agentGameScreen?.classList.add('hidden');
  abilityGameScreen?.classList.add('hidden');
}

await waitForDiscordSdk();
showHomeScreen();
initAgentGame();
initAbilityGame();
