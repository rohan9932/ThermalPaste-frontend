import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import {
  LayoutGrid,
  Boxes,
  Users,
  Lock,
  Globe,
  Check,
  UserPlus,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import {
  getPostsByCommunity,
  getCommunityById,
  COMMUNITY_ICON_MAP,
} from "../data/mockData";
import { getGroupByIdOrName, joinGroup, leaveGroup } from "../services/groups";
import { useAuth } from "../context/AuthContext";

export default function CommunitiesPage() {
  const { groupId } = useParams();
  const displayGroupId = groupId || "battlestations";
  const displayGroupName = `g/${displayGroupId}`;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // Fetch real group from backend API
  const {
    data: apiGroup,
    isLoading: isGroupLoading,
    refetch: refetchGroup,
  } = useQuery({
    queryKey: ["group", displayGroupId],
    queryFn: () => getGroupByIdOrName(displayGroupId),
    retry: false,
  });

  // Fallback to mock data if group hasn't been created on backend yet
  const mockInfo = getCommunityById(displayGroupId);
  const posts = getPostsByCommunity(displayGroupId);

  const groupData = apiGroup || {
    name: mockInfo?.name || displayGroupName,
    tagline: mockInfo?.topic || "Tech Community",
    description:
      mockInfo?.description ||
      "Join the discussion, share your benchmarks, rigs, questions, and guides.",
    membersCount: mockInfo?.members || "14.2k",
    privacy: "public",
    isMember: false,
    isCreator: false,
    isPending: false,
    hasAccess: true,
  };

  const CommunityIcon =
    COMMUNITY_ICON_MAP[displayGroupName] ||
    COMMUNITY_ICON_MAP[displayGroupId] ||
    mockInfo?.icon ||
    Boxes;

  const handleJoinOrLeave = async () => {
    if (!user) {
      navigate("/login", {
        state: { from: `/communities/${displayGroupId}` },
      });
      return;
    }

    if (!apiGroup?._id) return;

    setIsActionLoading(true);
    setActionError("");

    try {
      if (groupData.isMember) {
        await leaveGroup(apiGroup._id);
      } else {
        await joinGroup(apiGroup._id);
      }
      await refetchGroup();
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || "Action failed",
      );
    } finally {
      setIsActionLoading(false);
    }
  };

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

                  {/* Community name, tagline, description, & privacy tag */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-white">
                        {groupData.name.startsWith("g/")
                          ? groupData.name
                          : `g/${groupData.name}`}
                      </h2>

                      {groupData.privacy === "private" ? (
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

                      {groupData.isCreator && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D8F6] bg-[#00D8F6]/10 px-2 py-0.5 rounded border border-[#00D8F6]/30">
                          Creator
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#00D8F6] font-semibold mt-0.5">
                      {groupData.tagline || "Tech Community"}
                    </p>
                    <p className="text-xs text-[#8F99A8] leading-relaxed mt-1">
                      {groupData.description}
                    </p>

                    {actionError && (
                      <p className="text-xs text-rose-400 mt-2 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                        {actionError}
                      </p>
                    )}
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                    {/* Member Count */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#222834] text-xs text-[#8F99A8]">
                      <Users className="w-3.5 h-3.5" />
                      <span>Members:</span>
                      <span className="font-bold text-white">
                        {groupData.membersCount}
                      </span>
                    </div>

                    {/* Join / Leave / Pending Button (if backend group exists) */}
                    {apiGroup?._id && !groupData.isCreator && (
                      <button
                        onClick={handleJoinOrLeave}
                        disabled={isActionLoading || groupData.isPending}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          groupData.isMember
                            ? "bg-[#161922] text-[#8F99A8] hover:text-rose-400 hover:bg-rose-500/10 border border-[#222834]"
                            : groupData.isPending
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 cursor-default"
                              : "bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] shadow-[0_0_12px_rgba(0,216,246,0.25)]"
                        }`}
                      >
                        {isActionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : groupData.isMember ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Leave Group</span>
                          </>
                        ) : groupData.isPending ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Request Pending</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>
                              {groupData.privacy === "private"
                                ? "Request to Join"
                                : "Join Group"}
                            </span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Write Post action */}
                    <button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="px-4 py-2 rounded-xl bg-white text-[#0B0D11] text-xs font-bold transition-all hover:bg-gray-200 cursor-pointer"
                    >
                      Write Post here
                    </button>
                  </div>
                </div>
              </div>

              {/* Private Group Access Gate */}
              {groupData.privacy === "private" && !groupData.hasAccess ? (
                <div className="rounded-2xl border border-amber-500/30 bg-[#0F1117] p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Private Community
                  </h3>
                  <p className="text-xs text-[#8F99A8] max-w-md mx-auto">
                    This is a private sub-group. You must request to join and be
                    accepted by the creator before viewing threads and
                    participating.
                  </p>
                </div>
              ) : (
                /* Posts Feed */
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {posts.length === 0 && (
                    <div className="rounded-2xl border border-[#222834] bg-[#0F1117] py-12 text-center text-[#8F99A8] text-sm">
                      No posts found in this community yet. Be the first to
                      share!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
