import { connectSocket, getSocket } from "../socket";
import { useState, useEffect } from "react";
import { Phone, Video, MoreVertical, Plus, Smile, Send } from "lucide-react";
import axios from "axios";

export default function ChatArea({ darkMode, selectedUser, currentUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔌 CONNECT SOCKET
  useEffect(() => {
    if (currentUser?._id) {
      connectSocket(currentUser._id);
    }
  }, [currentUser]);

  // 📜 LOAD OLD MESSAGES
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:5000/api/messages/${selectedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  // 📩 RECEIVE MESSAGES
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handler);

    return () => socket.off("receiveMessage", handler);
  }, []);

  // 📤 SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim() || !selectedUser || !currentUser) return;

    const socket = getSocket();
    if (!socket) return;

    const msgData = {
      sender: currentUser._id,
      receiver: selectedUser._id,
      text: message,
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
  };

  return (
    <main
      className={`flex-1 h-screen flex flex-col ${
        darkMode ? "bg-[#0b0f10] text-white" : "bg-[#f6faf8] text-slate-900"
      }`}
    >
      {/* HEADER */}
      <header
        className={`h-16 px-6 flex items-center justify-between border-b ${
          darkMode
            ? "bg-slate-900/80 border-slate-800"
            : "bg-white/80 border-emerald-100"
        } backdrop-blur-xl`}
      >
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <h2 className="font-bold">
              {selectedUser ? selectedUser.name : "Select User"}
            </h2>
            <p className="text-xs text-emerald-500 italic animate-pulse">
              online
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {[Phone, Video, MoreVertical].map((Icon, i) => (
            <button
              key={i}
              className="p-2 rounded-full hover:bg-black/10 transition"
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </header>

      {/* MESSAGES */}
      <section className="flex-1 overflow-y-auto px-8 py-10 space-y-4">
        <div className="flex justify-center">
          <span className="text-[10px] px-3 py-1 rounded-full bg-black/5 uppercase tracking-widest">
            Today
          </span>
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === currentUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl p-4 rounded-2xl ${
                msg.sender === currentUser._id
                  ? "bg-emerald-200 text-slate-900 rounded-br-sm"
                  : darkMode
                    ? "bg-slate-800 rounded-bl-sm"
                    : "bg-white shadow rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </section>

      {/* INPUT */}
      <footer className="p-6">
        <div
          className={`flex items-center gap-3 rounded-full p-2 px-4 ${
            darkMode ? "bg-slate-800" : "bg-white shadow"
          }`}
        >
          <button>
            <Plus size={18} />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none"
          />

          <button>
            <Smile size={18} />
          </button>

          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </main>
  );
}
