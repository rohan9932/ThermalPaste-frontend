import React, { useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import { LayoutGrid, Boxes } from "lucide-react";
import {
  getPostsByCommunity,
  getCommunityById,
  COMMUNITY_ICON_MAP,
} from "../data/mockData";

export default function CommunitiesPage() {
  const { groupId } = useParams();
  const displayGroupId = groupId || "battlestations";
  const displayGroupName = `g/${displayGroupId}`;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Fetch community data and matching posts by community identifier
  const communityInfo = getCommunityById(displayGroupId);
  const posts = getPostsByCommunity(displayGroupId);

  const CommunityIcon =
    COMMUNITY_ICON_MAP[displayGroupName] ||
    COMMUNITY_ICON_MAP[displayGroupId] ||
    communityInfo?.icon ||
    Boxes;

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      {/* Create Post Modal */}
      <CreatePostForm
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        defaultCommunity={displayGroupName}
      />

      {/* Shared top navigation bar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 relative">
        {/* Collapsible left sidebar */}
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
              {/* Community Header Card */}
              <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-5 sm:p-6 mb-4">
                <div className="flex flex-col lg:flex-row items-start gap-4">
                  {/* Community icon badge */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      backgroundColor: "#00D8F615",
                      borderColor: "#00D8F630",
                      color: "#00D8F6",
                    }}
                  >
                    <CommunityIcon className="w-6 h-6" />
                  </div>

                  {/* Community name, tagline, and description */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white">
                      {communityInfo ? communityInfo.name : displayGroupName}
                    </h2>
                    <p className="text-sm text-[#00D8F6] font-semibold mt-0.5">
                      {communityInfo ? communityInfo.topic : "Tech Community"}
                    </p>
                    <p className="text-xs text-[#8F99A8] leading-relaxed mt-1">
                      {communityInfo
                        ? communityInfo.description
                        : "Join the discussion, share your benchmarks, rigs, questions, and guides."}
                    </p>
                  </div>

                  {/* Posts count + Write Post action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#222834] text-xs text-[#8F99A8]">
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Posts Count:</span>
                      <span className="font-bold text-white">
                        {posts.length}
                      </span>
                    </div>

                    <button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="px-4 py-2 rounded-xl bg-white text-[#0B0D11] text-xs font-bold transition-all hover:bg-gray-200 cursor-pointer"
                    >
                      Write Post here
                    </button>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {posts.length === 0 && (
                  <div className="rounded-2xl border border-[#222834] bg-[#0F1117] py-12 text-center text-[#8F99A8] text-sm">
                    No posts found in this community yet. Be the first to share!
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
