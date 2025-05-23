import { handler } from './build/handler.js';
import express from 'express';
import { initWebSocketServer } from './src/lib/roomsStore.ts';

const app = express();

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

app.listen(3000, () => {
	initWebSocketServer(app);
	console.log('listening on port 3000');
});