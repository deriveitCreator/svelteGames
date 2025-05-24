import type WebSocket from "ws";
import WS_MSG from "../wsMessages";

type ServerObject = {
  p2Here: boolean,
  timeInterval: NodeJS.Timeout,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  newEnemy: [number, number], //width, speed
  winner: number 
};

type SentObject = 
  { winner: string } | 
  { startEnd: boolean } | //true if want to start, end otherwise
  { playerNum: 1 | 2 | 3, x: number, y: number };

export default function jumpyManOnline(
  curUser: string, idWsMap: Map<string, WebSocket>, serverObj: ServerObject, sentObj: SentObject
) : boolean 
{
  if (serverObj.winner || ("winner" in sentObj)){
    let curWinner;
    if (serverObj.winner) curWinner = serverObj.winner;
    else {
      //@ts-ignore
      curWinner = parseInt(sentObj["winner"]);
      serverObj.winner = curWinner;
    }
    idWsMap.forEach((ws)=>{
      ws.send(`${WS_MSG.FROM_SERVER_GAME_DATA}%${JSON.stringify({winner: curWinner})}`);
    });
  }
  else if ("playerNum" in sentObj) {
    if (sentObj.playerNum === 1) {
      serverObj.x1 = sentObj.x;
      serverObj.y1 = sentObj.y;
    }
    else if (sentObj.playerNum === 2) {
      serverObj.x2 = sentObj.x;
      serverObj.y2 = sentObj.y;
    }
    idWsMap.forEach((ws)=>{
      ws.send(`${WS_MSG.FROM_SERVER_GAME_DATA}%${JSON.stringify({
        x1: serverObj.x1,
        y1: serverObj.y1,
        x2: serverObj.x2,
        y2: serverObj.y2,
      })}`);
    });
  }
  else if ("startEnd" in sentObj) {
    if (sentObj["startEnd"]) {
      serverObj.winner = 0;
      serverObj.timeInterval = setInterval(()=>{
        let enemyObj = {newEnemy: [(Math.random()*30) + 20, (Math.random()*6)+1]};
        idWsMap.forEach((ws)=>{
          ws.send(`${WS_MSG.FROM_SERVER_GAME_DATA}%${JSON.stringify(enemyObj)}`);
        });
      }, 2000);
    }
    else clearInterval(serverObj.timeInterval);
  }
  else if ("p2Here" in sentObj) {
    if (serverObj.p2Here) return false;
    serverObj.p2Here = true;
    return true;
  }
  else if ("p1Here" in sentObj) serverObj.p2Here = false;
  else if (("allowSpectate" in sentObj) && ("p2Here" in serverObj)) 
    return serverObj["p2Here"];
  return false;
} 