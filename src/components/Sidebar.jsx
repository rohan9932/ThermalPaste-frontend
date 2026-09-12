import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreateGroupForm from "./CreateGroupForm";
import { Bookmark, House, Plus, UsersRound, UserRoundCog, LogOut } from "lucide-react";
import { SUB_GROUPS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, isLoading, logout } = useAuth();
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    navigate("/login");
  };

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
        className={`w-64 h-[calc(100vh-57px)] bg-[#0F1117] border-r border-[#222834] flex flex-col py-5 px-4 select-none shrink-0 z-40 transition-transform duration-300 ease-in-out
          fixed md:sticky top-[57px] left-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* SCROLLABLE MAIN NAVIGATION CONTENT */}
        <div className="flex-1 overflow-y-auto pr-0.5 space-y-6">
          {/* NAVIGATION SECTION */}
          <div className="space-y-1.5">
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

        {/* BOTTOM USER PROFILE & SESSION FOOTER */}
        <div className="pt-3 mt-3 border-t border-[#222834]">
          {isLoading ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[#161922] animate-pulse">
              <div className="w-9 h-9 rounded-full bg-[#222834]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-20 bg-[#222834] rounded" />
                <div className="h-2.5 w-12 bg-[#222834] rounded" />
              </div>
            </div>
          ) : user ? (
            <div className="space-y-1.5">
              {/* Profile navigation section */}
              <Link
                to="/profile"
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-150 group cursor-pointer ${
                  currentPath === "/profile"
                    ? "bg-[#222732] border border-[#00D8F6]/30 text-white"
                    : "hover:bg-[#161922] text-[#8F99A8] hover:text-white"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-200 shrink-0 group-hover:ring-2 group-hover:ring-[#00D8F6]/40 transition">
                  <UserRoundCog className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-[#00D8F6] transition truncate">
                    {user.username || "Profile"}
                  </p>
                  <p className="text-[11px] text-[#8F99A8] truncate">
                    {user.email || "View Profile"}
                  </p>
                </div>
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#161922]/60 border border-[#222834] space-y-2">
              <p className="text-[11px] text-[#8F99A8] leading-tight">
                Sign in to join communities and share posts.
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <Link
                  to="/login"
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className="flex-1 text-center py-1.5 rounded-lg text-xs font-semibold text-white bg-[#222732] hover:bg-[#2c3240] transition cursor-pointer"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className="flex-1 text-center py-1.5 rounded-lg text-xs font-bold text-[#0B0D11] bg-[#00D8F6] hover:bg-[#00c4e0] transition shadow-[0_0_10px_rgba(0,216,246,0.2)] cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
