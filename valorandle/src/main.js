import { DiscordSDK } from "@discord/embedded-app-sdk";

// On préparera ici l'ID de ton application Discord plus tard
const discordSdk = new DiscordSDK("TON_CLIENT_ID_ICI");

async function setupDiscordSdk() {
  // On attend que le SDK soit prêt à fonctionner
  await discordSdk.ready();
  console.log("Le SDK Discord est prêt !");
  
  // On change le texte de notre page pour confirmer
  document.querySelector('#app').innerHTML = `<h1>Valodle est prêt à être intégré !</h1>`;
}

// On lance la fonction
setupDiscordSdk();