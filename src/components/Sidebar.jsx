import { useState } from "react";
import { Link, useLocation } from "react-router";
import CreateGroupForm from "./CreateGroupForm";
import { Bookmark, House, Plus, UsersRound } from "lucide-react";
import { SUB_GROUPS } from "../data/mockData";

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <>
      {/* Create Group Form Modal */}
      <CreateGroupForm
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />

      {/* Mobile Overlay Background Blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer / Sticky sidebar */}
      <div
        className={`w-64 h-[calc(100vh-57px)] bg-[#0F1117] border-r border-[#222834] flex flex-col py-6 px-4 select-none shrink-0 overflow-y-auto z-40 transition-transform duration-300 ease-in-out
          fixed md:sticky top-[57px] left-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* NAVIGATION SECTION */}
        <div className="space-y-1.5 mb-6">
          <Link
            to="/"
            onClick={() => {
              if (onClose) onClose();
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

          <Link
            to="/communities"
            onClick={() => {
              if (onClose) onClose();
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

          <Link
            to="/saved"
            onClick={() => {
              if (onClose) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-semibold text-sm ${
              currentPath === "/saved"
                ? "bg-[#222732] text-[#00D8F6]"
                : "text-[#8F99A8] hover:bg-[#161922] hover:text-white"
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved</span>
          </Link>

          <button
            onClick={() => {
              setIsCreateGroupOpen(true);
              if (onClose) onClose();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-semibold text-sm text-[#8F99A8] hover:bg-[#161922] hover:text-white"
          >
            <Plus className="w-5 h-5" />
            <span>Create a Group</span>
          </button>
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
              const isGroupActive = currentPath === `/communities/${group.id}`;

              return (
                <Link
                  key={group.id}
                  to={`/communities/${group.id}`}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 cursor-pointer font-medium text-sm ${
                    isGroupActive
                      ? "bg-[#222732] text-[#00D8F6]"
                      : "text-gray-300 hover:bg-[#161922] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${group.iconColor || "text-gray-400"}`}
                    />
                    <span className="truncate">{group.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
