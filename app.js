import express from "express";
import  {config} from 'dotenv';
import cors from "cors"
import polls from "./routes/pollRoutes.js"
import users from "./routes/userRoutes.js"
import votes from "./routes/votesRoutes.js"
import {attachSocketToRequest} from "./middlewares/attachSocketToRequest.js"
import cookieParser from 'cookie-parser';
import path from "path"
import { createServer } from "http";
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

config({
    path:"./config/config.env",
})

const app=express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST","PUT"],
    credentials: true
  },
  // transports: ['websocket'], 
});
global.io = io;
// Socket.IO event listeners
app.use(attachSocketToRequest);

app.use(express.json())
app.get("/", (req, res) => {
  res.send("Express server is working.");
});
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('connect', () => {
    console.log('Connected to server');
  });
  io.emit("voteUpdateb", () => {
    console.log('A user voteUpdateb');
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads/polls_images', express.static(path.join(__dirname, 'uploads/polls_images')));

app.use(cookieParser());

app.use(express.urlencoded({
    extended:true
}))

app.use("/api/v1",polls)
app.use("/api/v1",users)
app.use("/api/v1",votes)

server.listen(process.env.PORT,()=>{
  console.log(`Server is working on port: ${process.env.PORT}`);
  
})

export default app;