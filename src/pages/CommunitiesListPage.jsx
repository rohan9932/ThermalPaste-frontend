import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getCategoryIcon } from "../data/mockData";
import { getGroups } from "../services/groups";
import { useAuth } from "../context/AuthContext";
import { Boxes, Lock, Globe, Check, Users } from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Hubs" },
  { id: "hardware", label: "Hardware" },
  { id: "battlestations", label: "Battlestations" },
  { id: "cooling", label: "Cooling" },
  { id: "overclocking", label: "Overclocking" },
  { id: "peripherals", label: "Peripherals" },
  { id: "techdeals", label: "Deals" },
];

export default function CommunitiesListPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();

  const { data: apiGroups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  });

  // Map all database groups strictly with category-assigned icons
  const displayGroups = useMemo(() => {
    return (apiGroups || []).map((g) => {
      const slug = g.name.replace(/^g\//, "");
      const Icon = getCategoryIcon(g.category);

      const isMember = Boolean(g.isMember);
      const isCreator = Boolean(g.isCreator);
      const isJoinedInProfile = Boolean(
        user?.groups?.some(
          (ug) =>
            (ug?._id || ug)?.toString() === g._id?.toString() ||
            ug?.name === g.name ||
            ug === g.name,
        ),
      );
      const isJoined = isMember || isCreator || isJoinedInProfile;

      return {
        id: slug,
        _id: g._id,
        name: `g/${slug}`,
        category: (g.category || "hardware").toLowerCase(),
        topic: g.tagline || g.category || "Hardware Community",
        description: g.description || "",
        members: g.membersCount ?? (g.members?.length || 1),
        privacy: g.privacy || "public",
        isJoined,
        icon: Icon,
        colorHex: "#00D8F6",
        bgColor: "#00D8F615",
      };
    });
  }, [apiGroups, user]);

  // Client-side filtering based on selected category
  const filteredGroups = useMemo(() => {
    if (selectedCategory === "all") return displayGroups;
    return displayGroups.filter((community) => community.category === selectedCategory);
  }, [displayGroups, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 relative w-full">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main
          className={`flex-1 p-3.5 sm:p-5 md:p-6 w-full min-w-0 transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="border-b border-[#222834] pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  All Communities
                </h1>
                <p className="text-xs sm:text-sm text-[#8F99A8] mt-1 leading-relaxed">
                  Discover and explore all hardware, cooling, and overclocking communities.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <span className="text-xs text-[#00D8F6] font-semibold bg-[#00D8F6]/10 px-3 py-1.5 rounded-full border border-[#00D8F6]/30 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>
                    {displayGroups.length} {displayGroups.length === 1 ? "Community" : "Communities"}
                  </span>
                </span>
              </div>
            </div>

            {/* Category Pills (horizontally scrollable without visible scrollbar) */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? "bg-[#00D8F6] text-[#0B0D11] shadow-[0_0_12px_rgba(0,216,246,0.25)]"
                        : "bg-[#0F1117] text-[#8F99A8] hover:text-white hover:bg-[#161922] border border-[#222834]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Content states */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="p-4 sm:p-5 rounded-2xl border border-[#222834] bg-[#0F1117] animate-pulse space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#161922]" />
                        <div className="space-y-1.5">
                          <div className="h-4 w-28 bg-[#161922] rounded" />
                          <div className="h-3 w-20 bg-[#161922] rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-16 bg-[#161922] rounded-md" />
                    </div>
                    <div className="h-3.5 w-full bg-[#161922] rounded" />
                    <div className="h-3.5 w-4/5 bg-[#161922] rounded" />
                    <div className="pt-3 border-t border-[#222834]/50 flex justify-between">
                      <div className="h-3 w-20 bg-[#161922] rounded" />
                      <div className="h-3 w-4 bg-[#161922] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayGroups.length === 0 ? (
              <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-8 sm:p-12 text-center space-y-4 shadow-xl">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6] mx-auto">
                  <Boxes className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    No communities found
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8F99A8] max-w-sm mx-auto">
                    There are no active communities in the database yet.
                  </p>
                </div>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-8 sm:p-12 text-center space-y-4 shadow-xl">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#161922] border border-[#222834] flex items-center justify-center text-[#8F99A8] mx-auto">
                  <Boxes className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    No communities in this category
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8F99A8] max-w-sm mx-auto">
                    There are currently no communities listed under the selected filter.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161922] hover:bg-[#222834] border border-[#222834] text-xs font-semibold text-white transition cursor-pointer"
                >
                  Show All Hubs
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5">
                {filteredGroups.map((community) => {
                  const Icon = community.icon;
                  return (
                    <Link
                      key={community.id}
                      to={`/communities/${community.id}`}
                      className="p-4 sm:p-5 rounded-2xl border border-[#222834] bg-[#0F1117] hover:border-[#00D8F6]/40 hover:bg-[#12151D] transition-all duration-200 group flex flex-col h-full shadow-lg"
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2.5 sm:gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border border-transparent group-hover:border-current transition-colors"
                            style={{
                              backgroundColor: community.bgColor,
                              color: community.colorHex,
                            }}
                          >
                            <Icon className="w-5 h-5 shrink-0" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-[#00D8F6] transition-colors truncate">
                              {community.name}
                            </h2>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-[#8F99A8] mt-0.5 flex-wrap">
                              <span>
                                {community.members} {community.members === 1 ? "member" : "members"}
                              </span>
                              <span className="text-[#8F99A8]/40">•</span>
                              <span className="capitalize text-[#00D8F6]/80 truncate">
                                {community.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center justify-end gap-1.5 shrink-0 max-w-[45%]">
                          {community.isJoined && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#00D8F6] bg-[#00D8F6]/10 px-2 py-0.5 rounded border border-[#00D8F6]/30">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              Joined
                            </span>
                          )}
                          {community.privacy === "private" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              <Lock className="w-3 h-3" />
                              Private
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                              <Globe className="w-3 h-3" />
                              Public
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#C4C9D4] leading-relaxed flex-1 line-clamp-2 my-1">
                        {community.description || community.topic}
                      </p>

                      {/* Footer */}
                      <div className="mt-3.5 pt-3 border-t border-[#222834]/50 flex items-center justify-between text-xs font-bold text-[#00D8F6]">
                        <span className="group-hover:underline">Visit Community</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
