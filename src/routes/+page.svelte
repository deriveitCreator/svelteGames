<script>
  import { getGameIds } from "$lib/gameData";
  import GameCard from "$lib/gameCard.svelte";
  const gameIds = getGameIds();
</script>

<svelte:head>
  <title>Svelte Games by Uzair</title> 
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