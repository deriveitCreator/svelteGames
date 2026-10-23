<script lang="ts">
  import { getGameTitle } from "$lib/gameData";
	const { gameId } = $props();
  let gameImg = $state(`gameData/${gameId}/thumbnail.png`);
</script>

<div class="gameCard"><a href={`/${gameId}`}>
  <img class="imgContainer" src={gameImg} alt="" onerror={(e) => gameImg = "/questionMark.png"}/>
  <p>{getGameTitle(gameId)}</p>
</a></div>

<style>
  .gameCard{
    border: solid 3px black;
    margin: 20px;
    border-radius: 10px;
    width: 120px;
    overflow: hidden;
    z-index: 1;

    a{
      border-radius: 10px !important;
      display: block;
      color: black;
      text-decoration: none;
      transition: 0.5s linear background-color;
      overflow: hidden;
      z-index: 0;
      will-change: transform;

      .imgContainer{
        display: block;
        height: 100px;
        width: 100px;
        box-sizing: border-box;
        margin: 10px;
      }

      p{
        border-top: solid 2px black;
        height: 40px;
        margin-block: 10px;
        margin: 0px;
        text-align: center;
        font-size: 16px;
        line-height: 18px;
        font-weight: bold;
        text-overflow: ellipsis;
        padding: 4px;
        transition: 0.5s linear background-color;
      }
    }

    &:hover{
      a{
        border-radius: 10px;
        background-color: #777;

        p{
          border-radius: 0px 0px 10px 10px;
          background-color: #aaa;
        }
      }
    }

  }
</style>