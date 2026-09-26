import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { getCategoryIcon } from "../data/mockData";
import { getGroups } from "../services/groups";
import { useAuth } from "../context/AuthContext";
import { Boxes, Lock, Globe, Check } from "lucide-react";

export default function CommunitiesListPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const { data: apiGroups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  });

  // Map all database groups strictly with category-assigned icons
  const displayGroups = (apiGroups || []).map((g) => {
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
      category: g.category || "hardware",
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

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main
          className={`flex-1 p-4 sm:p-6 w-full transition-all duration-300 ${
            isSidebarOpen ? "md:ml-64" : "ml-0"
          }`}
        >
          <div className="space-y-6">
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="mb-6 border-b border-[#222834] pb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    All Communities
                  </h1>
                  <p className="text-sm text-[#8F99A8] mt-1">
                    Discover and explore all hardware, cooling, and overclocking sub-groups.
                  </p>
                </div>
                <span className="text-xs text-[#00D8F6] font-semibold bg-[#00D8F6]/10 px-3 py-1 rounded-full border border-[#00D8F6]/30">
                  {displayGroups.length} Communities
                </span>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="p-5 rounded-2xl border border-[#222834] bg-[#0F1117] animate-pulse space-y-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#161922]" />
                      <div className="h-4 w-32 bg-[#161922] rounded" />
                      <div className="h-3 w-full bg-[#161922] rounded" />
                    </div>
                  ))}
                </div>
              ) : displayGroups.length === 0 ? (
                <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-10 sm:p-12 text-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6] mx-auto">
                    <Boxes className="w-7 h-7" />
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
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayGroups.map((community) => {
                    const Icon = community.icon;
                    return (
                      <Link
                        key={community.id}
                        to={`/communities/${community.id}`}
                        className="p-5 rounded-2xl border border-[#222834] bg-[#0F1117] hover:border-[#00D8F6]/40 transition-all group flex flex-col h-full"
                      >
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-transparent group-hover:border-current transition-colors"
                              style={{
                                backgroundColor: community.bgColor,
                                color: community.colorHex,
                              }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h2 className="text-base font-bold text-white group-hover:text-[#00D8F6] transition-colors truncate">
                                {community.name}
                              </h2>
                              <div className="flex items-center gap-2 text-xs font-semibold text-[#8F99A8]">
                                <span>{community.members} members</span>
                                <span className="text-[#8F99A8]/40">•</span>
                                <span className="capitalize text-[#00D8F6]/80">{community.category}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {community.isJoined && (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#00D8F6] bg-[#00D8F6]/10 px-2 py-0.5 rounded border border-[#00D8F6]/30">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                Joined
                              </span>
                            )}
                            {community.privacy === "private" ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                <Lock className="w-3 h-3" />
                                Private
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                <Globe className="w-3 h-3" />
                                Public
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-[#C4C9D4] leading-relaxed flex-1">
                          {community.description || community.topic}
                        </p>
                        <div className="mt-4 pt-3 border-t border-[#222834]/50 flex items-center justify-between text-xs font-bold text-[#00D8F6] group-hover:underline">
                          <span>Visit Community</span>
                          <span>&rarr;</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
