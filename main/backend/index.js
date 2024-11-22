const express = require("express");
const https = require("https");
const { Server } = require("socket.io");
const rootRouter = require("./routes/index.js");
const cors = require("cors");
const PORT = 3000;

const app = express();
const server = https.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://codenexuslive.tech",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/v1", rootRouter);

// Map to store rooms and their respective states
const rooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected");

  // When a user joins a room
  socket.on("joinRoom", ({ roomId, username }) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Map(),
        code: "",
        input: "",
        output: "",
      });
    }
    rooms.get(roomId).users.set(socket.id, username);

    console.log(`${username} joined room: ${roomId}`);

    // Send current room state to the joining user
    const roomState = getRoomState(roomId);
    socket.emit("roomState", roomState);

    // Broadcast updated client list to the room
    broadcastClientList(roomId);
  });

  // Handle code updates
  socket.on("codeUpdate", ({ roomId, code, username }) => {
    console.log(`${username} updated the code in room: ${roomId}`);
    socket.to(roomId).emit("codeUpdate", code);
    updateRoomState(roomId, "code", code);
  });

  // Handle input updates
  socket.on("inputUpdate", ({ roomId, input, username }) => {
    console.log(`${username} updated the input in room: ${roomId}`);
    socket.to(roomId).emit("inputUpdate", input);
    updateRoomState(roomId, "input", input);
  });

  // Handle output updates
  socket.on("outputUpdate", ({ roomId, output, username }) => {
    console.log(`${username} updated the output in room: ${roomId}`);
    socket.to(roomId).emit("outputUpdate", output);
    updateRoomState(roomId, "output", output);
  });

  // Handle a user leaving a room
  socket.on("leaveRoom", ({ roomId, username }) => {
    handleUserLeave(socket, roomId, username);
  });

  // Handle session end
  socket.on("endSession", ({ roomId, username }) => {
    console.log(`${username} ended the session in room: ${roomId}`);
    io.to(roomId).emit("roomDisbanded");
    io.in(roomId).socketsLeave(roomId);
    rooms.delete(roomId);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    for (const [roomId, roomData] of rooms.entries()) {
      if (roomData.users.has(socket.id)) {
        const username = roomData.users.get(socket.id);
        handleUserLeave(socket, roomId, username);
        return;
      }
    }
  });
});

// Handle when a user leaves a room
function handleUserLeave(socket, roomId, username) {
  socket.leave(roomId);
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    room.users.delete(socket.id);
    if (room.users.size === 0) {
      rooms.delete(roomId); // Delete the room if empty
    } else {
      broadcastClientList(roomId); // Broadcast updated client list
    }
  }
  console.log(`${username} left room: ${roomId}`);
}

// Broadcast the list of clients in the room
function broadcastClientList(roomId) {
  if (rooms.has(roomId)) {
    const clientList = Array.from(rooms.get(roomId).users.values());
    io.to(roomId).emit("clientUpdate", clientList);
  }
}

// Get the current state of the room
function getRoomState(roomId) {
  if (rooms.has(roomId)) {
    const { code, input, output } = rooms.get(roomId);
    return { code, input, output };
  }
  return {
    code: "",
    input: "",
    output: "",
  };
}

// Update the state of the room
function updateRoomState(roomId, field, value) {
  if (rooms.has(roomId)) {
    rooms.get(roomId)[field] = value;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

server.listen(PORT, () => {
  console.log(`Server listening at Port ${PORT}`);
});
