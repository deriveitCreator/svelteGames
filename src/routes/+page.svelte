<script>
  import { getGameIds } from "$lib/gameData";
  import GameCard from "$lib/gameCard.svelte";
  const gameIds = getGameIds();
  console.clear();
</script>

<svelte:head>
  <title>Svelte Games</title> 
</svelte:head>

<section id="gameSelection">
  {#each gameIds as i}
    <GameCard gameId={i}/>
  {/each}
</section>

<style>
  #gameSelection{
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
  }
</style>