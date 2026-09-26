import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Menu,
  X,
  FileText,
  User,
  Boxes,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import CreatePostForm from "./CreatePostForm";
import {
  SEARCH_USERS,
  getCategoryIcon,
} from "../data/mockData";
import { getGroups } from "../services/groups";

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const { user, isLoading } = useAuth();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // Fetch groups dynamically from database for search suggestions
  const { data: apiGroups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = searchQuery.toLowerCase().trim();

  const filteredCommunities = query
    ? apiGroups
        .filter((c) => {
          const name = (c.name || "").toLowerCase();
          const tagline = (c.tagline || "").toLowerCase();
          const desc = (c.description || "").toLowerCase();
          const cat = (c.category || "").toLowerCase();
          return (
            name.includes(query) ||
            tagline.includes(query) ||
            desc.includes(query) ||
            cat.includes(query)
          );
        })
        .map((g) => {
          const slug = g.name.replace(/^g\//, "");
          return {
            id: slug,
            name: `g/${slug}`,
            topic: g.tagline || g.category || "Community",
            icon: getCategoryIcon(g.category),
          };
        })
    : [];

  const filteredPosts = [];

  const filteredUsers = query
    ? SEARCH_USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(query) ||
          u.role.toLowerCase().includes(query),
      )
    : [];

  const totalResults =
    filteredCommunities.length + filteredPosts.length + filteredUsers.length;

  const handleSelectResult = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <CreatePostForm
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      <header className="w-full bg-[#0F1117] border-b border-[#222834] px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3 sm:gap-4 select-none sticky top-0 z-50">
        {/* LOGO / HAMBURGER */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Hamburger Button */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-[#8F99A8] hover:text-white p-1.5 rounded-lg hover:bg-[#161922] transition cursor-pointer flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Desktop Logo */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-3 cursor-pointer no-underline"
          >
            <p className="font-bold text-white text-2xl">ThermalPaste</p>
          </Link>
        </div>

        {/* SEARCH BAR WITH INTERACTIVE DROPDOWN */}
        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#8F99A8] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setIsSearchOpen(true);
              }}
              placeholder="Search posts, groups, users..."
              className="w-full bg-[#161922] hover:bg-[#1E2330] focus:bg-[#161922] text-xs text-white placeholder-[#8F99A8] pl-10 pr-9 py-2 rounded-full border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 text-[#8F99A8] hover:text-white transition p-0.5 rounded-full hover:bg-[#222834] cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* REAL-TIME SEARCH POPUP DROPDOWN */}
          {isSearchOpen && query.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F1117] border border-[#222834] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[420px] overflow-y-auto divide-y divide-[#222834]/60">
              {totalResults === 0 ? (
                <div className="p-5 text-center text-xs text-[#8F99A8]">
                  No posts, communities, or users found matching{" "}
                  <span className="text-white font-semibold">
                    "{searchQuery}"
                  </span>
                </div>
              ) : (
                <>
                  {/* COMMUNITIES SECTION */}
                  {filteredCommunities.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F99A8] px-2.5 py-1.5">
                        Communities
                      </div>
                      <div className="space-y-1">
                        {filteredCommunities.map((c) => {
                          const Icon = c.icon;
                          return (
                            <Link
                              key={c.id}
                              to={`/communities/${c.id}`}
                              onClick={handleSelectResult}
                              className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#161922] text-white transition group cursor-pointer"
                            >
                              <div className="w-7 h-7 rounded-lg bg-[#222834]/60 flex items-center justify-center text-gray-300 group-hover:text-[#00D8F6] group-hover:bg-[#00D8F6]/10 transition-colors shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white group-hover:text-[#00D8F6] transition truncate">
                                  {c.name}
                                </p>
                                <p className="text-[11px] text-[#8F99A8] truncate">
                                  {c.topic}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* POSTS SECTION */}
                  {filteredPosts.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F99A8] px-2.5 py-1.5">
                        Posts & Threads
                      </div>
                      <div className="space-y-1">
                        {filteredPosts.map((post) => (
                          <Link
                            key={post.id}
                            to={`/post/${post.id}`}
                            state={{ post }}
                            onClick={handleSelectResult}
                            className="flex items-start gap-3 px-2.5 py-2 rounded-xl hover:bg-[#161922] text-white transition group cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#222834]/60 flex items-center justify-center text-[#8F99A8] group-hover:text-[#00D8F6] group-hover:bg-[#00D8F6]/10 transition-colors shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white group-hover:text-[#00D8F6] transition line-clamp-1">
                                {post.title}
                              </p>
                              <p className="text-[11px] text-[#8F99A8] flex items-center gap-1.5 mt-0.5">
                                <span className="text-[#00D8F6] font-medium">
                                  {post.subGroup || post.community}
                                </span>
                                <span>•</span>
                                <span>by {post.author}</span>
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* USERS SECTION */}
                  {filteredUsers.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F99A8] px-2.5 py-1.5">
                        Users
                      </div>
                      <div className="space-y-1">
                        {filteredUsers.map((user) => (
                          <Link
                            key={user.username}
                            to={user.link}
                            onClick={handleSelectResult}
                            className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#161922] text-white transition group cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white group-hover:text-[#00D8F6] transition truncate">
                                {user.username}
                              </p>
                              <p className="text-[11px] text-[#8F99A8] truncate">
                                {user.role}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ACTION ICONS & USER PROFILE */}
        <div className="flex items-center gap-x-2 sm:gap-2 shrink-0">
          {isLoading ? (
            <div className="w-20 h-8 rounded-full bg-[#161922] animate-pulse" />
          ) : user ? (
            <>
              {/* CREATE POST */}
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="flex items-center gap-1.5 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs
                font-bold px-3 py-1.5 rounded-full transition shadow-[0_0_12px_rgba(0,216,246,0.25)] 
                active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden md:inline uppercase tracking-wider text-[11px]">
                  Create
                </span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-[#8F99A8] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#161922] transition cursor-pointer"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold px-3.5 py-1.5 rounded-full transition shadow-[0_0_12px_rgba(0,216,246,0.25)] active:scale-95 cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
