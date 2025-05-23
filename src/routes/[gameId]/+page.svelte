<script lang="ts">
  import { onMount } from 'svelte';
  import WS_MSG from '$lib/wsMessages';

	let { data }: {data: {gameId:string, title:string, description: string, jsLoc: string, isOnlineMultiplayer: boolean}} = $props();

  onMount(()=> {
    //@ts-ignore
    window.WS_MSG = WS_MSG;
    let randChar = (Math.ceil(Math.random() * 25)+10).toString(36);
    let randChar2 = (Math.ceil(Math.random() * 25)+10).toString(36);
    //@ts-ignore
    window.userId = randChar + randChar2 + "_" + (new Date()).getMilliseconds();

    //@ts-ignore
    window.getAllRooms = () => {
      fetch("/roomsFuncs", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({method: "getAllRooms"})
      })
      .then(res => res.json())
      .then(console.log)
    }
    //@ts-ignore
    window.showWSSOnServer = () => {
      fetch("/roomsFuncs", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({method: "showWSS"})
      })
      .then(res => res.json())
      .then(console.log)
    }

    //@ts-ignore
    window.showWebSocket = () => {
      //@ts-ignore
      console.log(window.gameSocket);
    }

    //@ts-ignore
    if (window.Module) window.location.reload();
    //@ts-ignore
    let curCanvas: HTMLCanvasElement = document.getElementById("canvas");
    //@ts-ignore
    window.Module={canvas: curCanvas};
    const script = document.createElement('script');
    script.src = data.jsLoc;
    document.body.appendChild(script);
    document.title = data.title;
    curCanvas.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
    if(data.isOnlineMultiplayer) {
      //for some reason the first websockets don't work,
      // so i'm sending this dummy socket that will immediately close.
      const tempSocket = new WebSocket(`wss://sveltegames.onrender.com:5000`);
      tempSocket.onopen = () => {
        tempSocket.close(1000, 'Closing after open');
      };

      const script = document.createElement('script');
      script.src = `/gameData/${data.gameId}/gameFuncStore.js`;
      document.body.appendChild(script);

      return ()=>{
        //@ts-ignore
        if (window.gameSocket && ( //@ts-ignore
          window.gameSocket.readyState == window.gameSocket.OPEN ||  //@ts-ignore
          window.gameSocket.readyState == window.gameSocket.CONNECTING //@ts-ignore
        )) window.socketCloseFunc(); 
      }
    }
  });
</script>

<section id="gamearea">
  <section id="gameContainer">
    <canvas id="canvas" tabindex="0" oncontextmenu={(event)=>event!.preventDefault()}></canvas>
  </section>
  <aside id="descriptionSec">
    <h2>{data.title}</h2>
    {@html data.description}
  </aside>
</section>

<style>
  #gamearea{
    padding: 20px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    #gameContainer{
      box-sizing: border-box;
      overflow-x: auto;

      #canvas{
        display: block;

        &:focus{
          outline: none;
        }
      }
    }
    #descriptionSec{
      margin: 10px;
      padding: 5px;
      height: 100%;
      border: solid 2px black;
      min-width: 200px;
      line-break: loose;
    }
  }
</style>