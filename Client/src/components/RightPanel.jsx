// src/components/RightPanel.jsx

export default function RightPanel({ darkMode }) {
  const users = ["Clara Oswald", "Dr. Aris Thorne", "Sophia Reed"];

  return (
    <aside
      className={`w-80 h-screen p-6 hidden lg:flex flex-col gap-6 ${
        darkMode ? "bg-slate-900 text-white" : "bg-[#eef5f2] text-slate-900"
      }`}
    >
      <h3 className="text-xl font-bold">Details</h3>

      {/* Shared Media */}
      <div
        className={`rounded-2xl p-4 ${
          darkMode ? "bg-slate-800" : "bg-white shadow"
        }`}
      >
        <div className="flex justify-between mb-4">
          <span className="font-semibold text-sm">Shared Media</span>
          <span className="text-xs text-emerald-600 cursor-pointer">
            View All
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <img
            src="https://picsum.photos/200?1"
            className="rounded-xl h-28 w-full object-cover"
          />
          <img
            src="https://picsum.photos/200?2"
            className="rounded-xl h-28 w-full object-cover"
          />
        </div>
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-xs uppercase tracking-widest opacity-60 mb-3">
          Active Conversations
        </p>

        <div className="space-y-2">
          {users.map((user, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                darkMode ? "hover:bg-slate-800" : "hover:bg-white"
              }`}
            >
              <img
                src={`https://i.pravatar.cc/100?img=${i + 20}`}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <p className="font-medium text-sm">{user}</p>
                <p className="text-xs opacity-60 truncate">
                  Last conversation message...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
