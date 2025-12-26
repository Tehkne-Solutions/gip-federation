import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

const PORT = process.env.FEDERATION_PORT || 8810;
const nodes = new Map<string, any>();

const wss = new WebSocketServer({ port: Number(PORT) });
console.log(chalk.cyanBright(`🌐 GIP Federation Node started on port ${PORT}`));

wss.on('connection', (ws) => {
    const id = uuidv4();
    nodes.set(id, ws);
    console.log(chalk.green(`🧩 Node connected: ${id}`));

    ws.on('message', (data) => {
        const msg = data.toString();
        console.log(chalk.gray(`📨 [${id}] ${msg}`));
        // Broadcast to all other nodes
        for (const [nodeId, client] of nodes.entries()) {
            if (nodeId !== id && client.readyState === 1) client.send(msg);
        }
    });

    ws.on('close', () => {
        nodes.delete(id);
        console.log(chalk.red(`❌ Node disconnected: ${id}`));
    });
});
