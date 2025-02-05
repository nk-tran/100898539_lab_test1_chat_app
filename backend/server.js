const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Chat Server is Running...");
});


app.use(express.static(path.join(__dirname, "..", "frontend"))); 

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "view", "signup.html")); 
});


io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on("chatMessage", (data) => {
        io.to(data.room).emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const DB_NAME = "comp3133";
const DB_USER_NAME = "nktran4";
const DB_PASSWORD = "MR0VkUHKAYIyak2C";
const DB_CLUSTER_ID = "comp3133.pudwo";
const DB_CONNECTION = `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_CLUSTER_ID}.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=${DB_NAME}`;

// Connect to MongoDB
mongoose.connect(DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB:', err);
});

PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
