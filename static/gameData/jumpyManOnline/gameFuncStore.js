var lastCharTime = Date.now();
var roomCode;
var curInterval = -1;

//All inputs are arrays of two elements
window.gameFunc = async (input) => {
  let openState = window.gameSocket && (
    window.gameSocket.readyState == window.gameSocket.OPEN ||
    window.gameSocket.readyState == window.gameSocket.CONNECTING
  );
  switch (input[0]){
    case "CREATE":
      roomCode = parseInt(input[1]);
      if (openState) window.socketCloseFunc();
      await createGame(roomCode);
      break;
    case "JOIN":
      roomCode = parseInt(input[1]);
      if (openState) window.socketCloseFunc();
      await joinGame(roomCode);
      break;
    case "SPECTATE":
      roomCode = parseInt(input[1]);
      if (openState) window.socketCloseFunc();
      await spectateGame(roomCode);
      break;
    case "END_GAME":
      if (openState) {
        window.gameSocket.send(
          JSON.stringify({
            userId: window.userId, 
            gameId:"jumpyManOnline", 
            roomCode: roomCode,
            msg: WS_MSG.UPDATE_GAME_DATA,
            obj: {winner: input[1]}
          })
        );
      }
      break;
    default:
      alert("SWTICH ERROR: please report this");
  }
}

function createWS(){
  window.gameSocket = new WebSocket(`wss://${window.location.hostname}:5000/jumpyManOnline`);
  window.socketCloseFunc = () =>{
    window.clearInterval(curInterval);
    window.gameSocket.send(
      JSON.stringify({userId: window.userId, gameId:"jumpyManOnline", roomCode: roomCode, msg: WS_MSG.CLOSING})
    );
    console.log("Closing socket...");
    window.gameSocket.close();
  };
}

async function createGame(){
  let res, resJSON;
  res = await fetch("/roomsFuncs", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({method: "checkRoomExists", gameId: "jumpyManOnline", roomCode: roomCode})
  });
  resJSON = await res.json();
  if (resJSON.exist)
    Module.ccall("setTopText", "null", ["string"], ["Code already in use."]);
  else {
    createWS();
    window.gameSocket.onmessage = (event) => {
      if (event.data.includes(WS_MSG.JOINED_GAME)) startGame();
      else if (event.data.includes(WS_MSG.FROM_SERVER_GAME_DATA)) {
        let inputObj = JSON.parse(event.data.split("%")[1]);
        updateGameInfo(inputObj);
      }
    };

    let p1Here = {"p1Here": true};
    if (window.gameSocket.readyState === WebSocket.OPEN) {
      window.gameSocket.send(
        JSON.stringify({userId: window.userId, gameId:"jumpyManOnline", roomCode: roomCode, msg: WS_MSG.TRYING_TO_CREATE, obj: p1Here})
      );
    }
    else window.gameSocket.onopen = (event) => {
      console.log("Websocket opened");
      window.gameSocket.send(
        JSON.stringify({userId: window.userId, gameId:"jumpyManOnline", roomCode: roomCode, msg: WS_MSG.TRYING_TO_CREATE, obj: p1Here})
      );
    }

    Module.ccall("setTopText", "null", ["string"], ["Ask your friend to join..."]);

    window.playerNum = 1;
  }
}

async function joinGame(){
  let res, resJSON;
  res = await fetch("/roomsFuncs", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({method: "checkRoomExists", gameId: "jumpyManOnline", roomCode: roomCode})
  })
  resJSON = await res.json();
  if (resJSON.exist){
    Module.ccall("setTopText", "null", ["string"], ["Checking if you can join..."]);
    res = await fetch("/roomsFuncs", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({method: "getTotalPlayers", gameId: "jumpyManOnline", roomCode: roomCode})
    })
    resJSON = await res.json();

    if (resJSON.num >= 2) {
      Module.ccall("setTopText", "null", ["string"], ["Game already started."]);
      return;
    }

    createWS();

    Module.ccall("setTopText", "null", ["string"], ["Joining..."]);
    window.gameSocket.onmessage = (event) => {
      if (event.data.includes(WS_MSG.JOINED_GAME)) startGame();
      else if (event.data.includes(WS_MSG.FROM_SERVER_GAME_DATA)) {
        let inputObj = JSON.parse(event.data.split("%")[1]);
        updateGameInfo(inputObj);
      }
      else if (event.data.includes(WS_MSG.GAME_ALREADY_STARTED))
        Module.ccall("setTopText", "null", ["string"], ["Game already started."]);
    };

      let sendObj = {"p2Here": true};
    if (window.gameSocket.readyState === WebSocket.OPEN) {
      window.gameSocket.send(
        JSON.stringify({userId: window.userId, gameId:"jumpyManOnline", roomCode: roomCode, msg: WS_MSG.TRYING_TO_JOIN, obj: sendObj})
      );
    }
    else window.gameSocket.onopen = (event) => {
      console.log("Websocket opened");
      window.gameSocket.send(
        JSON.stringify({userId: window.userId, gameId:"jumpyManOnline", roomCode: roomCode, msg: WS_MSG.TRYING_TO_JOIN, obj: sendObj})
      );
    };

    window.playerNum = 2;
  }
  else
    Module.ccall("setTopText", "null", ["string"], ["No game found."]);
}

async function spectateGame(){
  let res, resJSON;
  res = await fetch("/roomsFuncs", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({method: "checkRoomExists", gameId: "jumpyManOnline", roomCode: roomCode})
  });
  resJSON = await res.json();
  if (resJSON.exist){
    Module.ccall("setTopText", "null", ["string"], ["Checking if you can join..."]);
    res = await fetch("/roomsFuncs", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({method: "getTotalPlayers", gameId: "jumpyManOnline", roomCode: roomCode})
    })
    resJSON = await res.json();

    if (resJSON.num <= 1) {
      Module.ccall("setTopText", "null", ["string"], ["Game not started."]);
      return;
    }

    createWS();
    Module.ccall("setTopText", "null", ["string"], ["Joining..."]);
    window.gameSocket.onmessage = (event) => {
      if (event.data.includes(WS_MSG.FROM_SERVER_GAME_DATA)) {
        let inputObj = JSON.parse(event.data.split("%")[1]);
        updateGameInfo(inputObj);
      }
    };

    const onOpenStuff = () => {
      window.gameSocket.send(
        JSON.stringify({userId: window.userId, gameId:"jumpyManOnline", roomCode: roomCode, msg: WS_MSG.TRYING_TO_SPECTATE})
      );
      Module.ccall("startGame", null, null, null); 
    }

    if (window.gameSocket.readyState === WebSocket.OPEN) onOpenStuff();
    else window.gameSocket.onopen = () => { onOpenStuff() };
  }
  else
    Module.ccall("setTopText", "null", ["string"], ["No game found."]);
}

function startGame(){ 
  //only for P1 and P2
  if(window.playerNum != 1 && window.playerNum != 2) return;
  window.gameSocket.send(
    JSON.stringify({
      userId: window.userId, 
      gameId:"jumpyManOnline", 
      roomCode: roomCode, 
      msg: WS_MSG.UPDATE_GAME_DATA,
      obj: {startEnd: true}
    })
  );
  Module.ccall("startGame", null, null, null); 
  curInterval = window.setInterval(()=>{
    let x = Module.ccall(`getPlayer${window.playerNum}X`, "float", null, null);
    let y = Module.ccall(`getPlayer${window.playerNum}Y`, "float", null, null);
    window.gameSocket.send(
      JSON.stringify({
        userId: window.userId, 
        gameId:"jumpyManOnline", 
        roomCode: roomCode,
        msg: WS_MSG.UPDATE_GAME_DATA,
        obj: {"playerNum": window.playerNum, "x": x, "y": y}
      })
    );
  }, 10);
}

function updateGameInfo(gameObj){
  if("winner" in gameObj) {
    Module.ccall("endGameForAll", "null", ["int"], [gameObj["winner"]]);
    window.socketCloseFunc();
    return;
  }
  if ("newEnemy" in gameObj) {
    let enemyNum = Module.ccall("firstNullEnemy", "int", null, null);
    if (enemyNum !== -1) {
      Module.ccall(
        "setEnemyObject", 
        "null", 
        ["int","float","float"],
        [enemyNum, gameObj.newEnemy[0], gameObj.newEnemy[1]]
      );
    }
    return;
  }

  if (gameObj.x1 && gameObj.y1 && gameObj.x2 && gameObj.y2) {
    if (window.playerNum != 1) Module.ccall("setPlayer1XY", "null", ["float","float"], [gameObj.x1, gameObj.y1]);  
    else if (window.playerNum != 2) Module.ccall("setPlayer2XY", "null", ["float","float"], [gameObj.x2, gameObj.y2]);
  }
}