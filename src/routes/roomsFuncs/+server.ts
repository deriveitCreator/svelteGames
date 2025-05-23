import { json } from '@sveltejs/kit';
import { roomExists, getAllRooms, getWWS, getTotalPlayers } from '$lib/roomsStore.js';

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