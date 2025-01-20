import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}
console.log("Starting the socket server");
io.on("connection", (socket) => {
    console.log("Socket.io connection attempt detected");
  
    // Log socket ID and handshake query
    console.log("Socket ID:", socket.id);
    console.log("Handshake query:", socket.handshake.query);
  
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
      console.log("User connected with ID:", userId, "and Socket ID:", socket.id);
    }
  
    // Send the current online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
  

export { app, io, server };
