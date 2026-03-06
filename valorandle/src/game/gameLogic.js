import { agents } from "../data/agents";

export function getRandomAgent() {
  return agents[Math.floor(Math.random() * agents.length)];
}

export function checkGuess(guess, answer) {

  return {
    role: guess.role === answer.role,
    origin: guess.origin === answer.origin,
    gender: guess.gender === answer.gender,
    year: guess.year === answer.year
  };

}