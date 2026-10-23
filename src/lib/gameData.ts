const titleIndex = 0;
const descriptionIndex = 1;

const gameInfos: {[key: string]: [string, string]} = {
  "trainTracks": ["Train Tracks", "<p>Connect the two outside tracks by building one continuous path through the grid.</p><p>Pick a piece from the six track types on the right and place it in a square. The numbers on the top and left show how many track pieces each column and row should have (the two outside tracks aren't counted).</p><p>Use right click to delete a placed track.</p><p>You have 10 minutes to finish. You can also change the game ID to play a different game.</p>"],
  "gameOfLife": ["Game Of Life", "<p>The universe contains cells in one of two states: dead or alive.</p><p>The game begins with a random scattering of living cells. Each step, every cell counts its living neighbors. A dead cell is born if its neighbor count matches your birth setting, and a living cell survives if its count matches your survival setting. Every other cell dies or stays dead.</p><p>Here are popular rules written as Born/Survive. For example, B3/S23 means a cell is born with 3 neighbors and survives with 2 or 3:</p><ul><li><b><u>Conway's Game of Life:</u></b> B3/S23</li><li><b><u>HighLife:</u></b> B36/S23</li><li><b><u>Morley:</u></b> B368/S245</li><li><b><u>Maze:</u></b> B3/S12345</li><li><b><u>Shoots and Roots:</u></b> B3/S245678</li><li><b><u>Walled Cities:</u></b> B45678/S2345</li><li><b><u>Anneal:</u></b> B4678/S35678</li></ul><p>There are many <a href='https://conwaylife.com/wiki/List_of_Life-like_rules' target='_blank'>other rules</a> can you explore as well.</p><p>You can change the seed for a different starting state. A higher last digit creates a denser universe.</p><p>You can also explore the universe using W/A/S/D to move and scroll to zoom.</p>"],
  "zeroPlayerGames": ["Zero Player Games", "<p>A <b>zero-player game</b> is a simulation game that has no sentient players.<br/></p>"],
  "platformShooters": ["Platform Shooters", "<p>Shoot the other player and get the higher score.<br/></p>"],
  "trafficSpring": ["Traffic Spring", "<p>You are either the red spring (P1) or blue spring (P2).<br/>Avoid the green cars.<br/><br/>Press S to start in single player mode.<br/>Press T to start in two player mode.<br/><br/><u>Controls for P1:</u> W, A, D.<br/><u>Controls for P2:</u> left, right and up arrow keys.<br/><br/>In single player mode, the goal is to get the highest score.<br/>In two player mode, the goal is to last longer than the opponent.</p>"],
}

export function getGameIds(): string[] { return Object.keys(gameInfos); }

export function getGameInfo(id: string): [string, string] { return gameInfos[id]; }

export function getGameTitle(id: string): string { return gameInfos[id][titleIndex]; }

export function getGameDescription(id: string): string { return gameInfos[id][descriptionIndex]; }