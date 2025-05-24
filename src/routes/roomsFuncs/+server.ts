import { json } from '@sveltejs/kit';
import { clientRooms, wss } from '$lib/roomsStore.js';

export async function POST({ request }) {
  const input = await request.json();

  if (input.method === "checkRoomExists")
    return json({"exist": roomExists(input.gameId, input.roomCode)});
  else if (input.method === "getTotalPlayers")
    return json({"num": getTotalPlayers(input.gameId, input.roomCode)});
  else if (input.method === "getAllRooms")
    return json(getAllRooms());
  else if (input.method === "showWSS")
    console.log(getWWS());

  return json({});
}

function getWWS() { return wss; }

function getAllRooms(){ return clientRooms; }

function roomExists(gameId: string, roomCode: number): boolean {
  console.log("roomExists", clientRooms);
  if (!(gameId in clientRooms)) return false;
  else if (!(roomCode in clientRooms[gameId])) return false;
  return true;
}

function getTotalPlayers(gameId: string, roomCode: number){
  if (roomExists(gameId, roomCode))
    return clientRooms[gameId][roomCode][0].size;
  return 0;
}

function removeRoom(gameId: string, roomCode: number){
  if (!(gameId in clientRooms))
    throw new Error(`The function removeRoom tried to remove gameid "${gameId}", which isn't in rooms.`);
  if(!clientRooms[gameId][roomCode])
    throw new Error(`The function removeRoom tried to remove room ${roomCode} for game id ${gameId}, which doesn't exist.`);
  delete clientRooms[gameId][roomCode];
  if (Object.keys(clientRooms[gameId]).length) delete clientRooms[gameId];
}
