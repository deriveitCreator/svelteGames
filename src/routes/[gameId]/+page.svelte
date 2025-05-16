<script lang="ts">
  import { onMount } from 'svelte';
	let { data }: {data: {title:string, description: string, jsLoc: string}} = $props();

  onMount(() => {
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