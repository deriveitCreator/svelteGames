import { handler } from './build/handler.js';
import express from 'express';
import { setServerVar } from "src/lib/serverStore";

const app = express();

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(3000, () => {
  setServerVar(app);
	console.log('listening on port 3000');
});