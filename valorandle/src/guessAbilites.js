import { abilitiesData } from './data/abilities.js';
import { agents } from './data/agents.js';

const GRID_SQUARE_COUNT = 16;

function normalizeValue(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/gi, '');
}

function getAgentIconPath(agentName) {
  const safeName = agentName.replaceAll(/[^a-z0-9]/gi, '');
  return `/agents/${safeName}_icon.webp`;
}

function createGridSquares(gridOverlay) {
  gridOverlay.innerHTML = '';
  const squares = [];
  for (let index = 0; index < GRID_SQUARE_COUNT; index += 1) {
    const square = document.createElement('div');
    square.className = 'grid-square';
    gridOverlay.appendChild(square);
    squares.push(square);
  }
  return squares;
}

// AMÉLIORATION : On passe "guessedSet" pour cacher les agents déjà tentés
function renderSuggestions(inputValue, container, onSelect, guessedSet) {
  const query = inputValue.trim().toLowerCase();
  container.innerHTML = '';

  if (!query) {
    container.classList.add('hidden');
    return;
  }

  const filteredAgents = agents
    .filter((agent) => agent.name.toLowerCase().startsWith(query) && !guessedSet.has(normalizeValue(agent.name)))
    .slice(0, 7);

  if (!filteredAgents.length) {
    container.classList.add('hidden');
    return;
  }

  filteredAgents.forEach((agent) => {
    const suggestion = document.createElement('button');
    suggestion.type = 'button';
    suggestion.className = 'suggestion-item';
    suggestion.innerHTML = `
      <img class="suggestion-icon" src="${getAgentIconPath(agent.name)}" alt="${agent.name}" />
      <span>${agent.name}</span>
    `;

    suggestion.addEventListener('click', () => onSelect(agent.name));
    container.appendChild(suggestion);
  });

  container.classList.remove('hidden');
}

export function initAbilityGame() {
  const homeScreen = document.getElementById('home-screen');
  const abilityGameScreen = document.getElementById('ability-game-screen');
  const agentGameScreen = document.getElementById('agent-game-screen');
  const startAbilityBtn = document.getElementById('start-ability-btn');
  const backToMenuBtn = document.getElementById('back-to-menu-btn-ability');
  const gridOverlay = document.getElementById('grid-overlay');
  const abilityImage = document.getElementById('ability-image');
  const guessInput = document.getElementById('ability-guess-input');
  const submitBtn = document.getElementById('wrong-guess-btn');
  const suggestionsContainer = document.getElementById('ability-suggestions-container');
  const toast = document.getElementById('toast-notification');
  const toastAgentName = document.getElementById('toast-agent-name');
  
  // NOUVEAU : Conteneur historique
  const guessHistoryContainer = document.getElementById('ability-guess-history');

  const requiredElements = [
    homeScreen, abilityGameScreen, startAbilityBtn, backToMenuBtn,
    gridOverlay, abilityImage, guessInput, submitBtn, suggestionsContainer, guessHistoryContainer
  ];

  if (requiredElements.some((element) => !element)) {
    console.warn('Ability game init skipped: missing DOM elements.');
    return;
  }

  const squares = createGridSquares(gridOverlay);
  let currentAnswer = '';
  // NOUVEAU : Mémoire des essais de la partie en cours
  let guessedAgentsSet = new Set(); 

  function resetRound() {
    const randomAbility = abilitiesData[Math.floor(Math.random() * abilitiesData.length)];
    currentAnswer = randomAbility.agent;
    abilityImage.src = randomAbility.image;
    abilityImage.alt = `Competence mystere de ${currentAnswer}`;

    squares.forEach((square) => square.classList.remove('revealed'));
    squares[Math.floor(Math.random() * squares.length)].classList.add('revealed');

    guessInput.value = '';
    suggestionsContainer.classList.add('hidden');
    suggestionsContainer.innerHTML = '';
    
    // NOUVEAU : On vide la mémoire et l'historique visuel à chaque nouvelle partie
    guessedAgentsSet.clear();
    guessHistoryContainer.innerHTML = '';
  }

  function openGame() {
    homeScreen.classList.add('hidden');
    abilityGameScreen.classList.remove('hidden');
    agentGameScreen?.classList.add('hidden');
    resetRound();
    guessInput.focus();
  }

  function returnToMenu() {
    abilityGameScreen.classList.add('hidden');
    agentGameScreen?.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    suggestionsContainer.classList.add('hidden');
  }

  function revealOneSquare() {
    const hiddenSquares = squares.filter((square) => !square.classList.contains('revealed'));
    if (!hiddenSquares.length) return;
    hiddenSquares[Math.floor(Math.random() * hiddenSquares.length)].classList.add('revealed');
  }

  function showToast() {
    if (!toast || !toastAgentName) return;
    toastAgentName.textContent = currentAnswer;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function submitGuess() {
    let rawGuess = guessInput.value.trim();
    if (!rawGuess || !currentAnswer) return;

    // AMÉLIORATION : Si le joueur n'a tapé qu'un bout du nom ("brim"), on auto-complète avec le premier choix !
    let guessAgent = agents.find((a) => normalizeValue(a.name) === normalizeValue(rawGuess));
    if (!guessAgent) {
      const query = rawGuess.toLowerCase();
      // On cherche les agents qui commencent par ça ET qui n'ont pas encore été joués
      const possibleAgents = agents.filter(agent => agent.name.toLowerCase().startsWith(query) && !guessedAgentsSet.has(normalizeValue(agent.name)));
      
      if (possibleAgents.length > 0) {
        guessAgent = possibleAgents[0]; // Magie : on prend le premier de la liste !
      } else {
        // Vraiment introuvable
        guessInput.classList.add('input-error');
        setTimeout(() => guessInput.classList.remove('input-error'), 600);
        return;
      }
    }

    const normalizedGuess = normalizeValue(guessAgent.name);

    // Si déjà essayé, on ignore l'action
    if (guessedAgentsSet.has(normalizedGuess)) {
      guessInput.value = '';
      return;
    }

    // On mémorise la tentative
    guessedAgentsSet.add(normalizedGuess);

    // --- CRÉATION DE L'ICÔNE DANS L'HISTORIQUE ---
    const historyIcon = document.createElement('img');
    historyIcon.src = getAgentIconPath(guessAgent.name);
    historyIcon.className = 'history-icon';
    historyIcon.title = guessAgent.name; // Affiche le nom au survol de la souris

    // SI BONNE RÉPONSE ✅
    if (normalizedGuess === normalizeValue(currentAnswer)) {
      historyIcon.classList.add('history-correct');
      guessHistoryContainer.appendChild(historyIcon); // Ajoute le vert dans l'historique
      
      squares.forEach((square) => square.classList.add('revealed'));
      showToast();
      guessInput.value = '';
      suggestionsContainer.classList.add('hidden');
      return;
    }

    // SI MAUVAISE RÉPONSE ❌
    historyIcon.classList.add('history-wrong');
    guessHistoryContainer.appendChild(historyIcon); // Ajoute le rouge grisé dans l'historique

    revealOneSquare();
    guessInput.classList.add('input-error');
    setTimeout(() => guessInput.classList.remove('input-error'), 600);

    guessInput.value = '';
    suggestionsContainer.classList.add('hidden');
    guessInput.focus();
  }

  startAbilityBtn.addEventListener('click', openGame);
  backToMenuBtn.addEventListener('click', returnToMenu);
  submitBtn.addEventListener('click', submitGuess);

  guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitGuess();
    }
  });

  guessInput.addEventListener('input', (event) => {
    // On passe guessedAgentsSet pour que renderSuggestions masque les choix déjà faits
    renderSuggestions(event.target.value, suggestionsContainer, (selectedAgentName) => {
      guessInput.value = selectedAgentName;
      submitGuess(); // AMÉLIORATION : Valide directement si on clique sur une suggestion
    }, guessedAgentsSet); 
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#ability-game-screen .search-wrapper')) {
      suggestionsContainer.classList.add('hidden');
    }
  });
}