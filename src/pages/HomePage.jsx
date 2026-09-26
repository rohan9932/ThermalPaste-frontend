import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Plus, RefreshCw, MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import { getFeed, POST_KEYS } from "../services/posts";

// Pulse Skeleton Card for Feed Loading
function PostCardSkeleton() {
  return (
    <div className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl overflow-hidden flex flex-row shadow-xl animate-pulse">
      {/* Vote Column Skeleton */}
      <div className="w-14 sm:w-16 bg-[#0B0D11] border-r border-[#222834]/60 flex flex-col items-center py-4 px-2 shrink-0 space-y-2">
        <div className="w-8 h-8 rounded-xl bg-[#161922]" />
        <div className="w-4 h-4 rounded bg-[#161922]" />
        <div className="w-8 h-8 rounded-xl bg-[#161922]" />
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col space-y-3">
        {/* Header Row */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-5 rounded-md bg-[#161922]" />
          <div className="w-3 h-3 rounded-full bg-[#161922]" />
          <div className="w-20 h-4 rounded bg-[#161922]" />
          <div className="w-16 h-4 rounded bg-[#161922]" />
        </div>

        {/* Title */}
        <div className="w-3/4 h-6 rounded-lg bg-[#161922]" />

        {/* Content Snippet */}
        <div className="space-y-1.5 pt-1">
          <div className="w-full h-3.5 rounded bg-[#161922]" />
          <div className="w-5/6 h-3.5 rounded bg-[#161922]" />
        </div>

        {/* Action Bar */}
        <div className="border-t border-[#222834] pt-3 flex items-center gap-4">
          <div className="w-20 h-5 rounded bg-[#161922]" />
          <div className="w-16 h-5 rounded bg-[#161922]" />
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Fetch real cross-group posts from backend
  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: POST_KEYS.feed(),
    queryFn: () => getFeed(),
  });

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Floating / Empty-state Create Post Modal */}
      <CreatePostForm
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
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
              {/* LOADING STATE */}
              {isLoading && (
                <div className="space-y-4">
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </div>
              )}

              {/* ERROR STATE */}
              {!isLoading && error && (
                <div className="w-full bg-[#0F1117] border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">
                      Failed to load feed
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8F99A8] max-w-md mx-auto">
                      {error?.response?.data?.message ||
                        error?.message ||
                        "Could not connect to the post service. Make sure the backend server is running."}
                    </p>
                  </div>
                  <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161922] border border-[#222834] text-xs font-semibold text-white hover:border-[#00D8F6] hover:text-[#00D8F6] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
                    />
                    <span>{isFetching ? "Retrying..." : "Retry"}</span>
                  </button>
                </div>
              )}

              {/* EMPTY STATE */}
              {!isLoading && !error && posts && posts.length === 0 && (
                <div className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6] mx-auto">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-white">
                      No Posts Yet
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8F99A8] max-w-md mx-auto">
                      The community feed is waiting for its first build showcase,
                      hardware benchmark, or discussion thread.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-full shadow-[0_0_15px_rgba(0,216,246,0.3)] active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create the First Post</span>
                  </button>
                </div>
              )}

              {/* FEED POSTS */}
              {!isLoading &&
                !error &&
                posts &&
                posts.length > 0 &&
                posts.map((post) => (
                  <PostCard key={post._id || post.id} post={post} />
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
