import { useState } from "react";
import { Link, useLocation } from "react-router";

import {
  Bookmark,
  Droplet,
  Flame,
  Gamepad2,
  House,
  Laptop,
  Monitor,
  Plus,
  Tag,
  UsersRound,
  User,
} from "lucide-react";

const SUB_GROUPS = [
  {
    id: "battlestations",
    name: "g/battlestations",
    icon: Monitor,
    count: 1,
    iconColor: "text-gray-300",
  },
  {
    id: "watercooling",
    name: "g/watercooling",
    icon: Droplet,
    count: 1,
    iconColor: "text-sky-400",
  },
  {
    id: "gpuhype",
    name: "g/gpuhype",
    icon: Gamepad2,
    count: 1,
    iconColor: "text-purple-400",
  },
  {
    id: "overclocking",
    name: "g/overclocking",
    icon: Flame,
    count: 1,
    iconColor: "text-orange-500",
  },
  {
    id: "pcbuilders",
    name: "g/pcbuilders",
    icon: Laptop,
    count: 1,
    iconColor: "text-gray-400",
  },
  {
    id: "techdeals",
    name: "g/techdeals",
    icon: Tag,
    count: 1,
    iconColor: "text-amber-200",
  },
];

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeId, setActiveId] = useState("home");

  return (
    <>
      {/* Mobile Overlay Background Blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer / Fixed sidebar */}
      <div
        className={`w-64 h-[calc(100vh-57px)] bg-[#0F1117] border-r border-[#222834] flex flex-col py-10 px-4 select-none shrink-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out
          fixed md:sticky top-[57px] left-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* NAVIGATION SECTION */}
        <div className="space-y-2 mb-6">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => {
                if (onClose) onClose(); // closes drawer automatically
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-semibold text-sm ${
                currentPath === "/"
                  ? "bg-[#222732] text-[#00D8F6]"
                  : "text-[#8F99A8] hover:bg-[#161922] hover:text-white"
              }`}
            >
              <House className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              to="/communities"
              onClick={() => {
                if (onClose) onClose(); // closes drawer automatically
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-semibold text-sm ${
                currentPath === "/communities"
                  ? "bg-[#222732] text-[#00D8F6]"
                  : "text-[#8F99A8] hover:bg-[#161922] hover:text-white"
              }`}
            >
              <UsersRound className="w-5 h-5" />
              <span>Communities</span>
            </Link>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveId("saved");
                if (onClose) onClose(); // closes drawer automatically
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-semibold text-sm ${
                activeId === "saved" && currentPath !== "/" && currentPath !== "/profile" && currentPath !== "/communities"
                  ? "bg-[#222732] text-[#00D8F6]"
                  : "text-[#8F99A8] hover:bg-[#161922] hover:text-white"
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span>Saved</span>
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                if (onClose) onClose(); // closes drawer automatically
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-semibold text-sm text-[#8F99A8] hover:bg-[#161922] hover:text-white"
            >
              <Plus className="w-5 h-5" />
              <span>Create a Group</span>
            </button>
          </div>
        </div>

        {/* SUB-GROUPS SECTION */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-[11px] font-bold text-[#8F99A8] uppercase tracking-wider">
              Sub-groups
            </h3>
          </div>

          <div className="space-y-1">
            {SUB_GROUPS.map((group) => {
              const Icon = group.icon;
              const isActive = activeId === group.id;

              return (
                <button
                  key={group.id}
                  onClick={() => {
                    setActiveId(group.id);
                    if (onClose) onClose(); // closes drawer automatically
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-medium text-sm ${
                    isActive
                      ? "bg-[#222732] text-[#00D8F6]"
                      : "text-gray-300 hover:bg-[#161922] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-4 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${group.iconColor || "text-gray-400"}`}
                    />
                    <span className="truncate">{group.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
