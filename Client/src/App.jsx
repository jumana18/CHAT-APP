import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import RightPanel from "./components/RightPanel";
import Login from "./pages/Login";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(
    JSON.parse(localStorage.getItem("selectedUser")) || null,
  );

  const user = localStorage.getItem("user");

  if (!user) return <Login />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setSelectedUser={setSelectedUser}
      />

      <ChatArea darkMode={darkMode} selectedUser={selectedUser} />

      <RightPanel darkMode={darkMode} />
    </div>
  );
}
