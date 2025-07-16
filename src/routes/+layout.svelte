<script>
	let { children } = $props();
</script>

<header><a href="/"><h1>Svelte Games</h1></a></header>
<main>{@render children()}</main>
<footer>
  <span>
    <b><u>Technologies Used:</u></b>
    &nbsp;&nbsp;<a href="https://svelte.dev/" target="_blank"><img height="15" width="15" src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/svelte.svg" alt=""/>&nbsp;Svelte</a>
    &nbsp;&nbsp;<a href="https://www.c-language.org/" target="_blank"><img height="15" width="15" src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/c.svg" alt=""/>&nbsp;C programming language</a>
    &nbsp;&nbsp;<a href='https://www.raylib.com/' target="_blank"><img height="15" width="15" src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/raylib.svg" alt=""/>&nbsp;Raylib library</a>
    &nbsp;&nbsp;<a href="https://webassembly.org/" target="_blank"><img height="15" width="15" src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/webassembly.svg" alt=""/>&nbsp;WebAssembly</a>
  </span>
</footer>

<style>
  :root{
    --header-height: 100px;
    --text-color: #eee;
    --main-font: "Edu SA Beginner"
  }

  header{
    height: var(--header-height);
    border-bottom: solid 3px black;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    
    a{
      text-decoration: none;
      color: var(--text-color);
      font-family: var(--main-font);

      h1{
        margin: 0;
        font-weight: normal;
        font-size: 40px;
        text-align: center;
        border-bottom: solid 1px var(--text-color);
      }

      small{
        text-align: center;
        width: 100%;
        font-size: 15px;
        display: block;
        padding: 7px 0px;
      }

      &:visited{
        text-decoration: none;
        color: var(--text-color);
      }
    }
  }

  main{
    font-family: var(--main-font);
    min-height: calc(100vh - var(--header-height));
  }

  footer{
    font-family: var(--main-font);
    border-top: solid 3px black;
    box-sizing: border-box;
    padding: 30px 10px;

    span{
      font-size: 20px;
      
      a{
        color: black;
        text-decoration: none;

        &:hover{
          border-bottom: 2px solid #000; 
        }
      }
    }
  }
</style>