import { WebSocketServer, WebSocket} from "ws";
import WS_MSG from "./wsMessages";
import type { Server } from 'http';

export var clientRooms: {
  [gameId: string]: {
    [roomNum: string]: [Map<string, WebSocket>, Object, Function | null]
  },
} = {};

export var wss: WebSocketServer;

export async function initWebSocketServer(input: Server | number){
  console.log("Starting websocket server...");
  // wss = new WebSocketServer({port: input as number}, () => {
  //  console.log("Websocket server opened");
  //});
  wss = new WebSocketServer({server: input as Server}, () => {
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
        else if (inputObj["type"] == "ping") ws.send("pong");
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
  console.log(`Creating new room (${gameId}, ${roomCode})...`);
  clientRooms[gameId][roomCode] = [new Map(), {}, null];
  clientRooms[gameId][roomCode][0].set(userId, ws);
  import(`$lib/gameFuncs/${gameId}.ts`)
  .then(res => {
    clientRooms[gameId][roomCode][2] = res.default;
    res.default(userId, gameId, roomCode, ws, initStart);
    ws.send(WS_MSG.GAME_CREATED);
    console.log(`Created new room (${gameId}, ${roomCode}).`);
  });
}

function joinRoom(userId: string, gameId: string, roomCode: number, ws: WebSocket, sentObj: Object){
  if (!(
    (gameId in clientRooms) && 
    (roomCode in clientRooms[gameId]) && 
    (clientRooms[gameId][roomCode][0].size >= 1)
  )) { 
    ws.send(WS_MSG.GAME_NOT_AVAILABLE);
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
    ws.send(WS_MSG.GAME_NOT_AVAILABLE);
    return;
  }

  let func = clientRooms[gameId][roomCode][2]!;
  let map = clientRooms[gameId][roomCode][0];
  let serverObj = clientRooms[gameId][roomCode][1];
  if (func(userId, map, serverObj, {canSpectate: true})) {
    ws.send(WS_MSG.ALLOW_SPECTATE_GAME);
    clientRooms[gameId][roomCode][0].set(userId, ws);
    let numOfPlayers = clientRooms[gameId][roomCode][0].size;
    clientRooms[gameId][roomCode][0].forEach((w)=>{
      w.send(`${WS_MSG.NUM_OF_PLAYERS}%${numOfPlayers}`);
    });
  }
  else ws.send(WS_MSG.GAME_NOT_AVAILABLE);
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

