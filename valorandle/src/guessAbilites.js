// On importe notre base de données
import { abilitiesData } from './data/abilities.js';

export function initAbilityGame() {
  const homeScreen = document.getElementById('home-screen');
  const abilityGameScreen = document.getElementById('ability-game-screen');
  const gridOverlay = document.getElementById('grid-overlay');
  const wrongGuessBtn = document.getElementById('wrong-guess-btn');
  const startAbilityBtn = document.getElementById('start-ability-btn');
  const backToMenuBtn = document.getElementById('back-to-menu-btn-ability');
  const agentGameScreen = document.getElementById('game-container');
  
  // --- NOUVEAU : Récupérer l'image HTML ---
  const abilityImageHTML = document.getElementById('ability-image');

  if (
    !homeScreen ||
    !abilityGameScreen ||
    !gridOverlay ||
    !wrongGuessBtn ||
    !startAbilityBtn ||
    !backToMenuBtn ||
    !agentGameScreen ||
    !abilityImageHTML
  ) {
    console.error("Des éléments du mode abilité sont introuvables dans le DOM.");
    return;
  }
  
  // Variable pour stocker la bonne réponse
  let currentAnswer = "";

  // Action quand on clique sur "Devine l'abilité"
  startAbilityBtn.addEventListener('click', () => {
    homeScreen.classList.add('hidden');
    abilityGameScreen.classList.remove('hidden');
    agentGameScreen.classList.add('hidden');
    
    // --- NOUVEAU : Tirer au sort une compétence quand on lance le jeu ---
    const randomAbility = abilitiesData[Math.floor(Math.random() * abilitiesData.length)];
    
    // On met à jour l'image à l'écran
    abilityImageHTML.src = randomAbility.image;
    
    // On garde la réponse en mémoire pour vérifier plus tard
    currentAnswer = randomAbility.agent;
    console.log("Chut, la bonne réponse est : " + currentAnswer);
  });


  // Revenir au menu principal
  backToMenuBtn.addEventListener('click', () => {
    abilityGameScreen.classList.add('hidden'); // On cache le jeu
    homeScreen.classList.remove('hidden');     // On réaffiche le menu
    agentGameScreen.classList.add('hidden'); // On s'assure que le jeu d'agent est caché si on venait de là
  });

  // 1. Générer les 16 carrés
  let squares = [];
  for (let i = 0; i < 16; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-square');
    gridOverlay.appendChild(square);
    squares.push(square); 
  }

  // 2. Cacher un carré au hasard au tout début (15 restants)
  let randomIndex = Math.floor(Math.random() * squares.length);
  squares[randomIndex].classList.add('revealed');

  // 3. Quand on clique sur le bouton "Fausse réponse"
  wrongGuessBtn.addEventListener('click', () => {
    const hiddenSquares = squares.filter(sq => !sq.classList.contains('revealed'));
    
    if (hiddenSquares.length > 0) {
      const randomHiddenIndex = Math.floor(Math.random() * hiddenSquares.length);
      hiddenSquares[randomHiddenIndex].classList.add('revealed');
    } else {
      console.log("Toute l'image est deja visible !");
    }
  });
}