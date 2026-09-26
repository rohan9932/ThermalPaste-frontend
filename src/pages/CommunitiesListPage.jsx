import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SUB_GROUPS, COMMUNITY_ICON_MAP } from "../data/mockData";
import { getGroups } from "../services/groups";
import { Boxes, Lock, Globe } from "lucide-react";

export default function CommunitiesListPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: apiGroups, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  });

  // Merge or fallback to default mock groups if backend is empty
  const displayGroups =
    apiGroups && apiGroups.length > 0
      ? apiGroups.map((g) => {
          const slug = g.name.replace(/^g\//, "");
          const mockMatch = SUB_GROUPS.find(
            (m) => m.id === slug || m.name === `g/${slug}`,
          );
          const Icon =
            COMMUNITY_ICON_MAP[slug] ||
            COMMUNITY_ICON_MAP[`g/${slug}`] ||
            mockMatch?.icon ||
            Boxes;

          return {
            id: slug,
            name: `g/${slug}`,
            topic: g.tagline || mockMatch?.topic || "Hardware Community",
            description: g.description || mockMatch?.description || "",
            members: g.membersCount ?? mockMatch?.members ?? 1,
            privacy: g.privacy || "public",
            icon: Icon,
            colorHex: mockMatch?.colorHex || "#00D8F6",
            bgColor: mockMatch?.bgColor || "#00D8F615",
          };
        })
      : SUB_GROUPS;

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
                    Your Communities
                  </h1>
                  <p className="text-sm text-[#8F99A8] mt-1">
                    Manage and explore the sub-groups you've joined.
                  </p>
                </div>
                <span className="text-xs text-[#00D8F6] font-semibold bg-[#00D8F6]/10 px-3 py-1 rounded-full border border-[#00D8F6]/30">
                  {displayGroups.length} Active Groups
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
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-transparent group-hover:border-current transition-colors"
                              style={{
                                backgroundColor: community.bgColor,
                                color: community.colorHex,
                              }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h2 className="text-base font-bold text-white group-hover:text-[#00D8F6] transition-colors">
                                {community.name}
                              </h2>
                              <p className="text-xs font-semibold text-[#8F99A8]">
                                {community.members} members
                              </p>
                            </div>
                          </div>

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

                        <p className="text-sm text-[#C4C9D4] leading-relaxed flex-1">
                          {community.description}
                        </p>
                        <div className="mt-4 pt-3 border-t border-[#222834]/50 text-xs font-bold text-[#00D8F6] group-hover:underline">
                          Visit Community &rarr;
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
