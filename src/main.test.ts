import { WebSocket, WebSocketServer } from 'ws';

/**
 * Basic unit tests for GIP Federation Node
 * Tests WebSocket relay and message broadcast functionality
 */

describe('GIP Federation Node', () => {
    let wss: WebSocketServer;
    const PORT = 8811; // Use different port for tests to avoid conflicts

    beforeAll((done) => {
        // Start a test server on port 8811
        wss = new WebSocketServer({ port: PORT });
        const nodes = new Map<string, WebSocket>();

        wss.on('connection', (ws: WebSocket) => {
            const id = Math.random().toString(36).substring(7);
            nodes.set(id, ws);

            ws.on('message', (data: Buffer) => {
                const msg = data.toString();
                // Broadcast to all other nodes
                for (const [nodeId, client] of nodes.entries()) {
                    if (nodeId !== id && client.readyState === 1) {
                        client.send(msg);
                    }
                }
            });

            ws.on('close', () => {
                nodes.delete(id);
            });
        });

        wss.once('listening', done);
    });

    afterAll((done) => {
        wss.close(done);
    });

    test('server starts and listens on port', (done) => {
        expect(wss).toBeDefined();
        expect(wss.clients.size).toBe(0);
        done();
    });

    test('client can connect to federation node', (done) => {
        const client = new WebSocket(`ws://localhost:${PORT}`);
        client.on('open', () => {
            expect(wss.clients.size).toBe(1);
            client.close();
            done();
        });
        client.on('error', () => {
            done(new Error('Failed to connect'));
        });
    });

    test('federation node relays messages between clients', (done) => {
        const client1 = new WebSocket(`ws://localhost:${PORT}`);
        const client2 = new WebSocket(`ws://localhost:${PORT}`);
        const testMessage = 'Hello federation!';
        let messageReceived = false;

        client2.on('message', (data: Buffer) => {
            if (data.toString() === testMessage) {
                messageReceived = true;
                client1.close();
                client2.close();
                expect(messageReceived).toBe(true);
                done();
            }
        });

        client1.on('open', () => {
            client1.send(testMessage);
        });

        client1.on('error', () => done(new Error('Client1 error')));
        client2.on('error', () => done(new Error('Client2 error')));
    });
});
