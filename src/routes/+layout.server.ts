import { wss, initWebSocketServer } from "$lib/roomsStore";

export function load(){
  if (!wss) initWebSocketServer();
}