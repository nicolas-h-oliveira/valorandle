import { abilitiesData } from './data/abilities.js';
import { agents } from './data/agents.js'; 

export function initAbilityGame() {
  const homeScreen = document.getElementById('home-screen');
  const abilityGameScreen = document.getElementById('ability-game-screen');
  const gridOverlay = document.getElementById('grid-overlay');
  const wrongGuessBtn = document.getElementById('wrong-guess-btn'); // C'est maintenant le bouton Valider
  const startAbilityBtn = document.getElementById('start-ability-btn');
  const backToMenuBtn = document.getElementById('back-to-menu-btn-ability');
  const agentGameScreen = document.getElementById('game-container');
  const abilityImageHTML = document.getElementById('ability-image');
  
  const guessInput = document.getElementById('ability-guess-input');
  const suggestionsContainer = document.getElementById('suggestions-container');

  if (!homeScreen) return; // Sécurité si la page charge mal

  let currentAnswer = "";
  let squares = [];

  // --- 1. GÉNÉRATION DE LA GRILLE (Une seule fois au démarrage) ---
  for (let i = 0; i < 16; i++) {
    const square = document.createElement('div');
    square.classList.add('grid-square');
    gridOverlay.appendChild(square);
    squares.push(square); 
  }

  // --- 2. LANCEMENT DU JEU ---
  startAbilityBtn.addEventListener('click', () => {
    homeScreen.classList.add('hidden');
    abilityGameScreen.classList.remove('hidden');
    agentGameScreen.classList.add('hidden');
    
    // a. On tire une compétence au sort
    const randomAbility = abilitiesData[Math.floor(Math.random() * abilitiesData.length)];
    abilityImageHTML.src = randomAbility.image;
    currentAnswer = randomAbility.agent;

    //console.log("Chut, la bonne réponse est : " + currentAnswer);

    // b. ON RÉINITIALISE LA GRILLE ! (Correction de ton bug)
    squares.forEach(sq => sq.classList.remove('revealed')); // On remet tout au noir
    let randomIndex = Math.floor(Math.random() * squares.length);
    squares[randomIndex].classList.add('revealed'); // On en cache un seul

    // c. On vide la barre de recherche
    guessInput.value = "";
    suggestionsContainer.classList.add('hidden');
  });

  // --- 3. AUTO-COMPLÉTION ---
  guessInput.addEventListener('input', (e) => {
    const valeurSaisie = e.target.value.toLowerCase();
    suggestionsContainer.innerHTML = ''; 

    if (valeurSaisie.length === 0) {
      suggestionsContainer.classList.add('hidden');
      return;
    }

    const filteredAgents = agents.filter(agent => 
      agent.name.toLowerCase().startsWith(valeurSaisie)
    );

    if (filteredAgents.length > 0) {
      suggestionsContainer.classList.remove('hidden');
      
      filteredAgents.forEach(agent => {
        const div = document.createElement('div');
        div.classList.add('suggestion-item');
        
        // ASTUCE 1 : On enlève les caractères spéciaux (comme le "/" de KAY/O) pour le nom du fichier
        const safeAgentName = agent.name.replace('/', '');
        
        // ASTUCE 2 : Vite considère que le dossier "public" est la racine du site. 
        // Donc on écrit "/agents/..." et non "/public/agents/..."
        const iconPath = `/agents/${safeAgentName}_icon.webp`;
        
        div.innerHTML = `
          <img class="suggestion-icon" src="${iconPath}" alt="${agent.name}"> 
          <span>${agent.name}</span>
        `;
        
        div.addEventListener('click', () => {
          guessInput.value = agent.name;
          suggestionsContainer.classList.add('hidden');
        });

        suggestionsContainer.appendChild(div);
      });
    } else {
      suggestionsContainer.classList.add('hidden');
    }
  });

  // Cacher les suggestions si on clique ailleurs sur la page
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      suggestionsContainer.classList.add('hidden');
    }
  });

  // --- 4. VÉRIFICATION DE LA RÉPONSE ---
  wrongGuessBtn.addEventListener('click', () => {
    // On ajoute .trim() pour ignorer les espaces invisibles si le joueur en tape un par erreur
    const guess = guessInput.value.trim();
    if (!guess) return; 

    if (guess.toLowerCase() === currentAnswer.toLowerCase()) {
      // --- VICTOIRE ---
      console.log("Bonne réponse !");
      
      // On dévoile toute l'image (les 16 carrés disparaissent)
      squares.forEach(sq => sq.classList.add('revealed'));
      
      // On change temporairement le texte du bouton pour féliciter le joueur !
      wrongGuessBtn.textContent = "VICTOIRE !";
      wrongGuessBtn.style.backgroundColor = "#2ecc71"; // Un joli vert
      wrongGuessBtn.style.borderColor = "#2ecc71";
      
      // On remet le bouton à la normale après 3 secondes
      setTimeout(() => {
        wrongGuessBtn.textContent = "VALIDER";
        wrongGuessBtn.style.backgroundColor = "";
        wrongGuessBtn.style.borderColor = "";
      }, 3000);

      guessInput.value = "";
      
    } else {
      // --- MAUVAISE RÉPONSE ---
      const hiddenSquares = squares.filter(sq => !sq.classList.contains('revealed'));
      if (hiddenSquares.length > 0) {
        const randomHiddenIndex = Math.floor(Math.random() * hiddenSquares.length);
        hiddenSquares[randomHiddenIndex].classList.add('revealed');
      }
      
      // Petit feedback visuel sur le bouton
      wrongGuessBtn.textContent = "FAUX !";
      setTimeout(() => wrongGuessBtn.textContent = "VALIDER", 1000);
      
      guessInput.value = ""; 
    }
  });

  // --- RETOUR AU MENU ---
  backToMenuBtn.addEventListener('click', () => {
    abilityGameScreen.classList.add('hidden'); 
    homeScreen.classList.remove('hidden');     
    agentGameScreen.classList.add('hidden'); 
  });
}