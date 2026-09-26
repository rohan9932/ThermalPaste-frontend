import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import {
  Boxes,
  Users,
  Lock,
  Globe,
  Check,
  UserPlus,
  Loader2,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Plus,
} from "lucide-react";
import { getCategoryIcon } from "../data/mockData";
import { getGroupByIdOrName, joinGroup, leaveGroup } from "../services/groups";
import { getPostsByGroup, POST_KEYS } from "../services/posts";
import { useAuth } from "../context/AuthContext";

// Skeleton for community posts loading
function CommunityPostSkeleton() {
  return (
    <div className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl overflow-hidden flex flex-row shadow-xl animate-pulse">
      <div className="w-14 sm:w-16 bg-[#0B0D11] border-r border-[#222834]/60 flex flex-col items-center py-4 px-2 shrink-0 space-y-2">
        <div className="w-8 h-8 rounded-xl bg-[#161922]" />
        <div className="w-4 h-4 rounded bg-[#161922]" />
        <div className="w-8 h-8 rounded-xl bg-[#161922]" />
      </div>
      <div className="flex-1 p-4 sm:p-5 flex flex-col space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-24 h-5 rounded-md bg-[#161922]" />
          <div className="w-3 h-3 rounded-full bg-[#161922]" />
          <div className="w-20 h-4 rounded bg-[#161922]" />
        </div>
        <div className="w-3/4 h-6 rounded-lg bg-[#161922]" />
        <div className="w-full h-3.5 rounded bg-[#161922]" />
        <div className="border-t border-[#222834] pt-3 flex items-center gap-4">
          <div className="w-20 h-5 rounded bg-[#161922]" />
          <div className="w-16 h-5 rounded bg-[#161922]" />
        </div>
      </div>
    </div>
  );
}

export default function CommunitiesPage() {
  const { groupId } = useParams();
  const displayGroupId = (groupId || "").replace(/^g\//, "");
  const displayGroupName = `g/${displayGroupId}`;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // Fetch real group metadata from backend API
  const {
    data: apiGroup,
    isLoading: isGroupLoading,
    error: groupError,
    refetch: refetchGroup,
  } = useQuery({
    queryKey: ["group", displayGroupId],
    queryFn: () => getGroupByIdOrName(displayGroupId),
    retry: false,
    enabled: Boolean(displayGroupId),
  });

  // Fetch community-scoped posts from backend API
  const {
    data: apiPosts,
    isLoading: isPostsLoading,
    error: postsError,
    refetch: refetchPosts,
    isFetching: isPostsFetching,
  } = useQuery({
    queryKey: POST_KEYS.group(displayGroupId),
    queryFn: () => getPostsByGroup(displayGroupId),
    enabled: Boolean(displayGroupId),
  });

  const posts = apiPosts || [];

  const groupData = apiGroup || {
    name: displayGroupName,
    tagline: "Tech Community",
    description:
      "Join the discussion, share your benchmarks, rigs, questions, and guides.",
    membersCount: 0,
    privacy: "public",
    isMember: false,
    isCreator: false,
    isPending: false,
    hasAccess: true,
  };

  const category = apiGroup?.category || groupData.category || "hardware";
  const CommunityIcon = getCategoryIcon(category);

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
      {/* Create Post Modal pre-selected with this community */}
      <CreatePostForm
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        defaultCommunity={displayGroupId}
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
              {/* Loading State for Group Header */}
              {isGroupLoading ? (
                <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-5 sm:p-6 mb-4 animate-pulse">
                  <div className="flex flex-col lg:flex-row items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#161922] shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 w-48 bg-[#161922] rounded" />
                      <div className="h-4 w-32 bg-[#161922] rounded" />
                      <div className="h-3 w-3/4 bg-[#161922] rounded" />
                    </div>
                  </div>
                </div>
              ) : !apiGroup || groupError ? (
                <div className="rounded-2xl border border-rose-500/30 bg-[#0F1117] p-8 text-center space-y-4 mb-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Community Not Found
                    </h3>
                    <p className="text-xs text-[#8F99A8] max-w-sm mx-auto">
                      The sub-group "{displayGroupName}" does not exist in the database.
                    </p>
                  </div>
                  <Link
                    to="/communities"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D8F6] text-[#0B0D11] text-xs font-bold transition hover:bg-[#00c4e0]"
                  >
                    Browse Active Communities
                  </Link>
                </div>
              ) : (
                <>
                  {/* Community Header Card */}
                  <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-5 sm:p-6 mb-4">
                    <div className="flex flex-col lg:flex-row items-start gap-4">
                      {/* Community icon badge */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border overflow-hidden"
                        style={{
                          backgroundColor: "#00D8F615",
                          borderColor: "#00D8F630",
                          color: "#00D8F6",
                        }}
                      >
                        <CommunityIcon className="w-7 h-7" />
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
                      {/* Loading State */}
                      {isPostsLoading && (
                        <div className="space-y-4">
                          <CommunityPostSkeleton />
                          <CommunityPostSkeleton />
                        </div>
                      )}

                      {/* Error State */}
                      {!isPostsLoading && postsError && (
                        <div className="rounded-2xl border border-rose-500/30 bg-[#0F1117] p-8 text-center space-y-4 shadow-xl">
                          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white mb-1">
                              Failed to load community posts
                            </h3>
                            <p className="text-xs text-[#8F99A8] max-w-sm mx-auto">
                              {postsError?.response?.data?.message ||
                                postsError?.message ||
                                "Could not retrieve threads for this community."}
                            </p>
                          </div>
                          <button
                            onClick={() => refetchPosts()}
                            disabled={isPostsFetching}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161922] border border-[#222834] text-xs font-semibold text-white hover:border-[#00D8F6] hover:text-[#00D8F6] transition cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw
                              className={`w-3.5 h-3.5 ${isPostsFetching ? "animate-spin" : ""}`}
                            />
                            <span>{isPostsFetching ? "Retrying..." : "Retry"}</span>
                          </button>
                        </div>
                      )}

                      {/* Empty State */}
                      {!isPostsLoading && !postsError && posts.length === 0 && (
                        <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-10 sm:p-12 text-center space-y-4 shadow-xl">
                          <div className="w-14 h-14 rounded-2xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6] mx-auto">
                            <MessageSquare className="w-7 h-7" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-base sm:text-lg font-bold text-white">
                              No posts in this community yet
                            </h3>
                            <p className="text-xs sm:text-sm text-[#8F99A8] max-w-sm mx-auto">
                              Be the first to share your build, benchmarks, or ask a
                              question in{" "}
                              <span className="text-white font-semibold">
                                {displayGroupName}
                              </span>
                              !
                            </p>
                          </div>
                          <button
                            onClick={() => setIsCreatePostOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-full shadow-[0_0_15px_rgba(0,216,246,0.3)] active:scale-95 transition cursor-pointer"
                          >
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>Write the First Post</span>
                          </button>
                        </div>
                      )}

                      {/* Post Cards List */}
                      {!isPostsLoading &&
                        !postsError &&
                        posts.length > 0 &&
                        posts.map((post) => (
                          <PostCard key={post._id || post.id} post={post} />
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
