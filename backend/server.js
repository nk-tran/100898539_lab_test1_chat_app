const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const GroupMessage = require("./models/GroupMessage");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Routes for static pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "view", "home.html"));
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "view", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "view", "login.html"));
});

app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "view", "main.html"));
});

app.get("/chat", (req, res) => {
  const room = req.query.room;
  res.sendFile(path.join(__dirname, "..", "frontend", "view", "chat.html"));
});

// List of predefined rooms
const predefinedRooms = ["devops", "cloud computing", "covid19", "sports", "nodeJS"];



io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("joinRoom", async (roomName) => {
    if (predefinedRooms.includes(roomName)) {
      socket.join(roomName); 
      console.log(`${socket.id} joined room: ${roomName}`);

      // Retrieve previous messages from the database
      const previousMessages = await GroupMessage.find({ room: roomName }).sort({ date_sent: 1 });

      // Send previous messages to the user who just joined
      socket.emit("previousMessages", previousMessages);

      // Inform the room that a new user has joined
      io.to(roomName).emit("message", { from_user: "System", message: `${socket.id} has joined the room.` });
    } else {
      console.log(`Room not found: ${roomName}`);
      socket.emit("message", { from_user: "System", message: "Room not found." });
    }
  });

  // Handle group chat messages
  socket.on("chatMessage", async (data) => {
    const { room, message, from_user } = data;

    // Save the new message to MongoDB
    const newMessage = new GroupMessage({ from_user, room, message });
    await newMessage.save();

    // Emit the message to all users in the room
    io.to(room).emit("message", data);
  });



  socket.on("leaveRoom", (roomName) => {
    socket.leave(roomName);
    console.log(`${socket.id} left room: ${roomName}`);
    io.to(roomName).emit("message", { from_user: "System", message: `${socket.id} has left the room.` });
  });


    socket.on("disconnect", () => {
      console.log("User disconnected");
  });

});

// MongoDB connection details
const DB_NAME = "comp3133";
const DB_USER_NAME = "nktran4";
const DB_PASSWORD = "MR0VkUHKAYIyak2C";
const DB_CLUSTER_ID = "comp3133.pudwo";
const DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=${DB_NAME}`;

// Connect to MongoDB
mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB:', err);
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
