<script lang="ts">
  import { getGameTitle } from "$lib/gameData";
	const { gameId } = $props();
  const gameImg = `gameData/${gameId}/thumbnail.png`;
</script>

<div class="gameCard"><a href={`/${gameId}`}>
  <div class="imgContainer" style="background-image: url({gameImg});"></div>
  <p>{getGameTitle(gameId)}</p>
</a></div>

<style>
  .gameCard{
    border: solid 3px black;
    margin: 20px;
    border-radius: 10px;
    width: 120px;

    a{
      display: block;
      color: black;
      text-decoration: none;
      transition: 0.5s;
      overflow: hidden;

      .imgContainer{
        background-repeat: no-repeat;
        background-size: contain;
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
        font-weight: bold;
        text-overflow: ellipsis;
        padding: 5px;
        transition: 0.5s;
      }
    }

    &:hover{
      a{
        border-radius: 10px;
        background-color: #666;

        p{
          border-radius: 0px 0px 10px 10px;
          background-color: #aaa;
        }

      }
    }

  }
</style>