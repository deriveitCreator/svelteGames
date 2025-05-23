import { handler } from './build/handler.js';
import express from 'express';
import { initWebSocketServer } from './src/lib/roomsStore.ts';
import http from 'http';

const app = express();
const server = http.createServer(app);

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);

initWebSocketServer(server);

server.listen(3000, () => {
	console.log('listening on port 3000');
});