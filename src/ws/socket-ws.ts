import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import { RedisCache } from '../cache/redis-cache';
import constants from '../config/constants';
import { MetricsClass } from '../services/monitoring-service';

 const metrics= MetricsClass.getInstance();
class WebSocketServerSingleton {
  private static instance: WebSocketServerSingleton;
  private wss: WebSocketServer;

  private constructor() {
    this.wss = new WebSocketServer({ noServer: true ,path:'/ws'});
    this.wss.on('connection', this.onConnection.bind(this));
  }

  // Singleton pattern to get the instance of WebSocketServerSingleton
  public static getInstance(): WebSocketServerSingleton {
    if (!WebSocketServerSingleton.instance) {
      WebSocketServerSingleton.instance = new WebSocketServerSingleton();
    }
    return WebSocketServerSingleton.instance;
  }

  // Start the WebSocket server
  public async start(): Promise<void> {
    console.log('WebSocket server started on port');
  }

  // Handle new connections
  private async onConnection(ws: WebSocket, req: any): Promise<void> {
    const queryParams = url.parse(req.url, true).query;
    const userId = queryParams.userId as string;
    const role = queryParams.role as string;
    this.wss.on('headers', (headers, _req) => {
      headers.push('Access-Control-Allow-Origin: *'); 
    });
    const redisCache = RedisCache.getInstance(
      constants.REDIS_URL || "redis://localhost:6379"
    );
    
    await redisCache.updatePlayerScore([{
      studentNo: userId,
      calculatedTotalScore: 0,
      name: userId,
      userId: userId,
    }]);
    // Attach userId and role to the ws client instance
    (ws as any).userId = userId;
    (ws as any).role = role;
    metrics.incrementSocketConnections();
    console.log(`New WebSocket connection established for user: ${userId}, role: ${role}`);


    // Listen for messages from the connected client
    ws.on('message', async (message: string) => {
      console.log('Received message:', message.toString());
    });

    // Handle connection close
    ws.on('close', () => {
      metrics.decrementSocketConnections();
      console.log(`WebSocket connection closed for user: ${userId}`);
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  // Broadcast a message to all connected clients
  public broadcast(message: string): void {
    this.wss.clients.forEach((client) => {
      if (client instanceof WebSocket && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  }

  // Send a message to a specific client
  public sendToClient(client: WebSocket, message: string): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  }
  public handleUpgrade(request: any, socket: any, head: Buffer): void {
    this.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
      this.wss.emit('connection', ws, request);
    });
  }
  // Close the WebSocket server
  public close(): void {
    this.wss.close(() => {
      console.log('WebSocket server has been closed');
    });
  }

  // Get all connected clients
  public getClients(): WebSocket[] {
    return Array.from(this.wss.clients);
  }
}

export default WebSocketServerSingleton;
