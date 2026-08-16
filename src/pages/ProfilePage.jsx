// ProfilePage.jsx
// Displays the user's profile settings, PC build specs, activity stats, and recent activity feed.

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  Cpu,
  MemoryStick,
  CircuitBoard,
  Fan,
  Monitor,
  HardDrive,
  Zap,
  Shield,
  Save,
  RotateCcw,
  Edit3,
  Settings,
  Layers,
  MessageCircle,
  Heart,
  Star,
  Activity,
  TrendingUp,
} from "lucide-react";

// ─── Mock User Data ────────────────────────────────────────────────────────────
// Temporary static data representing the logged-in user.
// In production, this would be fetched from the backend API (e.g. GET /api/user/me).
const USER = {
  username: "LinusBuilds",
  avatarUrl: "/images/avatar.jpg",
  bio: "I build enterprise servers in my sleep and drop graphics cards for a living. Host of Overclocked Tech Tips.",
  specs: {
    cpu: "AMD Ryzen 9 7950X3D",
    gpu: "NVIDIA RTX 4090 Founders Edition",
    ram: "128GB G.Skill Trident Z5 DDR5-6400",
    motherboard: "ASUS ROG Crosshair X670E Hero",
    cooler: "EK-Quantum Custom Loop 360mm",
    caseName: "Lian Li O11 Dynamic EVO",
    powerSupply: "Seasonic Vertex PX-1600 80+ Platinum",
    storageSpecs: "2x 4TB Samsung 990 Pro NVMe",
  },
  badges: [
    { icon: "/images/thermal-paste-thermal-paste-cooling-hard-1.webp", label: "Firestarter", color: "#FB923C" },
    { icon: "/images/water-cooling-custom-loop-pc-build-1.jpg", label: "Ice Cold", color: "#00D8F6" },
    { icon: "/images/overclocking-cpu-benchmark-gaming-1.webp", label: "Power User", color: "#A78BFA" },
    { icon: "/images/gpu-graphics-card-rtx-nvidia-1.webp", label: "Top Builder", color: "#F59E0B" },
    { icon: "/images/small-form-factor-mini-itx-pc-case-build-1.webp", label: "Diamond Tier", color: "#E5E7EB" },
  ],
  stats: {
    reputation: 4872,
    posts: 312,
    comments: 1847,
    likes: 5620,
  },
  recentActivity: [
    { type: "post", title: "My custom loop temps after 300 hours of runtime", community: "r/CustomLoops", time: "2 hours ago", color: "#00D8F6" },
    { type: "comment", title: "Re: Best AIO for AM5 in 2025", community: "r/CoolingDiscussion", time: "5 hours ago", color: "#A78BFA" },
    { type: "like", title: "liked a post about the new X870E boards", community: "r/HardwareNews", time: "8 hours ago", color: "#F472B6" },
    { type: "build", title: "Updated build: SFF ITX with RTX 4090", community: "r/SmallFormFactor", time: "1 day ago", color: "#FB923C" },
    { type: "post", title: "Thermal paste comparison: Kryonaut vs NT-H1", community: "r/ThermalPaste", time: "2 days ago", color: "#00D8F6" },
    { type: "comment", title: "Re: Is 1500W PSU overkill?", community: "r/PSUAdvice", time: "3 days ago", color: "#A78BFA" },
  ],
};

// ─── Spec Icon Map ─────────────────────────────────────────────────────────────
// Maps each spec key to its corresponding Lucide SVG icon.
// Used in the Specs tab to render the correct icon beside each hardware field.
const SPEC_ICONS = {
  cpu: <Cpu className="w-4 h-4" />,
  gpu: <Monitor className="w-4 h-4" />,
  ram: <MemoryStick className="w-4 h-4" />,
  motherboard: <CircuitBoard className="w-4 h-4" />,
  cooler: <Fan className="w-4 h-4" />,
  caseName: <Monitor className="w-4 h-4" />,
  powerSupply: <Zap className="w-4 h-4" />,
  storageSpecs: <HardDrive className="w-4 h-4" />,
};

// Maps spec keys to human-readable labels shown in form fields and spec cards.
const SPEC_LABELS = {
  cpu: "CPU",
  gpu: "GPU",
  ram: "RAM",
  motherboard: "Motherboard",
  cooler: "AIO / Custom Cooler",
  caseName: "PC Case",
  powerSupply: "Power Supply",
  storageSpecs: "Storage Specs",
};

// Placeholder text displayed inside each spec input when the field is empty.
const SPEC_PLACEHOLDERS = {
  cpu: "Ryzen 9 7950X3D",
  gpu: "RTX 4090",
  ram: "32GB DDR5-6000",
  motherboard: "B650E-I Gaming ITX",
  cooler: "NZXT Kraken 360",
  caseName: "Fractal Design North",
  powerSupply: "Corsair SF750 750W",
  storageSpecs: "2TB Samsung 990 Pro",
};

// ─── ProfilePage Component ────────────────────────────────────────────────────
export default function ProfilePage() {
  // Controls whether the sidebar is open or collapsed.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tracks which tab is currently active: overview, specs, or activity.
  const [activeTab, setActiveTab] = useState("overview");

  // Editable profile fields — initialized from mock USER data.
  // These will be replaced by API-driven state once a backend is integrated.
  const [bio, setBio] = useState(USER.bio);
  const [avatarUrl, setAvatarUrl] = useState(USER.avatarUrl);
  const [specs, setSpecs] = useState(USER.specs);

  // Tracks whether the form is currently in a saving state (API call in progress).
  const [isSaving, setIsSaving] = useState(false);

  // Stores any API error message. Setter is kept for future backend error handling.
  const [, setError] = useState("");

  // Toggles whether the form fields are editable or read-only.
  const [isEditing, setIsEditing] = useState(false);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  // Updates a single spec field by key without overwriting the rest of the specs object.
  const handleSpecChange = (key, value) => {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  };

  // Handles form submission — simulates an API save with a 1.5s delay.
  // e.preventDefault() stops the browser from reloading the page on form submit.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call, e.g. PATCH /api/user/profile
      await new Promise((r) => setTimeout(r, 1500));
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-tp-bg text-white flex flex-col font-sans">

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
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6">

            {/* ── Page Header ──────────────────────────────────────────────────
                Shows the page title and an edit pencil icon.
                Clicking the pencil toggles isEditing to enable the form inputs. */}
            <div className="flex items-center justify-between p-5 border border-tp-border bg-tp-card rounded-2xl mb-6">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-tp-purple/20 border border-tp-purple/40 text-tp-purple rounded-lg text-lg">
                  <Settings className="w-5 h-5" />
                </span>
                <div>
                  <h1 className="text-base font-bold text-white">
                    Configure PC Rig & Profile flairs
                  </h1>
                  <p className="text-xs text-tp-secondary">
                    Your specifications will appear as user flair on everything you share.
                  </p>
                </div>
              </div>
              {/* Pencil icon — toggles edit mode on/off */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-tp-secondary hover:text-white hover:bg-tp-input rounded-lg transition-all cursor-pointer"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            {/* ── Profile Preview Card ──────────────────────────────────────────
                Live preview of how the user's profile appears to other users.
                Shows avatar, username, bio excerpt, and inline CPU/GPU flair. */}
            <div className="p-5 rounded-2xl border border-tp-border bg-gradient-to-r from-tp-card to-tp-bg flex items-center gap-5 mb-6">
              {/* Avatar image — falls back to default if the URL fails to load */}
              <img
                src={avatarUrl || "/images/avatar.jpg"}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-tp-purple/30 flex-shrink-0"
                onError={(e) => {
                  e.target.src = "/images/avatar.jpg";
                }}
              />
              <div className="min-w-0">
                {/* Username + verified badge */}
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  {USER.username}
                  <span className="text-[10px] bg-tp-purple/20 text-tp-purple px-2 py-0.5 rounded-full border border-tp-purple/40">
                    Verified Rig
                  </span>
                </div>
                {/* Bio preview — truncated to one line */}
                <p className="text-xs text-tp-secondary line-clamp-1 italic mt-0.5">
                  "{bio || "No bio written yet."}"
                </p>
                {/* Inline CPU and GPU flair shown beneath the bio */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] font-mono text-tp-accent">
                  {specs.cpu && <span>CPU: {specs.cpu}</span>}
                  {specs.gpu && <span>GPU: {specs.gpu}</span>}
                </div>
              </div>
            </div>

            {/* ── Two-Column Edit Form ──────────────────────────────────────────
                Left column : avatar URL and short bio textarea.
                Right column: 8 PC hardware spec inputs.
                All inputs are disabled by default; enabled only when isEditing = true. */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Left Column — General Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-tp-secondary border-b border-tp-border pb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-tp-purple" />
                  General Info
                </h4>

                {/* Avatar URL input */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-tp-text">Avatar URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-xl bg-tp-input border border-tp-border text-white placeholder-tp-muted focus:outline-none focus:border-tp-accent text-xs transition-all"
                    disabled={!isEditing}
                  />
                </div>

                {/* Short Bio textarea */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-tp-text">Short Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a custom bio about your hardware hobby..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl bg-tp-input border border-tp-border text-white placeholder-tp-muted focus:outline-none focus:border-tp-accent text-xs transition-all resize-none"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Right Column — PC Build Specs
                  Dynamically rendered from SPEC_LABELS to avoid repetitive JSX. */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-tp-secondary border-b border-tp-border pb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-tp-accent" />
                  PC Build Specs
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(SPEC_LABELS).map(([key, label]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-medium text-tp-text">{label}</label>
                      <input
                        type="text"
                        value={specs[key] || ""}
                        onChange={(e) =>
                          handleSpecChange(key, e.target.value)
                        }
                        placeholder={SPEC_PLACEHOLDERS[key] || label}
                        className="w-full px-3 py-1.5 rounded-lg bg-tp-input border border-tp-border text-white placeholder-tp-muted/60 focus:outline-none focus:border-tp-accent text-xs font-mono transition-all"
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>

            {/* ── Footer Actions ────────────────────────────────────────────────
                Only visible when isEditing = true.
                Cancel resets all fields to the original USER data.
                Save triggers handleSubmit which simulates an API call.         */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-tp-border">
                {/* Cancel — resets form to original USER data and exits edit mode */}
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setBio(USER.bio);
                    setAvatarUrl(USER.avatarUrl);
                    setSpecs(USER.specs);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-tp-secondary hover:bg-tp-input hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Cancel
                </button>
                {/* Save — shows loading state while the async handleSubmit runs */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-tp-accent hover:bg-tp-accentDim disabled:opacity-50 text-tp-bg rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-accent-glow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving Rig..." : "Save Configuration"}
                </button>
              </div>
            )}

            {/* ── Tab Navigation ────────────────────────────────────────────────
                Three tabs: Overview, PC Build Specs, Recent Activity.
                Active tab gets a cyan accent highlight; others stay dimmed.    */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-tp-card border border-tp-border mt-8">
              {[
                { id: "overview", label: "Overview", icon: <Layers className="w-4 h-4" /> },
                { id: "specs", label: "PC Build Specs", icon: <Cpu className="w-4 h-4" /> },
                { id: "activity", label: "Recent Activity", icon: <Activity className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex-1 justify-center ${
                    activeTab === tab.id
                      ? "bg-tp-accent text-tp-bg shadow-accent-glow-sm"
                      : "text-tp-secondary hover:text-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Content Panels ────────────────────────────────────────────
                Only the active tab panel renders. Each uses animate-fade-in.   */}
            <div className="mt-6 space-y-6">

              {/* ── Overview Tab — stat cards + recent activity preview ── */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-fade-in">

                  {/* Quick Stats — 4 cards: Posts, Comments, Likes, Reputation */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Posts",      value: USER.stats.posts,      icon: <MessageCircle className="w-5 h-5" />, color: "#00D8F6" },
                      { label: "Comments",   value: USER.stats.comments,   icon: <Activity className="w-5 h-5" />,       color: "#A78BFA" },
                      { label: "Likes",      value: USER.stats.likes,      icon: <Heart className="w-5 h-5" />,          color: "#F472B6" },
                      { label: "Reputation", value: USER.stats.reputation, icon: <Star className="w-5 h-5" />,           color: "#FBBF24" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="rounded-2xl p-5 border border-tp-border hover:border-tp-accent/15 transition-all duration-300 group"
                      >
                        {/* Colored icon badge — scales up on card hover */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: s.color + "15", color: s.color }}
                        >
                          {s.icon}
                        </div>
                        <p className="text-2xl font-bold text-white">{s.value.toLocaleString()}</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-tp-secondary mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity Preview — shows only the first 4 items.
                      "View all →" switches the active tab to "activity".       */}
                  <div className="rounded-2xl border border-tp-border bg-tp-card overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-tp-border">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-tp-accent" />
                        Recent Activity
                      </h3>
                      <button
                        onClick={() => setActiveTab("activity")}
                        className="text-xs text-tp-accent hover:underline font-semibold transition-all cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="divide-y divide-tp-border">
                      {USER.recentActivity.slice(0, 4).map((item, i) => (
                        <ActivityItem key={i} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Specs Tab — full hardware list + SVG performance ring charts ── */}
              {activeTab === "specs" && (
                <div className="space-y-6 animate-fade-in">

                  {/* Spec list — rendered from SPEC_LABELS with matching SPEC_ICONS */}
                  <div className="rounded-2xl border border-tp-border bg-tp-card overflow-hidden">
                    <div className="p-5 border-b border-tp-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-tp-accent" />
                            PC Build Configuration
                          </h3>
                          <p className="text-xs text-tp-secondary mt-1">Primary build</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(SPEC_LABELS).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-start gap-3 p-3 rounded-xl bg-tp-input border border-tp-border hover:border-tp-accent/15 transition-all duration-300 group"
                        >
                          {/* Spec icon — fades from dim to full opacity on hover */}
                          <div className="mt-0.5 text-tp-accent opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {SPEC_ICONS[key] || <Cpu className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-tp-secondary block mb-0.5">
                              {label}
                            </span>
                            <span className="text-sm font-medium text-white leading-tight block">
                              {specs[key]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Rings — 4 SVG donut charts.
                      circumference = 2πr (r=34). dashArray fills the arc
                      proportionally to the score out of 100.                   */}
                  <div className="rounded-2xl border border-tp-border bg-tp-card p-5">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-tp-accent" />
                      Performance Profile
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { score: 98, label: "Gaming",      color: "#00D8F6" },
                        { score: 92, label: "Productivity", color: "#A78BFA" },
                        { score: 87, label: "Thermal",     color: "#34D399" },
                        { score: 95, label: "Overall",     color: "#FB923C" },
                      ].map((p, i) => {
                        const circumference = 2 * Math.PI * 34;
                        const dashArray = `${(p.score / 100) * circumference} ${circumference}`;
                        return (
                          <div key={i} className="text-center">
                            <div className="relative w-20 h-20 mx-auto mb-2">
                              {/* SVG ring — rotated -90° so the arc starts from the top */}
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                                {/* Background track */}
                                <circle cx="40" cy="40" r="34" fill="none" stroke="#222834" strokeWidth="6" />
                                {/* Score arc — length driven by dashArray */}
                                <circle cx="40" cy="40" r="34" fill="none" stroke={p.color} strokeWidth="6" strokeLinecap="round" strokeDasharray={dashArray} />
                              </svg>
                              {/* Numeric score centered over the ring */}
                              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                                {p.score}
                              </span>
                            </div>
                            <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: p.color }}>
                              {p.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Activity Tab — full list of all recent activity items ── */}
              {activeTab === "activity" && (
                <div className="rounded-2xl border border-tp-border bg-tp-card overflow-hidden animate-fade-in">
                  <div className="p-5 border-b border-tp-border">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-tp-accent" />
                      All Recent Activity
                    </h3>
                  </div>
                  <div className="divide-y divide-tp-border">
                    {USER.recentActivity.map((item, i) => (
                      <ActivityItem key={i} item={item} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── ActivityItem Sub-Component ───────────────────────────────────────────────
// Renders a single row in the activity feed.
// Receives one activity item and displays its type icon, title, community, and time.
function ActivityItem({ item }) {
  // Maps activity type strings to their matching Lucide icons.
  const TYPE_ICONS = {
    post:    <MessageCircle className="w-3.5 h-3.5" />,
    comment: <MessageCircle className="w-3.5 h-3.5" />,
    like:    <Heart className="w-3.5 h-3.5" />,
    build:   <Cpu className="w-3.5 h-3.5" />,
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-tp-input transition-all duration-200 group cursor-pointer">
      {/* Colored icon badge — background and icon color driven by item.color */}
      <div
        className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: item.color + "15", color: item.color }}
      >
        {TYPE_ICONS[item.type] || TYPE_ICONS.post}
      </div>

      {/* Activity title and metadata */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-tp-text leading-snug group-hover:text-white transition-colors">
          <span className="font-semibold">{item.title}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-tp-secondary">{item.community}</span>
          <span className="text-[11px] text-tp-muted">·</span>
          <span className="text-[11px] text-tp-muted">{item.time}</span>
        </div>
      </div>

      {/* Activity type label (e.g. "post", "comment") on the far right */}
      <span className="text-[10px] uppercase tracking-wider font-bold mt-1" style={{ color: item.color }}>
        {item.type}
      </span>
    </div>
  );
}
