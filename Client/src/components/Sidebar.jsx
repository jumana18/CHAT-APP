import {
  MessageSquare,
  Users,
  Phone,
  Settings,
  Edit,
  Sun,
  Moon,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ darkMode, setDarkMode, setSelectedUser }) {
  const menu = [
    { icon: MessageSquare, label: "Messages", active: true },
    { icon: Users, label: "Contacts" },
    { icon: Phone, label: "Calls" },
    { icon: Settings, label: "Settings" },
  ];

  const [users, setUsers] = useState([]);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <aside
      className={`w-80 h-screen flex flex-col p-4 transition-all duration-300 border-r ${
        darkMode
          ? "bg-slate-950 border-slate-900 text-white"
          : "bg-emerald-50 border-emerald-100 text-slate-900"
      }`}
    >
      {/* Brand */}
      <div className="mb-8 px-4">
        <h1
          className={`text-xl font-black tracking-tight ${
            darkMode ? "text-emerald-200" : "text-emerald-800"
          }`}
        >
          The Exchange
        </h1>

        <p
          className={`text-xs uppercase tracking-[0.25em] mt-1 ${
            darkMode ? "text-slate-500" : "text-emerald-700/70"
          }`}
        >
          Digital Sanctuary
        </p>
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        {menu.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? darkMode
                    ? "bg-emerald-900/30 text-emerald-100"
                    : "bg-emerald-200/50 text-emerald-900"
                  : darkMode
                    ? "text-slate-400 hover:bg-slate-900"
                    : "text-emerald-700/70 hover:bg-emerald-100"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Users List */}
      <div className="mt-6 flex-1 overflow-y-auto space-y-2">
        <p className="text-xs opacity-60 px-4">Users</p>

        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              localStorage.setItem("selectedUser", JSON.stringify(user));
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer ${
              darkMode ? "hover:bg-slate-900" : "hover:bg-white"
            }`}
          >
            <img
              src="https://i.pravatar.cc/100?img=12"
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs opacity-60">{user.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* New Message */}
      <button className="mt-4 w-full py-4 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[0.98] transition-all">
        <Edit size={18} />
        <span>New Message</span>
      </button>

      {/* Bottom User */}
      <div className="mt-6 pt-4 px-2 flex items-center gap-3">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/100?img=32"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold">Elena Vance</p>
          <p
            className={`text-[10px] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Online
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition ${
            darkMode
              ? "hover:bg-slate-800 text-yellow-400"
              : "hover:bg-emerald-100 text-slate-700"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </aside>
  );
}
