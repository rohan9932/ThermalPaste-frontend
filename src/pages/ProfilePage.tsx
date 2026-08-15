"use client";

import React, { useState } from "react";
import {
  Cpu,
  Gpu,
  MemoryStick,
  CircuitBoard,
  Fan,
  Monitor,
  HardDrive,
  Zap,
  MessageCircle,
  Heart,
  Star,
  Share2,
  UserPlus,
  MoreHorizontal,
  Edit3,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Shield,
  ChevronRight,
  Activity,
  TrendingUp,
  Award,
  Layers,
  Box,
  Settings,
} from "lucide-react";

/* ───────────────────────────────────────────────────
   COLOR THEME (matches LoginPage.tsx)
   ─────────────────────────────────────────────────── */
const C = {
  bg: "#0B0D11",
  card: "#0F1117",
  cardHover: "#131620",
  input: "#161922",
  border: "#222834",
  accent: "#00D8F6",
  accentDim: "#00b8d0",
  accentGlow: "rgba(0,216,246,0.15)",
  accentGlowStrong: "rgba(0,216,246,0.35)",
  secondary: "#8F99A8",
  muted: "#5A6373",
  white: "#FFFFFF",
  text: "#C8CDD6",
  darkText: "#6B7280",
  success: "#34D399",
  danger: "#F87171",
  purple: "#A78BFA",
  orange: "#FB923C",
  pink: "#F472B6",
} as const;

/* ───────────────────────────────────────────────────
   MOCK USER DATA
   ─────────────────────────────────────────────────── */
interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  location: string;
  joinedAt: string;
  website: string;
  role: "Member" | "Moderator" | "Admin" | "Verified Builder";
  reputation: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalShares: number;
  isFollowing: boolean;
  isOnline: boolean;
  rigs: string[];
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    motherboard: string;
    cooler: string;
    caseName: string;
    powerSupply: string;
    storageSpecs: string;
  };
  badges: { icon: string; label: string; color: string }[];
  recentActivity: {
    type: "post" | "comment" | "like" | "build";
    title: string;
    community: string;
    time: string;
  }[];
  topCommunities: {
    name: string;
    icon: string;
    role: string;
    members: number;
  }[];
}

const MOCK_USER: UserProfile = {
  id: "usr_83kf2",
  username: "thermalwarrior",
  displayName: "Alex "ThermalWarrior" Chen",
  bio: "PC enthusiast & benchmark nerd. I build high-end rigs and push them to the limit. Custom loops, overclocks, and liquid metal everywhere. Current target: sub-60°C on all-core stress tests.",
  avatarUrl: "",
  coverUrl: "",
  location: "San Francisco, CA",
  joinedAt: "March 2024",
  website: "https://thermalwarrior.dev",
  role: "Verified Builder",
  reputation: 4872,
  totalPosts: 312,
  totalComments: 1847,
  totalLikes: 5620,
  totalShares: 892,
  isFollowing: false,
  isOnline: true,
  rigs: ["Main Build — AM5 RTX 4090", "SFF LAN Rig — Mini ITX", "Server Rack — Homelab"],
  specs: {
    cpu: "AMD Ryzen 9 7950X3D",
    gpu: "NVIDIA RTX 4090 Founders Edition",
    ram: "64GB DDR5-6000 CL30 (G.Skill Trident Z5)",
    motherboard: "ASUS ROG Crosshair X670E Hero",
    cooler: "EK Quantum Velocity² 360mm Custom Loop",
    caseName: "Lian Li O11 Dynamic EVO",
    powerSupply: "Corsair HX1500i 1500W 80+ Platinum",
    storageSpecs: "2TB Samsung 990 Pro + 4TB WD Black SN850X",
  },
  badges: [
    { icon: "🔥", label: "Firestarter", color: "#FB923C" },
    { icon: "🧊", label: "Ice Cold", color: "#00D8F6" },
    { icon: "⚡", label: "Power User", color: "#A78BFA" },
    { icon: "🏆", label: "Top Builder", color: "#F59E0B" },
    { icon: "💎", label: "Diamond Tier", color: "#E5E7EB" },
  ],
  recentActivity: [
    { type: "post", title: "My custom loop temps after 300 hours of runtime", community: "r/CustomLoops", time: "2 hours ago" },
    { type: "comment", title: "Re: Best AIO for AM5 in 2025", community: "r/CoolingDiscussion", time: "5 hours ago" },
    { type: "like", title: "liked a post about the new X870E boards", community: "r/HardwareNews", time: "8 hours ago" },
    { type: "build", title: "Updated build: SFF ITX with RTX 4090", community: "r/SmallFormFactor", time: "1 day ago" },
    { type: "post", title: "Thermal paste comparison: Kryonaut vs NT-H1", community: "r/ThermalPaste", time: "2 days ago" },
    { type: "comment", title: "Re: Is 1500W PSU overkill?", community: "r/PSUAdvice", time: "3 days ago" },
  ],
  topCommunities: [
    { name: "r/ThermalPaste", icon: "🌡️", role: "Moderator", members: 245000 },
    { name: "r/CustomLoops", icon: "💧", role: "Member", members: 189000 },
    { name: "r/Overclocking", icon: "⚡", role: "Member", members: 312000 },
    { name: "r/HardwareNews", icon: "📰", role: "Contributor", members: 567000 },
    { name: "r/SmallFormFactor", icon: "📦", role: "Member", members: 98000 },
  ],
};

/* ───────────────────────────────────────────────────
   HELPER COMPONENTS
   ─────────────────────────────────────────────────── */

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 p-4 rounded-xl bg-[#161922] border border-[#222834] hover:border-[#00D8F6]/20 transition-all duration-300 cursor-default group">
      <div className="text-[color:var(--c)] group-hover:scale-110 transition-transform" style={{ ["--c" as any]: color }}>
        {icon}
      </div>
      <span className="text-xl font-bold text-white">{typeof value === "number" ? value.toLocaleString() : value}</span>
      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8F99A8]">{label}</span>
    </div>
  );
}

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-[#161922] border border-[#222834] hover:border-[#00D8F6]/15 transition-all duration-300 group">
      <div className="mt-0.5 text-[#00D8F6] opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F99A8] block mb-0.5">{label}</span>
        <span className="text-sm font-medium text-white leading-tight block">{value}</span>
      </div>
    </div>
  );
}

function ActivityItem({ item }: { item: UserProfile["recentActivity"][0] }) {
  const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    post: { icon: <MessageCircle className="w-3.5 h-3.5" />, color: "#00D8F6", label: "Post" },
    comment: { icon: <MessageCircle className="w-3.5 h-3.5" />, color: "#A78BFA", label: "Comment" },
    like: { icon: <Heart className="w-3.5 h-3.5" />, color: "#F472B6", label: "Like" },
    build: { icon: <Cpu className="w-3.5 h-3.5" />, color: "#FB923C", label: "Build" },
  };
  const config = typeConfig[item.type] || typeConfig.post;

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#161922] transition-all duration-200 group cursor-pointer">
      <div
        className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${config.color}15`, color: config.color }}
      >
        {config.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[#C8CDD6] leading-snug group-hover:text-white transition-colors">
          <span className="font-semibold">{item.title}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-[#8F99A8]">{item.community}</span>
          <span className="text-[11px] text-[#5A6373]">·</span>
          <span className="text-[11px] text-[#5A6373]">{item.time}</span>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wider font-bold mt-1" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
}

/* ───────────────────────────────────────────────────
   MAIN PROFILE PAGE
   ─────────────────────────────────────────────────── */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "activity">("overview");
  const user = MOCK_USER;

  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{
        backgroundColor: C.bg,
        "--accent": C.accent,
        "--accent-dim": C.accentDim,
        "--border": C.border,
        "--card": C.card,
        "--secondary": C.secondary,
      } as React.CSSProperties}
    >
      {/* ═══ COVER / HERO ═══ */}
      <div className="relative">
        {/* Cover gradient */}
        <div
          className="h-52 sm:h-64 w-full relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${C.bg} 0%, #0D1520 40%, #0F2029 70%, ${C.bg} 100%)`,
          }}
        >
          {/* Decorative glow orbs */}
          <div
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: C.accent }}
          />
          <div
            className="absolute bottom-0 left-1/6 w-64 h-64 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: C.purple }}
          />
          {/* Geometric lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00D8F6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Profile info overlapping cover */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-32 h-32 rounded-2xl border-4 overflow-hidden shadow-2xl"
                style={{ borderColor: C.card, backgroundColor: C.input }}
              >
                <img
                  src={
                    user.avatarUrl ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80"
                  }
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80";
                  }}
                />
              </div>
              {/* Online indicator */}
              {user.isOnline && (
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-[3px] flex items-center justify-center"
                  style={{ backgroundColor: "#10B981", borderColor: C.bg }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
              {/* Role badge */}
              <div
                className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: C.accent + "20",
                  color: C.accent,
                  borderColor: C.accent + "40",
                }}
              >
                {user.role}
              </div>
            </div>

            {/* Name & meta */}
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {user.displayName}
                </h1>
              </div>
              <p className="text-sm text-[#8F99A8] mt-0.5">
                @{user.username}
              </p>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[#8F99A8]">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {user.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Joined {user.joinedAt}
                </span>
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-[#00D8F6] transition-colors">
                    <LinkIcon className="w-3.5 h-3.5" /> {user.website.replace("https://", "")}
                  </a>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pb-2">
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: user.isFollowing ? "#222834" : C.accent,
                  color: user.isFollowing ? "#C8CDD6" : C.bg,
                  boxShadow: user.isFollowing ? "none" : `0 0 15px ${C.accentGlow}`,
                }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                {user.isFollowing ? "Following" : "Follow"}
              </button>
              <button className="p-2.5 rounded-xl bg-[#161922] border border-[#222834] text-[#8F99A8] hover:text-white hover:border-[#00D8F6]/30 transition-all cursor-pointer">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-xl bg-[#161922] border border-[#222834] text-[#8F99A8] hover:text-white hover:border-[#00D8F6]/30 transition-all cursor-pointer">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── LEFT COLUMN: Sidebar ─── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Bio */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: C.card, borderColor: C.border }}>
              <p className="text-sm text-[#C8CDD6] leading-relaxed italic">
                "{user.bio}"
              </p>
            </div>

            {/* Stats */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: C.card, borderColor: C.border }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F99A8] mb-4 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#00D8F6]" />
                Stats
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <StatCard icon={<Star className="w-4 h-4" />} label="Reputation" value={user.reputation} color="#F59E0B" />
                <StatCard icon={<MessageCircle className="w-4 h-4" />} label="Posts" value={user.totalPosts} color="#00D8F6" />
                <StatCard icon={<Activity className="w-4 h-4" />} label="Comments" value={user.totalComments} color="#A78BFA" />
                <StatCard icon={<Heart className="w-4 h-4" />} label="Likes" value={user.totalLikes} color="#F472B6" />
              </div>
            </div>

            {/* Badges */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: C.card, borderColor: C.border }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F99A8] mb-4 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#00D8F6]" />
                Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 cursor-default hover:scale-105"
                    style={{
                      backgroundColor: b.color + "12",
                      borderColor: b.color + "30",
                      color: b.color,
                    }}
                  >
                    <span>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Top Communities */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: C.card, borderColor: C.border }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F99A8] mb-4 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00D8F6]" />
                Top Communities
              </h3>
              <div className="space-y-2">
                {user.topCommunities.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#161922] transition-all cursor-pointer group"
                  >
                    <span className="text-xl flex-shrink-0">{c.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white group-hover:text-[#00D8F6] transition-colors truncate">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-[#5A6373]">{(c.members / 1000).toFixed(0)}k members</p>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: c.role === "Moderator" ? "#A78BFA20" : "#8F99A815",
                        color: c.role === "Moderator" ? "#A78BFA" : "#8F99A8",
                      }}
                    >
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Rigs */}
            <div className="rounded-2xl p-5 border" style={{ backgroundColor: C.card, borderColor: C.border }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8F99A8] mb-4 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#00D8F6]" />
                Your Rigs
              </h3>
              <div className="space-y-2">
                {user.rigs.map((rig, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer group hover:border-[#00D8F6]/20 transition-all"
                    style={{ backgroundColor: C.input, borderColor: C.border }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: C.accent + "15" }}
                    >
                      <Cpu className="w-4 h-4" style={{ color: C.accent }} />
                    </div>
                    <span className="text-sm text-[#C8CDD6] group-hover:text-white transition-colors">{rig}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#5A6373] ml-auto flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Main Content ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tab navigation */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
              {[
                { id: "overview" as const, label: "Overview", icon: <Layers className="w-4 h-4" /> },
                { id: "specs" as const, label: "PC Build Specs", icon: <Cpu className="w-4 h-4" /> },
                { id: "activity" as const, label: "Recent Activity", icon: <Activity className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-1 justify-center"
                  style={{
                    backgroundColor: activeTab === tab.id ? C.accent : "transparent",
                    color: activeTab === tab.id ? C.bg : C.secondary,
                    boxShadow: activeTab === tab.id ? `0 0 15px ${C.accentGlow}` : "none",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ─── OVERVIEW TAB ─── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Posts", value: user.totalPosts, icon: <MessageCircle className="w-5 h-5" />, color: C.accent },
                    { label: "Comments", value: user.totalComments, icon: <Activity className="w-5 h-5" />, color: C.purple },
                    { label: "Likes", value: user.totalLikes, icon: <Heart className="w-5 h-5" />, color: C.pink },
                    { label: "Reputation", value: user.reputation, icon: <Star className="w-5 h-5" />, color: "#F59E0B" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-5 border hover:border-[#00D8F6]/15 transition-all duration-300 group"
                      style={{ backgroundColor: C.card, borderColor: C.border }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: s.color + "15", color: s.color }}
                        >
                          {s.icon}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-white">{s.value.toLocaleString()}</p>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[#8F99A8] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity Preview */}
                <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
                  <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: C.border }}>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00D8F6]" />
                      Recent Activity
                    </h3>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className="text-xs text-[#00D8F6] hover:underline font-semibold transition-all cursor-pointer"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="divide-y" style={{ borderColor: C.border }}>
                    {user.recentActivity.slice(0, 4).map((item, i) => (
                      <ActivityItem key={i} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── SPECS TAB ─── */}
            {activeTab === "specs" && (
              <div className="space-y-6">
                <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
                  <div className="p-5 border-b" style={{ borderColor: C.border }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[#00D8F6]" />
                          PC Build Configuration
                        </h3>
                        <p className="text-xs text-[#8F99A8] mt-1">Primary build — {user.rigs[0]}</p>
                      </div>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer" style={{ backgroundColor: C.input, color: C.secondary, border: `1px solid ${C.border}` }}>
                        <Settings className="w-3.5 h-3.5" />
                        Edit Specs
                      </button>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SpecRow icon={<Cpu className="w-4 h-4" />} label="CPU" value={user.specs.cpu} />
                    <SpecRow icon={<Gpu className="w-4 h-4" />} label="GPU" value={user.specs.gpu} />
                    <SpecRow icon={<MemoryStick className="w-4 h-4" />} label="RAM" value={user.specs.ram} />
                    <SpecRow icon={<CircuitBoard className="w-4 h-4" />} label="Motherboard" value={user.specs.motherboard} />
                    <SpecRow icon={<Fan className="w-4 h-4" />} label="AIO / Custom Cooler" value={user.specs.cooler} />
                    <SpecRow icon={<Monitor className="w-4 h-4" />} label="Case" value={user.specs.caseName} />
                    <SpecRow icon={<Zap className="w-4 h-4" />} label="Power Supply" value={user.specs.powerSupply} />
                    <SpecRow icon={<HardDrive className="w-4 h-4" />} label="Storage" value={user.specs.storageSpecs} />
                  </div>
                </div>

                {/* Spec score summary */}
                <div className="rounded-2xl border p-5" style={{ backgroundColor: C.card, borderColor: C.border }}>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#00D8F6]" />
                    Performance Profile
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Gaming", score: 98, color: C.accent },
                      { label: "Productivity", score: 92, color: C.purple },
                      { label: "Thermal", score: 87, color: C.success },
                      { label: "Overall", score: 95, color: C.orange },
                    ].map((p, i) => (
                      <div key={i} className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                            <circle cx="40" cy="40" r="34" fill="none" stroke={C.border} strokeWidth="6" />
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              fill="none"
                              stroke={p.color}
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={`${(p.score / 100) * 213.6} 213.6`}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                            {p.score}
                          </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: p.color }}>
                          {p.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── ACTIVITY TAB ─── */}
            {activeTab === "activity" && (
              <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
                <div className="p-5 border-b" style={{ borderColor: C.border }}>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00D8F6]" />
                    All Recent Activity
                  </h3>
                </div>
                <div className="divide-y" style={{ borderColor: C.border }}>
                  {user.recentActivity.map((item, i) => (
                    <ActivityItem key={i} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}