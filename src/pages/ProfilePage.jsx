// ProfilePage.jsx
// Displays the user's profile settings, their posts, and recent activity feed.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard.jsx";
import {
  getProfile,
  updateProfile,
  createProfile,
} from "../services/profile.js";
import {
  Cpu,
  Shield,
  Save,
  RotateCcw,
  Edit3,
  Settings,
  Layers,
  MessageCircle,
  Heart,
  Activity,
} from "lucide-react";

// ─── Mock User Data ────────────────────────────────────────────────────────────
// Temporary static data representing the logged-in user.
// In production, this would be fetched from the backend API (e.g. GET /api/user/me).
const USER = {
  username: "LinusBuilds",
  imageLink: "/images/avatar.jpg",
  bio: "I build enterprise servers in my sleep and drop graphics cards for a living. Host of Overclocked Tech Tips.",
  badges: [
    {
      icon: "/images/thermal-paste-thermal-paste-cooling-hard-1.webp",
      label: "Firestarter",
      color: "#FB923C",
    },
    {
      icon: "/images/water-cooling-custom-loop-pc-build-1.jpg",
      label: "Ice Cold",
      color: "#00D8F6",
    },
    {
      icon: "/images/overclocking-cpu-benchmark-gaming-1.webp",
      label: "Power User",
      color: "#A78BDA",
    },
    {
      icon: "/images/gpu-graphics-card-rtx-nvidia-1.webp",
      label: "Top Builder",
      color: "#F59E0B",
    },
    {
      icon: "/images/small-form-factor-mini-itx-pc-case-build-1.webp",
      label: "Diamond Tier",
      color: "#E5E7EB",
    },
  ],
  stats: {
    reputation: 4872,
    posts: 312,
    comments: 1847,
    likes: 5620,
  },
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
      title: "12-node render farm in a single 4U chassis — cable management nightmare",
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
  // Controls whether the sidebar is open or collapsed.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tracks which tab is currently active: posts or activity.
  const [activeTab, setActiveTab] = useState("posts");

  // Editable profile fields — populated from backend on mount.
  const [bio, setBio] = useState("");
  const [imageLink, setImageLink] = useState("");

  // Holds the last-saved profile (used to revert on Cancel).
  const [existingProfile, setExistingProfile] = useState(null);

  // Username from profile's nested user object
  const [profileUsername, setProfileUsername] = useState("");

  // Tracks whether the form is currently in a saving state (API call in progress).
  const [isSaving, setIsSaving] = useState(false);

  // Stores any API error or success message.
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Toggles whether the form fields are editable or read-only.
  const [isEditing, setIsEditing] = useState(false);

  // Pushes a saved (or empty) profile into the form fields.
  const applyProfile = (profile) => {
    setBio(profile?.bio ?? "");
    setImageLink(profile?.imageLink ?? "");
  };

  // On mount, load the user's saved profile from backend.
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getProfile();
        const profile = res?.data?.data?.profile || res?.data?.profile || res?.data || res;
        if (profile) {
          setExistingProfile(profile);
          applyProfile(profile);
          if (profile.user?.username) {
            setProfileUsername(profile.user.username);
          }
        }
      } catch (err) {
        console.error("Profile load error:", err);
      }
    }
    loadProfile();
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  // Handles save button click — sends an update request with the provided values.
  const handleSubmit = async () => {
    setError("");
    setSaveSuccess(false);
    setIsSaving(true);
    try {
      const payload = {
        imageLink,
        bio,
      };

      if (existingProfile) {
        await updateProfile(payload);
      } else {
        await createProfile(payload);
      }

      setSaveSuccess(true);

      const savedProfile = {
        bio,
        imageLink,
      };
      setExistingProfile(savedProfile);
      applyProfile(savedProfile);

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err) {
      setError(err.data?.message || err.message || "Failed to save profile.");
      setIsSaving(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      {/* Shared top navigation bar — receives sidebar toggle state */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1 relative">
        {/* Collapsible sidebar — shifts main content right on desktop (md:ml-64) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main
          className={`flex-1 p-4 sm:p-6 w-full transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
        >
          <div className="space-y-6">
            <div className="mx-auto max-w-4xl space-y-6">
              {/* ── Page Header ──────────────────────────────────────────────────
                Shows the page title and an edit pencil icon.
                Clicking the pencil toggles isEditing to enable the form inputs. */}
              <div className="flex items-center justify-between p-5 border border-[#222834] bg-[#0F1117] rounded-2xl mb-6">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-[#A78BDA]/20 border border-[#A78BDA]/40 text-[#A78BDA] rounded-lg text-lg">
                    <Settings className="w-5 h-5" />
                  </span>
                  <div>
                    <h1 className="text-base font-bold text-white">
                      Profile Settings
                    </h1>
                    <p className="text-xs text-[#8F99A8]">
                      Customize your avatar and bio.
                    </p>
                  </div>
                </div>
                {/* Pencil icon — toggles edit mode on/off */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-[#8F99A8] hover:text-white hover:bg-[#161922] rounded-lg transition-all cursor-pointer"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              {/* ── Profile Preview Card ──────────────────────────────────────────
                Live preview of how the user's profile appears to other users.
                Shows avatar and username. */}
              <div className="p-5 rounded-2xl border border-[#222834] bg-[#0F1117] flex items-center gap-5 mb-6">
                {/* Avatar image — falls back to default if the URL fails to load */}
                <img
                  src={imageLink || "/images/avatar.jpg"}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#A78BDA]/30 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = "/images/avatar.jpg";
                  }}
                />
                <div className="min-w-0">
                  {/* Username */}
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {profileUsername || USER.username}
                  </div>
                  {/* Bio preview — shows empty when no bio */}
                  <p className="text-xs text-[#8F99A8] line-clamp-1 mt-0.5">
                    {bio || ""}
                  </p>
                </div>
              </div>

              {/* ── Edit Form ──────────────────────────────────────────
                Avatar URL and short bio textarea.
                Only rendered when isEditing = true; hidden in view mode. */}
              {isEditing && (
                <form className="grid grid-cols-1 gap-5">
                  {/* General Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8F99A8] border-b border-[#222834] pb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#A78BDA]" />
                      General Info
                    </h4>

                    {/* Avatar URL input */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#F3F4F6]">
                        Avatar URL
                      </label>
                      <input
                        type="url"
                        value={imageLink}
                        onChange={(e) => setImageLink(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-2 rounded-xl bg-[#161922] border border-[#222834] text-white placeholder-[#4B5563] focus:outline-none focus:border-[#00D8F6] text-xs transition-all"
                      />
                    </div>

                    {/* Short Bio textarea */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[#F3F4F6]">
                        Short Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write a custom bio about yourself..."
                        rows={4}
                        className="w-full px-3 py-2 rounded-xl bg-[#161922] border border-[#222834] text-white placeholder-[#4B5563] focus:outline-none focus:border-[#00D8F6] text-xs transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* ── Footer Actions ────────────────────────────────────────────────
                    Cancel resets all fields to the last-saved profile.
                    Save triggers handleSubmit. */}
                  <div className="flex flex-col gap-3">
                    {error && (
                      <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                        {error}
                      </div>
                    )}
                    {saveSuccess && (
                      <div className="px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                        Profile saved successfully! Refreshing...
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-3">
                      {/* Cancel — reverts form to the last-saved profile and exits edit mode */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          applyProfile(existingProfile);
                          setError("");
                          setSaveSuccess(false);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#8F99A8] hover:bg-[#161922] hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      {/* Save — calls handleSubmit directly via onClick */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-[#00D8F6] hover:bg-[#00c4e0] disabled:opacity-50 text-[#0B0D11] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,216,246,0.25)] cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Configuration"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* ── Tab Navigation ────────────────────────────────────────────────
                Two tabs: Posts and Recent Activity. */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0F1117] border border-[#222834] mt-8">
                {[
                  {
                    id: "posts",
                    label: "Posts",
                    icon: <Layers className="w-4 h-4" />,
                  },
                  {
                    id: "activity",
                    label: "Recent Activity",
                    icon: <Activity className="w-4 h-4" />,
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
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Tab Content Panels ────────────────────────────────────────────
                Only the active tab panel renders. */}
              <div className="mt-6 space-y-6">
                {/* ── Posts Tab — user's submitted posts ── */}
                {activeTab === "posts" && (
                  <div className="space-y-4 animate-fade-in">
                    {USER.userPosts.length === 0 ? (
                      <div className="text-center py-12 text-[#8F99A8]">
                        You haven't submitted any posts yet.
                      </div>
                    ) : (
                      USER.userPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))
                    )}
                  </div>
                )}

                {/* ── Activity Tab — full list of all recent activity items ── */}
                {activeTab === "activity" && (
                  <div className="rounded-2xl border border-[#222834] bg-[#0F1117] overflow-hidden animate-fade-in">
                    <div className="p-5 border-b border-[#222834]">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#00D8F6]" />
                        All Recent Activity
                      </h3>
                    </div>
                    <div className="divide-y divide-[#222834]">
                      {USER.recentActivity.map((item, i) => (
                        <ActivityItem key={i} item={item} />
                      ))}
                    </div>
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

// ─── ActivityItem Sub-Component ───────────────────────────────────────────────
// Renders a single row in the activity feed.
function ActivityItem({ item }) {
  const TYPE_ICONS = {
    post: <MessageCircle className="w-3.5 h-3.5" />,
    comment: <MessageCircle className="w-3.5 h-3.5" />,
    like: <Heart className="w-3.5 h-3.5" />,
    build: <Cpu className="w-3.5 h-3.5" />,
  };

  const targetGroup =
    item.groupId ||
    item.community.replace(/^g\//, "").replace(/^r\//, "").toLowerCase();

  return (
    <div className="flex items-start gap-3 p-3.5 hover:bg-[#161922] transition-all duration-200 group">
      <div
        className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: item.color + "15", color: item.color }}
      >
        {TYPE_ICONS[item.type] || TYPE_ICONS.post}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-white leading-snug">
          <span className="font-semibold">{item.title}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Link
            to={`/communities/${targetGroup}`}
            className="text-[11px] font-medium text-[#00D8F6] hover:underline transition-colors cursor-pointer"
          >
            {item.community}
          </Link>
          <span className="text-[11px] text-[#4B5563]">·</span>
          <span className="text-[11px] text-[#8F99A8]">{item.time}</span>
        </div>
      </div>

      <span
        className="text-[10px] uppercase tracking-wider font-bold mt-1 px-2 py-0.5 rounded-md bg-[#161922] border border-[#222834]"
        style={{ color: item.color }}
      >
        {item.type}
      </span>
    </div>
  );
}
