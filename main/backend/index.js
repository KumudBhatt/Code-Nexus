const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const rootRouter = require("./routes/index.js");
const cors = require("cors");
const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRouter);

const connectedUsers = {};

// Socket.IO configuration
io.on('connection', (socket) => {
    // Handle joining a room
    socket.on('joinRoom', ({ roomId, username }) => {
        socket.join(roomId);
        connectedUsers[socket.id] = username;
        
        console.log(`${username} joined room: ${roomId}`);

        // Broadcast the updated client list to the room
        const clientsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
            (socketId) => ({ username: connectedUsers[socketId] }) // Send as objects with username field
        );
        io.to(roomId).emit('clientUpdate', clientsInRoom);

        // Notify others in the room that a new user has joined
        socket.broadcast.to(roomId).emit('userJoined', username);
    });

    // Handle code updates
    socket.on('codeUpdate', ({ roomId, code }) => {
        console.log(`${connectedUsers[socket.id].username} updated the code in room: ${roomId}`);
        socket.broadcast.to(roomId).emit('codeUpdate', code);
    });

    // Handle input updates
    socket.on('inputUpdate', ({ roomId, input }) => {
        console.log(`${connectedUsers[socket.id].username} updated the input in room: ${roomId}`);
        socket.broadcast.to(roomId).emit('inputUpdate', input);
    });

    // Handle output updates
    socket.on('outputUpdate', ({ roomId, output }) => {
        console.log(`${connectedUsers[socket.id].username} updated the output in room: ${roomId}`);
        socket.broadcast.to(roomId).emit('outputUpdate', output);
    });

    // Handle user leaving the room
    socket.on('leaveRoom', ({ roomId }) => {
        const username = connectedUsers[socket.id]?.username;
        socket.leave(roomId);
        delete connectedUsers[socket.id];

        console.log(`${username} left room: ${roomId}`);

        // Update the client list in the room
        updateClientList(roomId);
    });

    // Handle the session owner ending the session
    socket.on('endSession', ({ roomId }) => {
        const username = connectedUsers[socket.id]?.username;
        console.log(`${username} ended the session in room: ${roomId}`);
        socket.broadcast.to(roomId).emit('roomDisbanded');
        io.in(roomId).socketsLeave(roomId);

        // Clear all users in the room
        for (const socketId of Array.from(io.sockets.adapter.rooms.get(roomId) || [])) {
            delete connectedUsers[socketId];
        }
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        const { username, roomId } = connectedUsers[socket.id] || {};
        delete connectedUsers[socket.id];
        
        console.log(`${username} disconnected`);

        if (roomId) {
            // Notify other users in the room and update the client list
            updateClientList(roomId);
        }
    });

    // Function to update the client list in a room
    function updateClientList(roomId) {
        const clientsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
            (socketId) => connectedUsers[socketId]?.username
        );
        io.to(roomId).emit('clientUpdate', clientsInRoom);
    }
});

server.listen(PORT, () => {
  console.log(`Server listening at Port ${PORT}`);
});
