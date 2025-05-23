import { WebSocketServer, WebSocket } from "ws";
import WS_MSG from "./wsMessages";

var clientRooms: {
  [gameId: string]: {
    [roomNum: string]: [Map<string, WebSocket>, Object, Function | null]
  },
} = {};

export var wss: WebSocketServer;

export async function initWebSocketServer(server?: any){
  console.log("Starting websocket server...");
  wss = new WebSocketServer(server || {port: 5000}, () => {
    console.log("Websocket server opened");
  });
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      try{
        //@ts-ignore
        var inputObj: {userId: string, gameId: string, roomCode: number, msg: string, obj?: Object} | {type: string} = 
        JSON.parse(data.toString('utf-8'));
        if (!("type" in inputObj)) {
          if (inputObj.msg == WS_MSG.TRYING_TO_CREATE) //@ts-ignore
            createNewRoom(inputObj.userId,inputObj.gameId, inputObj.roomCode,ws, inputObj.obj);
          else if (inputObj.msg == WS_MSG.TRYING_TO_JOIN) //@ts-ignore
            joinRoom(inputObj.userId, inputObj.gameId, inputObj.roomCode, ws, inputObj.obj);
          else if (inputObj.msg == WS_MSG.TRYING_TO_SPECTATE) //@ts-ignore
            spectateRoom(inputObj.userId, inputObj.gameId, inputObj.roomCode, ws);
          else if (inputObj.msg == WS_MSG.CLOSING)
            leavePlayerFromRoom(inputObj.userId, inputObj.gameId, inputObj.roomCode);
          else if (inputObj.msg == WS_MSG.UPDATE_GAME_DATA){
            let func = clientRooms[inputObj.gameId][inputObj.roomCode][2]!;
            let map = clientRooms[inputObj.gameId][inputObj.roomCode][0];
            let serverObj = clientRooms[inputObj.gameId][inputObj.roomCode][1];
            let sentObj = inputObj.obj;
            func(inputObj.userId, map, serverObj, sentObj);
          }
          else {
            console.log("No handler for: ", data.toString('utf-8'));
            ws.send(WS_MSG.NO_HANDLER_FOR_GIVEN_INPUT);
          }
        }
      }
      catch (e) {
        console.log(e);
        ws.send(WS_MSG.ERROR_PROCESSING_INPUT);
      }
    });
  });
}

function createNewRoom(userId: string, gameId: string, roomCode: number, ws: WebSocket, initStart: Object){
  if (!(gameId in clientRooms)) clientRooms[gameId] = {};
  if (roomCode in clientRooms[gameId]) {
    ws.send(WS_MSG.ROOM_CODE_ALREADY_BEING_USED);
    return;
  } 
  clientRooms[gameId][roomCode] = [new Map(), {}, null];
  clientRooms[gameId][roomCode][0].set(userId, ws);
  import(`./gameFuncs/${gameId}.ts`)
  .then(res => {
    clientRooms[gameId][roomCode][2] = res.default;
    ws.send(WS_MSG.GAME_CREATED);
    res.default(userId, gameId, roomCode, ws, initStart);
  });
}

function joinRoom(userId: string, gameId: string, roomCode: number, ws: WebSocket, sentObj: Object){
  if (!(
    (gameId in clientRooms) && 
    (roomCode in clientRooms[gameId]) && 
    (clientRooms[gameId][roomCode][0].size >= 1)
  )) { 
    ws.send(WS_MSG.GAME_NOT_AVALIABLE);
    return;
  }
  let func = clientRooms[gameId][roomCode][2]!;
  let map = clientRooms[gameId][roomCode][0];
  let serverObj = clientRooms[gameId][roomCode][1];
  if (func(userId, map, serverObj, sentObj)) {
    clientRooms[gameId][roomCode][0].set(userId, ws);
    let numOfPlayers = clientRooms[gameId][roomCode][0].size;
    clientRooms[gameId][roomCode][0].forEach((w)=>{
      w.send(WS_MSG.JOINED_GAME);
      w.send(`${WS_MSG.NUM_OF_PLAYERS}%${numOfPlayers}`);
    });
  }
  else ws.send(WS_MSG.GAME_ALREADY_STARTED);
}

function spectateRoom(userId: string, gameId: string, roomCode: number, ws: WebSocket){
  if (!(
    (gameId in clientRooms) && 
    (roomCode in clientRooms[gameId]) && 
    (clientRooms[gameId][roomCode][0].size >= 1)
  )) { 
    ws.send(WS_MSG.GAME_NOT_AVALIABLE);
    return;
  }

  clientRooms[gameId][roomCode][0].set(userId, ws);
  let numOfPlayers = clientRooms[gameId][roomCode][0].size;
  clientRooms[gameId][roomCode][0].forEach((w)=>{
    w.send(`${WS_MSG.NUM_OF_PLAYERS}%${numOfPlayers}`);
  });
}

function leavePlayerFromRoom(userId: string, gameId: string, roomCode: number){
  clientRooms[gameId][roomCode][0].delete(userId);
  let numOfPlayers = clientRooms[gameId][roomCode][0].size;
  clientRooms[gameId][roomCode][0].forEach((w)=>{
    w.send(`${WS_MSG.NUM_OF_PLAYERS}%${numOfPlayers}`);
  });
  if (clientRooms[gameId][roomCode][0].size === 0) delete clientRooms[gameId][roomCode];
  if (Object.keys(clientRooms[gameId]).length === 0) delete clientRooms[gameId];
}

export function getWWS() { return wss; }

export function getAllRooms(){ return clientRooms; }

export function roomExists(gameId: string, roomCode: number): boolean {
  if (!(gameId in clientRooms)) return false;
  else if (!(roomCode in clientRooms[gameId])) return false;
  return true;
}

export function getTotalPlayers(gameId: string, roomCode: number){
  if (roomExists(gameId, roomCode))
    return clientRooms[gameId][roomCode][0].size;
  return 0;
}


export function removeRoom(gameId: string, roomCode: number){
  if (!(gameId in clientRooms))
    throw new Error(`The function removeRoom tried to remove gameid "${gameId}", which isn't in rooms.`);
  if(!clientRooms[gameId][roomCode])
    throw new Error(`The function removeRoom tried to remove room ${roomCode} for game id ${gameId}, which doesn't exist.`);
  delete clientRooms[gameId][roomCode];
  if (Object.keys(clientRooms[gameId]).length) delete clientRooms[gameId];
}
