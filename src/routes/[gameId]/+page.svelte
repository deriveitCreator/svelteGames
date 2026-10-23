<script lang="ts">
  import { onMount } from 'svelte';

	let { data }: {data: {gameId:string, title:string, description: string, jsLoc: string}} = $props();

  onMount(()=> {
    //@ts-ignore
    let curCanvas: HTMLCanvasElement = document.getElementById("canvas");
    //@ts-ignore
    window.Module={canvas: curCanvas};
    const script = document.createElement('script');
    script.src = data.jsLoc;
    document.body.appendChild(script);
    document.title = data.title;
    curCanvas.addEventListener('keydown', (e) => e.preventDefault());
    return () => window.location.reload();
  });

</script>

<section id="gamearea">
  <section id="gameContainer">
    <canvas id="canvas" tabindex="0" oncontextmenu={(event)=>event!.preventDefault()}></canvas>
  </section>
  <aside id="descriptionSec">
    <h2>{data.title}</h2>
    <div>{@html data.description}</div>
  </aside>
</section>

<style>
  #gamearea{
    padding: 20px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    column-gap: 20px;

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
      flex: 1 1 200px;
      margin: 10px;
      padding: 5px;
      height: 100%;
      border: solid 2px black;
      min-width: 200px;
      background-color: #666;

      h2 {
        margin: 10px 0px 15px 0px;
        font-size: 30px;
      }

      div {
        font-size: 20px;

        :global(p) {
          margin: 10px 0px;
        }

        :global(ul) {
          margin: 10px 0px 15px 0px;
        }
      }
    }
  }
</style>