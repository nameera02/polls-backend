import { Server } from "socket.io";
import express from 'express';
import http from 'http';
let io;

const app = express();
const server = http.createServer(app); 
export const initSocket = (server) => {
  io = new Server(server, {
    path: '/socket.io', 
    cors: {
      origin: "http://localhost:3000", // Adjust according to your frontend's origin
      methods: ["GET", "POST","PUT"]
    }
  });
  return io;
};

export const getSocketInstance = () => {
  if (!global.io) {
    throw new Error("Socket.io not initialized");
  }
  return global.io;
};