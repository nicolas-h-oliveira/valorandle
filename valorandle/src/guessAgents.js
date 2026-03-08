import { agents } from './data/agents.js';

function normalizeValue(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]/gi, '');
}

function getAgentIconPath(agentName) {
  const safeName = agentName.replaceAll(/[^a-z0-9]/gi, '');
  return `/agents/${safeName}_icon.webp`;
}

function getRandomAgent() {
  return agents[Math.floor(Math.random() * agents.length)];
}

function findAgentByName(inputValue) {
  const normalizedInput = normalizeValue(inputValue);
  return agents.find((agent) => normalizeValue(agent.name) === normalizedInput);
}

function getYearState(guessYear, answerYear) {
  const guess = Number(guessYear);
  const answer = Number(answerYear);

  if (guess === answer) return { state: 'correct', label: String(guessYear) };
  if (Math.abs(guess - answer) <= 1) {
    const hintArrow = guess < answer ? '↑' : '↓';
    return { state: 'close', label: `${guessYear} ${hintArrow}` };
  }

  const hintArrow = guess < answer ? '↑' : '↓';
  return { state: 'wrong', label: `${guessYear} ${hintArrow}` };
}

function setFeedback(feedbackElement, message, type) {
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback-message ${type}`;
  feedbackElement.classList.remove('hidden');
}

function addGuessRow(container, guessAgent, answerAgent) {
  const row = document.createElement('div');
  row.className = 'guess-row';

  const nameState = normalizeValue(guessAgent.name) === normalizeValue(answerAgent.name) ? 'correct' : 'wrong';
  const roleState = guessAgent.role === answerAgent.role ? 'correct' : 'wrong';
  const genderState = guessAgent.gender === answerAgent.gender ? 'correct' : 'wrong';
  const originState = guessAgent.origin === answerAgent.origin ? 'correct' : 'wrong';
  const yearResult = getYearState(guessAgent.year, answerAgent.year);

  // Cellule image (première, visible immédiatement)
  const imgCell = document.createElement('div');
  imgCell.className = `guess-cell ${nameState} cell-reveal`;
  imgCell.innerHTML = `<img class="guess-agent-icon" src="${getAgentIconPath(guessAgent.name)}" alt="${guessAgent.name}" />`;
  row.appendChild(imgCell);

  // Les 4 cellules texte suivantes
  const cells = [
    { state: genderState, label: guessAgent.gender },
    { state: roleState,   label: guessAgent.role },
    { state: originState, label: guessAgent.origin },
    { state: yearResult.state, label: yearResult.label },
  ];

  cells.forEach(({ state, label }, i) => {
    const cell = document.createElement('div');
    cell.className = `guess-cell ${state} cell-reveal cell-hidden`;
    cell.textContent = label;

    setTimeout(() => {
      cell.classList.remove('cell-hidden');
      cell.classList.add('cell-visible');
    }, 500 * (i + 1));

    row.appendChild(cell);
  });

  container.prepend(row);
}

function renderSuggestions(inputValue, container, onSelect) {
  const query = inputValue.trim().toLowerCase();
  container.innerHTML = '';

  if (!query) {
    container.classList.add('hidden');
    return;
  }

  const filteredAgents = agents
    .filter((agent) => agent.name.toLowerCase().startsWith(query))
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

export function initAgentGame() {
  const homeScreen = document.getElementById('home-screen');
  const agentGameScreen = document.getElementById('agent-game-screen');
  const abilityGameScreen = document.getElementById('ability-game-screen');
  const startAgentBtn = document.getElementById('start-agent-btn');
  const backToMenuAgentBtn = document.getElementById('back-to-menu-btn-agent');
  const guessInput = document.getElementById('agent-guess-input');
  const submitGuessBtn = document.getElementById('agent-submit-guess');
  const guessRows = document.getElementById('guessRows');
  const feedback = document.getElementById('agent-feedback');
  const suggestionsContainer = document.getElementById('agent-suggestions-container');

  const requiredElements = [
    homeScreen,
    agentGameScreen,
    startAgentBtn,
    backToMenuAgentBtn,
    guessInput,
    submitGuessBtn,
    guessRows,
    feedback,
    suggestionsContainer,
  ];

  if (requiredElements.some((element) => !element)) {
    console.warn('Agent game init skipped: missing DOM elements.');
    return;
  }

  let answerAgent = getRandomAgent();
  const guessedAgents = new Set();

  function resetGame() {
    answerAgent = getRandomAgent();
    guessedAgents.clear();
    guessRows.innerHTML = '';
    guessInput.value = '';
    suggestionsContainer.classList.add('hidden');
    feedback.classList.add('hidden');
    feedback.textContent = '';
  }

  function showGameScreen() {
    homeScreen.classList.add('hidden');
    agentGameScreen.classList.remove('hidden');
    abilityGameScreen?.classList.add('hidden');

    resetGame();
    guessInput.focus();
  }

  function returnToMenu() {
    agentGameScreen.classList.add('hidden');
    abilityGameScreen?.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    suggestionsContainer.classList.add('hidden');
  }

  function submitGuess() {
    const rawGuess = guessInput.value.trim();
    if (!rawGuess) {
      setFeedback(feedback, 'Entre un nom d\'agent avant de valider.', 'warning');
      return;
    }

    const guessAgent = findAgentByName(rawGuess);
    if (!guessAgent) {
      setFeedback(feedback, 'Agent inconnu. Utilise la liste de suggestions.', 'error');
      guessInput.classList.add('input-error');
      setTimeout(() => guessInput.classList.remove('input-error'), 500);
      return;
    }

    const guessKey = normalizeValue(guessAgent.name);
    if (guessedAgents.has(guessKey)) {
      setFeedback(feedback, 'Tu as deja propose cet agent.', 'warning');
      guessInput.value = '';
      return;
    }

    guessedAgents.add(guessKey);
    addGuessRow(guessRows, guessAgent, answerAgent);

    if (guessKey === normalizeValue(answerAgent.name)) {
      setFeedback(feedback, `Bien joue ! L'agent du jour est ${answerAgent.name}.`, 'success');
    } else {
      setFeedback(feedback, 'Pas encore. Continue !', 'info');
    }

    guessInput.value = '';
    suggestionsContainer.classList.add('hidden');
    guessInput.focus();
  }

  startAgentBtn.addEventListener('click', showGameScreen);
  backToMenuAgentBtn.addEventListener('click', returnToMenu);
  submitGuessBtn.addEventListener('click', submitGuess);

  guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitGuess();
    }
  });

  guessInput.addEventListener('input', (event) => {
    renderSuggestions(event.target.value, suggestionsContainer, (selectedAgentName) => {
      guessInput.value = selectedAgentName;
      suggestionsContainer.classList.add('hidden');
      guessInput.focus();
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#agent-game-screen .search-wrapper')) {
      suggestionsContainer.classList.add('hidden');
    }
  });
}
