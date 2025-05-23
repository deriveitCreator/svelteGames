import { getGameTitle, getGameDescription, isGameOnlineMultiplayer } from "$lib/gameData";

export function load({ params }) {
  return {
    gameId: params.gameId,
    title: getGameTitle(params.gameId), 
    description: getGameDescription(params.gameId), 
    jsLoc: `gameData/${params.gameId}/game.js`,
    isOnlineMultiplayer: isGameOnlineMultiplayer(params.gameId)
  };
}
