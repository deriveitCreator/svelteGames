import { wss, initWebSocketServer } from "$lib/roomsStore";

export function load(){
  if (!wss) initWebSocketServer({port: 5000});
}