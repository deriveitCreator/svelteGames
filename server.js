import express from 'express';

export const app = express();

async function start(){
  const { handler } = await import('./build/handler.js');
  // let SvelteKit handle everything else, including serving prerendered pages and static assets
  app.use(handler);

  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
}