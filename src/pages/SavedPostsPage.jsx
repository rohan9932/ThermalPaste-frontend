import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import {
  Bookmark,
  Compass,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { getSavedPosts, POST_KEYS } from "../services/posts";

// Skeleton for loading saved posts
function SavedPostSkeleton() {
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

export default function SavedPostsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch live saved posts from backend
  const {
    data: savedPosts,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: POST_KEYS.saved(),
    queryFn: () => getSavedPosts(),
  });

  const savedCount = savedPosts?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      {/* Shared Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 relative">
        {/* Collapsible Sidebar */}
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
              {/* Header Card */}
              <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6] shrink-0">
                    <Bookmark className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                      Saved Posts
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8F99A8] mt-0.5">
                      Your bookmarked guides, benchmarks, and rig setups
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161922] border border-[#222834] text-xs font-semibold text-[#8F99A8]">
                  <span>Total Saved:</span>
                  <span className="text-[#00D8F6] font-bold">
                    {savedCount}
                  </span>
                </div>
              </div>

              {/* LOADING STATE */}
              {isLoading && (
                <div className="space-y-4">
                  <SavedPostSkeleton />
                  <SavedPostSkeleton />
                </div>
              )}

              {/* ERROR STATE */}
              {!isLoading && error && (
                <div className="rounded-2xl border border-rose-500/30 bg-[#0F1117] p-8 text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Failed to load saved posts
                    </h3>
                    <p className="text-xs text-[#8F99A8] max-w-sm mx-auto">
                      {error?.response?.data?.message ||
                        error?.message ||
                        "Could not connect to the backend to fetch your bookmarks."}
                    </p>
                  </div>
                  <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161922] border border-[#222834] text-xs font-semibold text-white hover:border-[#00D8F6] hover:text-[#00D8F6] transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
                    />
                    <span>{isFetching ? "Retrying..." : "Retry"}</span>
                  </button>
                </div>
              )}

              {/* EMPTY STATE */}
              {!isLoading && !error && savedPosts && savedPosts.length === 0 && (
                <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-10 sm:p-12 text-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#161922] border border-[#222834] text-[#8F99A8] flex items-center justify-center mx-auto">
                    <Bookmark className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      No saved posts yet
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8F99A8] max-w-sm mx-auto">
                      Bookmark posts across hardware communities and the Home feed
                      to easily find and review them later.
                    </p>
                  </div>
                  <Link
                    to="/communities"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold transition shadow-[0_0_14px_rgba(0,216,246,0.3)] active:scale-95"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Communities</span>
                  </Link>
                </div>
              )}

              {/* SAVED POSTS LIST */}
              {!isLoading &&
                !error &&
                savedPosts &&
                savedPosts.length > 0 && (
                  <div className="space-y-4">
                    {savedPosts.map((post) => (
                      <PostCard
                        key={post._id || post.id}
                        post={{ ...post, isSaved: true }}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
