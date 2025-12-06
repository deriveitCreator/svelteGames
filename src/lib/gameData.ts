const titleIndex = 0;
const descriptionIndex = 1;

const gameInfos: {[key: string]: [string, string]} = {
  "jumpyMan": ["Jumpy Man", "<p>You are either the red box (P1) or blue box (P2).<br/>Avoid the green boxes.<br/><br/>Press S to start in single player mode.<br/>Press T to start in two player mode.<br/><br/><u>Controls for P1:</u> W, A, D.<br/><u>Controls for P2:</u> left, right and up arrow keys.<br/><br/>In single player mode, the goal is to get the highest score.<br/>In two player mode, the goal is to last longer than the opponent.</p>"],
  "platformShooters": ["Platform Shooters", "<p>Shoot the other player and get the higher score.<br/></p>"]
}

export function getGameIds(): string[] {
  return Object.keys(gameInfos);
}

export function getGameInfo(id: string): [string, string] {
  return gameInfos[id];
}

export function getGameTitle(id: string): string {
  return gameInfos[id][titleIndex];
}

export function getGameDescription(id: string): string {
  return gameInfos[id][descriptionIndex];
}