import WebSocket from 'ws';

export interface IWebSocketServer {
  start(): Promise<void>;
  
  broadcast(message: string): void;

  sendToClient(client: WebSocket, message: string): void;


  close(): void;

  getClients(): WebSocket[];
}
