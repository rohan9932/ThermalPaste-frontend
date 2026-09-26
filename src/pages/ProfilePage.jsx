// ProfilePage.jsx
// Displays the user's profile settings, their posts, joined communities, and recent activity feed.

import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard.jsx";
import {
  updateProfile,
} from "../services/profile.js";
import { getFeed, POST_KEYS, getUserComments } from "../services/posts.js";
import { useAuth } from "../context/AuthContext";
<<<<<<< HEAD
=======
import { getCategoryIcon } from "../data/mockData";
>>>>>>> b793ceb62bf260f17d543fff42093b304e7c9aeb
import {
  Shield,
  Save,
  RotateCcw,
  Edit3,
  Settings,
  Layers,
  MessageCircle,
} from "lucide-react";

// ─── Mock User Data ────────────────────────────────────────────────────────────
// Temporary static data representing user posts & badges.
const USER = {
  username: "LinusBuilds",
  imageLink: "/images/avatar.jpg",
  bio: "I build enterprise servers in my sleep and drop graphics cards for a living. Host of Overclocked Tech Tips.",
  userPosts: [
    {
      id: "post_7",
      community: "g/watercooling",
      subGroup: "g/watercooling",
      authorname: "LinusBuilds",
      authorAvatar: "/images/avatar.jpg",
      timestamp: "Sep 22, 4:00 PM",
      createdAt: "Sep 22, 4:00 PM",
      title: "Dual EPYC waterblock design — 3D printing custom top plates",
      content:
        "Working on a dual socket EPYC waterblock build. The stock coolers just won't cut it for server overclocking...",
      sectionHeader: "### Loop Specs...",
      image: "/images/water-cooling-custom-loop-pc-build-1.jpg",
      upvotes: 112,
      commentsCount: 28,
      comments: 28,
      isPopularRig: true,
    },
    {
      id: "post_8",
      community: "g/overclocking",
      subGroup: "g/overclocking",
      authorname: "LinusBuilds",
      authorAvatar: "/images/avatar.jpg",
      timestamp: "Sep 19, 10:30 AM",
      createdAt: "Sep 19, 10:30 AM",
      title: "Server RAM overclocking — pushing ECC DDR5 to 7200MHz CL32",
      content:
        "Decided to test the limits of ECC memory on a Threadripper platform. Results were surprising...",
      sectionHeader: "### OC Settings...",
      image: "/images/overclocking-cpu-benchmark-gaming-1.webp",
      upvotes: 87,
      commentsCount: 19,
      comments: 19,
      isPopularRig: false,
    },
    {
      id: "post_9",
      community: "g/battlestations",
      subGroup: "g/battlestations",
      authorname: "LinusBuilds",
      authorAvatar: "/images/avatar.jpg",
      timestamp: "Sep 15, 6:15 PM",
      createdAt: "Sep 15, 6:15 PM",
      title:
        "12-node render farm in a single 4U chassis — cable management nightmare",
      content:
        "Built this for a rendering studio. 12x EPYC nodes, dual 4090s each, all in one 4U box...",
      sectionHeader: "### Setup Gear...",
      image: "/images/small-form-factor-mini-itx-pc-case-build-1.webp",
      upvotes: 342,
      commentsCount: 56,
      comments: 56,
      isPopularRig: true,
    },
  ],
  recentActivity: [
    {
      type: "post",
      title: "My custom loop temps after 300 hours of runtime",
      community: "g/watercooling",
      groupId: "watercooling",
      time: "2 hours ago",
      color: "#00D8F6",
    },
    {
      type: "comment",
      title: "Re: Best AIO for AM5 in 2025",
      community: "g/pcbuilders",
      groupId: "pcbuilders",
      time: "5 hours ago",
      color: "#A78BDA",
    },
    {
      type: "like",
      title: "liked a post about RTX 5090 vs RX 9070 XT",
      community: "g/gpuhype",
      groupId: "gpuhype",
      time: "8 hours ago",
      color: "#F472B6",
    },
    {
      type: "build",
      title: "Clean Walnut & SFF Setup with Fractal Terra",
      community: "g/battlestations",
      groupId: "battlestations",
      time: "1 day ago",
      color: "#FB923C",
    },
    {
      type: "post",
      title: "5.8GHz all-core on 7950X3D — full voltage breakdown",
      community: "g/overclocking",
      groupId: "overclocking",
      time: "2 days ago",
      color: "#00D8F6",
    },
    {
      type: "comment",
      title: "Re: RTX 4070 SUPER drops to $549",
      community: "g/techdeals",
      groupId: "techdeals",
      time: "3 days ago",
      color: "#A78BDA",
    },
  ],
};

// ─── ProfilePage Component ────────────────────────────────────────────────────
export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Controls whether the sidebar is open or collapsed.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tracks active tab: posts or comments.
  const [activeTab, setActiveTab] = useState("posts");

  // Editable profile fields.
  const [bio, setBio] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch real feed to retrieve user's real posts
  const { data: feedPosts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: POST_KEYS.feed(),
    queryFn: () => getFeed(),
  });

  // Fetch user's comments
  const { data: userCommentsData = { comments: [] }, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["userComments", user?._id],
    queryFn: () => getUserComments(user?._id),
    enabled: !!user?._id,
  });

  // Use user data from AuthContext (includes profile fields: imageLink, bio, groups)
  const displayName = user?.username || USER.username;
  const avatarUrl = user?.imageLink || "/images/avatar.jpg";
  const displayBio = user?.bio || USER.bio;

  // Filter posts created by the current user
  const userRealPosts = feedPosts.filter((p) => {
    if (user?._id && p.user?._id) {
      return String(p.user._id) === String(user._id);
    }
    if (displayName && p.user?.username) {
      return p.user.username.toLowerCase() === displayName.toLowerCase();
    }
    return false;
  });

  const displayPosts = userRealPosts.length > 0 ? userRealPosts : USER.userPosts;

  const handleStartEditing = () => {
    setBio(user?.bio ?? "");
    setImageLink(user?.imageLink ?? "");
    setError("");
    setSaveSuccess(false);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setBio(user?.bio ?? "");
    setImageLink(user?.imageLink ?? "");
    setError("");
  };

  // Handles save button click — sends update request with provided values.
  const handleSubmit = async () => {
    setError("");
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      const payload = { imageLink, bio };

      await updateProfile(payload);

      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
              {/* ── Page Header ────────────────────────────────────────────── */}
              <div className="flex items-center justify-between p-5 border border-[#222834] bg-[#0F1117] rounded-2xl mb-6">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-[#00D8F6]/10 border border-[#00D8F6]/30 text-[#00D8F6] rounded-xl text-lg">
                    <Settings className="w-5 h-5" />
                  </span>
                  <div>
                    <h1 className="text-base font-bold text-white">
                      Profile Settings
                    </h1>
                    <p className="text-xs text-[#8F99A8]">
                      Customize your avatar, bio, and view your communities.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => (isEditing ? handleCancelEditing() : handleStartEditing())}
                  className="p-2 text-[#8F99A8] hover:text-white hover:bg-[#161922] rounded-lg transition-all cursor-pointer"
                  aria-label="Edit Profile"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              {/* ── Profile Preview Card ────────────────────────────────────── */}
              <div className="p-5 rounded-2xl border border-[#222834] bg-[#0F1117] flex items-center gap-5 mb-6 shadow-xl">
                <img
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#00D8F6]/40 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "/images/avatar.jpg";
                  }}
                />
                <div className="min-w-0">
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    {displayName}
                  </div>
                  <p className="text-xs text-[#8F99A8] line-clamp-2 mt-0.5">
                    {displayBio}
                  </p>
                </div>
              </div>

              {/* ── Edit Form ──────────────────────────────────────────────── */}
              {isEditing && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="p-5 rounded-2xl border border-[#222834] bg-[#0F1117] space-y-4 shadow-xl"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F99A8] border-b border-[#222834] pb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#00D8F6]" />
                    <span>General Info</span>
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#F3F4F6]">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      value={imageLink}
                      onChange={(e) => setImageLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-[#222834] text-white placeholder-[#8F99A8]/60 focus:outline-none focus:border-[#00D8F6] text-xs transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#F3F4F6]">
                      Short Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a custom bio about yourself..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161922] border border-[#222834] text-white placeholder-[#8F99A8]/60 focus:outline-none focus:border-[#00D8F6] text-xs transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <div className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                      {error}
                    </div>
                  )}
                  {saveSuccess && (
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                      Profile saved successfully!
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8F99A8] hover:bg-[#161922] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 bg-[#00D8F6] hover:bg-[#00c4e0] disabled:opacity-50 text-[#0B0D11] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,216,246,0.25)] cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ── Tab Navigation ──────────────────────────────────────────── */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0F1117] border border-[#222834] mt-8">
                {[
                  {
                    id: "posts",
                    label: "Posts",
                    icon: <Layers className="w-4 h-4" />,
                  },
                  {
                    id: "comments",
                    label: isCommentsLoading
                      ? "Comments"
                      : `Comments (${userCommentsData.comments?.length ?? 0})`,
                    icon: <MessageCircle className="w-4 h-4" />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-1 justify-center ${
                      activeTab === tab.id
                        ? "bg-[#00D8F6] text-[#0B0D11] shadow-[0_0_10px_rgba(0,216,246,0.15)]"
                        : "text-[#8F99A8] hover:text-white"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* ── Tab Content Panels ──────────────────────────────────────── */}
              <div className="mt-6 space-y-6">
                {/* ── Posts Tab ── */}
                {activeTab === "posts" && (
                  <div className="space-y-4">
                    {isPostsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((n) => (
                          <div
                            key={n}
                            className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl p-5 shadow-xl animate-pulse space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-5 rounded-md bg-[#161922]" />
                              <div className="w-3 h-3 rounded-full bg-[#161922]" />
                              <div className="w-20 h-4 rounded bg-[#161922]" />
                            </div>
                            <div className="w-3/4 h-6 rounded-lg bg-[#161922]" />
                            <div className="space-y-1.5 pt-1">
                              <div className="w-full h-4 rounded bg-[#161922]" />
                              <div className="w-5/6 h-4 rounded bg-[#161922]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : displayPosts.length === 0 ? (
                      <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-10 text-center space-y-3 shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-[#161922] border border-[#222834] text-[#8F99A8] flex items-center justify-center mx-auto">
                          <Layers className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-[#8F99A8]">
                          You haven't submitted any posts yet.
                        </p>
                      </div>
                    ) : (
                      displayPosts.map((post) => (
                        <PostCard key={post._id || post.id} post={post} />
                      ))
                    )}
                  </div>
                )}

                {/* ── Comments Tab ── */}
                {activeTab === "comments" && (
                  <div className="space-y-4">
                    {isCommentsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((n) => (
                          <div
                            key={n}
                            className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl p-5 shadow-xl animate-pulse space-y-3"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-5 rounded-md bg-[#161922]" />
                              <div className="w-3 h-3 rounded-full bg-[#161922]" />
                              <div className="w-20 h-4 rounded bg-[#161922]" />
                            </div>
                            <div className="w-3/4 h-6 rounded-lg bg-[#161922]" />
                            <div className="space-y-1.5 pt-1">
                              <div className="w-full h-4 rounded bg-[#161922]" />
                              <div className="w-5/6 h-4 rounded bg-[#161922]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : userCommentsData.comments?.length === 0 ? (
                      <div className="rounded-2xl border border-[#222834] bg-[#0F1117] p-10 text-center space-y-3 shadow-xl">
                        <div className="w-12 h-12 rounded-2xl bg-[#161922] border border-[#222834] text-[#8F99A8] flex items-center justify-center mx-auto">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-[#8F99A8]">
                          You haven't made any comments yet.
                        </p>
                      </div>
                    ) : (
<<<<<<< HEAD
                      <div className="space-y-3">
                        {userCommentsData.comments.map((comment) => (
                          <div
                            key={comment._id || comment.id}
                            className="p-5 rounded-2xl bg-[#0F1117] border border-[#222834] shadow-xl"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6] shrink-0">
                                <MessageCircle className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-xs mb-1">
                                  <span className="font-semibold text-white">{comment.user?.username || "Unknown"}</span>
                                  <span className="text-[#8F99A8]/60 font-bold">•</span>
                                  <span className="text-[#8F99A8]">
                                    {comment.createdAt
                                      ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "Recently"}
                                  </span>
=======
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {joinedGroups.map((group) => {
                          const isString = typeof group === "string";
                          const groupObj = isString ? { _id: group, name: group } : group;
                          const rawName = groupObj.name || groupObj.slug || "community";
                          const slug = rawName.replace(/^g\//, "");
                          const groupDisplay = rawName.startsWith("g/")
                            ? rawName
                            : `g/${rawName}`;
                          const GroupIcon = getCategoryIcon(
                            groupObj.category || slug,
                          );
                          const memberCount = Array.isArray(groupObj.members)
                            ? groupObj.members.length
                            : typeof groupObj.memberCount === "number"
                            ? groupObj.memberCount
                            : 1;

                          return (
                            <Link
                              key={groupObj._id || slug}
                              to={`/communities/${slug}`}
                              className="p-5 rounded-2xl bg-[#0F1117] border border-[#222834] hover:border-[#00D8F6]/40 transition-all duration-200 group flex flex-col justify-between space-y-4 shadow-xl cursor-pointer"
                            >
                              <div className="flex items-start gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6] shrink-0 group-hover:scale-105 transition-transform">
                                  <GroupIcon className="w-6 h-6" />
>>>>>>> b793ceb62bf260f17d543fff42093b304e7c9aeb
                                </div>
                                <p className="text-sm text-[#C4C9D4] leading-relaxed whitespace-pre-line">
                                  {comment.comment || ""}
                                </p>
                                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#222834]/50">
                                  {comment.post && (
                                    <Link
                                      to={`/post/${comment.post._id || comment.post}`}
                                      className="text-xs text-[#00D8F6] hover:underline font-medium flex items-center gap-1"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      View Post
                                    </Link>
                                  )}
                                  <div className="flex items-center gap-1.5 ml-auto">
                                    <span className="text-xs text-[#8F99A8]">
                                      {comment.score ?? 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
