import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { userId: string; role: string }) {
    this.connectedUsers.set(client.id, payload.userId);
    
    // Join role-specific room
    client.join(`${payload.role}s`);
    
    // Join user-specific room
    client.join(`user_${payload.userId}`);
    
    console.log(`User ${payload.userId} joined as ${payload.role}`);
  }

  // Emit new alert to all donors
  emitNewAlert(alert: any) {
    this.server.to('donors').emit('newAlert', alert);
  }

  // Emit alert response to specific hospital
  emitAlertResponse(hospitalUserId: string, response: any) {
    this.server.to(`user_${hospitalUserId}`).emit('alertResponse', response);
  }

  // Emit alert status update
  emitAlertUpdate(alert: any) {
    this.server.emit('alertUpdate', alert);
  }
}