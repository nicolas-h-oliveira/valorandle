import './style.css'


const guessRows = document.getElementById("guessRows");

// Revenir au menu principal
backToMenuBtn.addEventListener('click', () => {
  abilityGameScreen.classList.add('hidden'); // On cache le jeu
  homeScreen.classList.remove('hidden');     // On réaffiche le menu
  agentGameScreen.classList.add('hidden'); // On s'assure que le jeu d'agent est caché si on venait de là
});

function addGuessRow(agent){

  const row = document.createElement("div");
  row.className = "guess-row";

  row.innerHTML = `
    <div class="guess-cell">${agent.name}</div>
    <div class="guess-cell">${agent.gender}</div>
    <div class="guess-cell">${agent.species}</div>
    <div class="guess-cell">${agent.role}</div>
    <div class="guess-cell">${agent.origin}</div>
    <div class="guess-cell">${agent.year}</div>
  `;

  guessRows.appendChild(row);
}