import { io } from "socket.io-client";

let socket;

export const connectSocket = (userId) => {
  socket = io("http://localhost:5000", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket Connected:", socket.id);

    socket.emit("join", userId);
  });
};

export const getSocket = () => socket;
