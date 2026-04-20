const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes"); // 👈 add
const Message = require("./models/Message"); // 👈 add

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
app.use("/api/messages", messageRoutes); 

/* ONLINE USERS MAP */
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // 1️⃣ User joins
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User joined:", userId);
  });

  // 2️⃣ Send message - DB-ൽ save ചെയ്യുക 👈
  socket.on("sendMessage", async (data) => {
    console.log("📩 Message received:", data);

    try {
      // DB-ൽ save
      const saved = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
      });

      const receiverSocketId = onlineUsers[data.receiver];

      // receiver online ആണെങ്കിൽ send ചെയ്യുക
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", saved);
      }

      // sender-ക്കും send ചെയ്യുക
      socket.emit("receiveMessage", saved);
    } catch (err) {
      console.log("Message save error:", err);
    }
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
  });
});

/* SERVER */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
