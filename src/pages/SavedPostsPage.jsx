import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { Bookmark, Compass } from "lucide-react";
import { getSavedPosts } from "../data/mockData";

export default function SavedPostsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedPosts, setSavedPosts] = useState(getSavedPosts());

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
                    {savedPosts.length}
                  </span>
                </div>
              </div>

              {/* Saved Posts List */}
              <div className="space-y-4">
                {savedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}

                {savedPosts.length === 0 && (
                  <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-[#161922] border border-[#222834] text-[#8F99A8] flex items-center justify-center mx-auto">
                      <Bookmark className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        No saved posts yet
                      </h3>
                      <p className="text-xs text-[#8F99A8] mt-1 max-w-sm mx-auto">
                        Bookmark posts across communities to easily find and
                        review them later.
                      </p>
                    </div>
                    <Link
                      to="/communities"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold transition shadow-[0_0_12px_rgba(0,216,246,0.25)]"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Explore Communities</span>
                    </Link>
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
