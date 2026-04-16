const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

/* Socket setup */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/* DB */
connectDB();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.get("/", (req, res) => {
  res.send("Chat Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

/* ONLINE USERS MAP */
const onlineUsers = {};


io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // 1️⃣ User joins
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User joined:", userId);
    console.log("Online Users:", onlineUsers);
  });

  // 2️⃣ Send message
  socket.on("sendMessage", (data) => {
    console.log("📩 Message received:", data);

    const receiverSocketId = onlineUsers[data.receiver];

    console.log("Receiver Socket ID:", receiverSocketId);

    // send to receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", data);
    }

    // send back to sender (optional)
    socket.emit("receiveMessage", data);
  });

  // 3️⃣ Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }

    console.log("Updated Online Users:", onlineUsers);
  });
});

/* SERVER */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
