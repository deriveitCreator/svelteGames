import { getGameTitle, getGameDescription } from "$lib/gameData";

export function load({ params }) {
  return {
    title: getGameTitle(params.gameId), 
    description: getGameDescription(params.gameId), 
    jsLoc: `/gameData/${params.gameId}/game.js`
  };
}