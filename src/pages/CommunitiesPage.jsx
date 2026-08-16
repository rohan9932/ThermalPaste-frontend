// CommunitiesPage.jsx
// Displays a community post feed with search, sorting, upvoting/downvoting, and post cards.

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
    Search,
    Flame,
    MessageCircle,
    Share2,
    Cpu,
    Monitor,
    ArrowBigUp,
    ArrowBigDown,
    LayoutGrid,
    TrendingUp,
    Award,
} from "lucide-react";

// ─── Mock Posts Data ──────────────────────────────────────────────────────────
// Static post data used as placeholder content until a backend API is integrated.
// In production, this would be fetched via GET /api/posts or similar endpoint.
const POSTS = [
    {
        id: "post_1",
        community: "g/battlestations",
        communityIcon: <Monitor className="w-4 h-4" />,
        communityColor: "#00D8F6",
        author: "SFF_Enthusiast",
        authorAvatar: "/images/avatar.jpg",
        hardwareTags: ["AMD Ryzen 7 7800X3D", "NVIDIA RTX 4090"],
        timestamp: "Aug 16, 12:45 AM",
        title: "Clean Walnut & SFF Setup. Tucked away 9.9L Fractal Terra",
        content:
            "I wanted a distraction-free home office workspace that could double as a decent 1440p gaming machine at night.",
        sectionHeader: "### Setup Gear...",
        image: "/images/small-form-factor-mini-itx-pc-case-build-1.webp",
        upvotes: 4,
        comments: 0,
        isPopularRig: true,
    },
    {
        id: "post_2",
        community: "g/watercooling",
        communityIcon: <Flame className="w-4 h-4" />,
        communityColor: "#3B82F6",
        author: "LoopMaster",
        authorAvatar: "/images/avatar.jpg",
        hardwareTags: ["AMD Ryzen 9 7950X3D", "NVIDIA RTX 4090"],
        timestamp: "Aug 15, 8:30 PM",
        title: "First hardline build — full EK Quantum loop with dual 360 radiators",
        content:
            "Took me 3 weekends but finally finished my first hardline custom loop. Temps are insane — 55°C on all-core stress.",
        sectionHeader: "### Loop Specs...",
        image: "/images/water-cooling-custom-loop-pc-build-1.jpg",
        upvotes: 47,
        comments: 12,
        isPopularRig: true,
    },
    {
        id: "post_3",
        community: "g/overclocking",
        communityIcon: <TrendingUp className="w-4 h-4" />,
        communityColor: "#FB923C",
        author: "VoltageKing",
        authorAvatar: "/images/avatar.jpg",
        hardwareTags: ["AMD Ryzen 9 7950X3D", "ASUS ROG Crosshair"],
        timestamp: "Aug 14, 3:15 PM",
        title: "5.8GHz all-core on 7950X3D — full voltage & cooling breakdown",
        content:
            "Managed to hit 5.8GHz all-core stable with 1.45V. Running custom loop with dual 420mm rads. Cinebench R23 score: 42,800.",
        sectionHeader: "### OC Settings...",
        image: "/images/overclocking-cpu-benchmark-gaming-1.webp",
        upvotes: 89,
        comments: 34,
    },
    {
        id: "post_4",
        community: "g/gpuhype",
        communityIcon: <Cpu className="w-4 h-4" />,
        communityColor: "#A78BFA",
        author: "GPUBeliever",
        authorAvatar: "/images/avatar.jpg",
        hardwareTags: ["NVIDIA RTX 5090", "AMD Ryzen 9 9950X"],
        timestamp: "Aug 13, 11:00 AM",
        title: "RTX 5090 FE vs RX 9070 XT — first real-world benchmarks",
        content:
            "Finally got both cards side by side. RTX 5090 is about 35% faster in rasterization but the 9070 XT is incredible value.",
        sectionHeader: "### Benchmark Results...",
        image: "/images/gpu-graphics-card-rtx-nvidia-1.webp",
        upvotes: 156,
        comments: 67,
        isPopularRig: true,
    },
    {
        id: "post_5",
        community: "g/pcbuilders",
        communityIcon: <LayoutGrid className="w-4 h-4" />,
        communityColor: "#34D399",
        author: "BuildLogger",
        authorAvatar: "/images/avatar.jpg",
        hardwareTags: ["AMD Ryzen 7 7700X", "NVIDIA RTX 4080"],
        timestamp: "Aug 12, 6:45 PM",
        title: "Complete AM5 build guide — from parts to Windows in 8 hours",
        content:
            "Thought I'd share my step-by-step process for anyone building their first AM5 system. Including BIOS tips and thermal paste application.",
        sectionHeader: "### Parts List...",
        image: "/images/pc-build-guide-step-by-step-tutorial-1.jpg",
        upvotes: 203,
        comments: 45,
        isPopularRig: true,
    },
    {
        id: "post_6",
        community: "g/techdeals",
        communityIcon: <Award className="w-4 h-4" />,
        communityColor: "#FBBF24",
        author: "DealHunter",
        authorAvatar: "/images/avatar.jpg",
        hardwareTags: ["NVIDIA RTX 4070 SUPER"],
        timestamp: "Aug 11, 2:20 PM",
        title: "RTX 4070 SUPER drops to $549 — best GPU value right now?",
        content:
            "Newegg has the RTX 4070 SUPER at $549 after rebate. Going through for me. Anyone else pulling the trigger?",
        image: "/images/gpu-graphics-card-rtx-nvidia-2.webp",
        upvotes: 78,
        comments: 23,
    },
];

// ─── AvatarFallback Sub-Component ─────────────────────────────────────────────
// Renders a simple initials-based avatar circle when an author's image fails to load.
// 'name' is used to extract the first character for display.
function AvatarFallback({
    name,
    className = "w-4 h-4",
}) {
    return (
        <div
            className={`${className} rounded-full bg-tp-input border border-tp-border flex items-center justify-center text-[10px] font-bold text-tp-secondary`}
        >
            {name.charAt(0)}
        </div>
    );
}

// ─── PostCard Sub-Component ───────────────────────────────────────────────────
// Renders a single post card with vote controls, author metadata, content, and action buttons.
// Each card manages its own local vote state independently.
function PostCard({ post }) {
    // Local vote state: "up", "down", or null (no vote).
    // Clicking the same button again resets the vote back to null.
    const [vote, setVote] = useState(null);

    // Adjust the displayed vote count based on the current vote state:
    // +1 for upvote, -1 for downvote, 0 for no vote.
    const voteCount =
        post.upvotes + (vote === "up" ? 1 : vote === "down" ? -1 : 0);

    return (
        <div className="rounded-2xl border border-tp-border bg-tp-card overflow-hidden">
            <div className="flex">

                {/* Vote Column — upvote button, vote count, downvote button */}
                <div className="flex flex-col items-center gap-1 py-4 px-3 bg-tp-bg/50">
                    {/* Upvote button — highlighted when vote === "up" */}
                    <button
                        onClick={() => setVote(vote === "up" ? null : "up")}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${vote === "up"
                                ? "bg-tp-accent text-tp-bg"
                                : "text-tp-muted hover:text-tp-accent hover:bg-tp-accent/10"
                            }`}
                    >
                        <ArrowBigUp className="w-5 h-5" />
                    </button>

                    {/* Vote count — cyan for upvoted, red for downvoted, grey for neutral */}
                    <span
                        className={`text-sm font-bold ${vote === "up"
                                ? "text-tp-accent"
                                : vote === "down"
                                    ? "text-tp-danger"
                                    : "text-tp-secondary"
                            }`}
                    >
                        {voteCount}
                    </span>

                    {/* Downvote button — highlighted when vote === "down" */}
                    <button
                        onClick={() => setVote(vote === "down" ? null : "down")}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${vote === "down"
                                ? "bg-tp-danger/20 text-tp-danger"
                                : "text-tp-muted hover:text-tp-danger hover:bg-tp-danger/10"
                            }`}
                    >
                        <ArrowBigDown className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Column — metadata, title, body, image, and action buttons */}
                <div className="flex-1 min-w-0 p-4">

                    {/* Meta row — community badge, author avatar, hardware tags, timestamp */}
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-tp-secondary mb-2">
                        {/* Community badge — colored icon + community name */}
                        <span className="flex items-center gap-1 font-semibold text-white">
                            <span
                                className="w-5 h-5 rounded-md flex items-center justify-center"
                                style={{
                                    backgroundColor: post.communityColor + "15",
                                    color: post.communityColor,
                                }}
                            >
                                {post.communityIcon}
                            </span>
                            {post.community}
                        </span>
                        <span className="text-tp-muted">·</span>

                        {/* Author avatar — hides itself if the image fails to load */}
                        <span className="flex items-center gap-1">
                            <img
                                src={post.authorAvatar}
                                alt={post.author}
                                className="w-4 h-4 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                            {/* Fallback initials avatar — shown only when image fails */}
                            <span className="fallback-hidden">
                                {post.authorAvatar && (
                                    <AvatarFallback
                                        name={post.author}
                                        className="w-4 h-4 hidden"
                                    />
                                )}
                            </span>
                            {post.author}
                        </span>

                        {/* Hardware tag pills — cyan monospace badges for each component */}
                        {post.hardwareTags.map((tag, i) => (
                            <React.Fragment key={i}>
                                <span className="text-tp-muted">·</span>
                                <span
                                    className="px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold"
                                    style={{
                                        backgroundColor: "#00D8F610",
                                        borderColor: "#00D8F630",
                                        color: "#00D8F6",
                                    }}
                                >
                                    {tag}
                                </span>
                            </React.Fragment>
                        ))}
                        <span className="text-tp-muted">·</span>
                        <span>{post.timestamp}</span>
                    </div>

                    {/* Post title */}
                    <h3 className="text-base font-bold text-white leading-snug mb-1.5">
                        {post.title}
                    </h3>

                    {/* Post body text */}
                    <p className="text-sm text-tp-text leading-relaxed mb-2">
                        {post.content}
                    </p>

                    {/* Optional section header — only rendered if the field is present */}
                    {post.sectionHeader && (
                        <p className="text-sm text-tp-secondary font-mono mb-3">
                            {post.sectionHeader}
                        </p>
                    )}

                    {/* Optional post image — hidden via CSS if the image fails to load */}
                    {post.image && (
                        <div className="rounded-xl overflow-hidden border border-tp-border mb-3 max-h-[400px]">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    {/* Action bar — Comments count, Share button, and optional Popular Rig badge */}
                    <div className="flex items-center gap-4 pt-2 border-t border-tp-border">
                        {/* Comments button — placeholder, no action implemented yet */}
                        <button className="flex items-center gap-1.5 text-xs text-tp-secondary hover:text-white transition-colors cursor-pointer">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments} Comments
                        </button>
                        {/* Share button — placeholder, no action implemented yet */}
                        <button className="flex items-center gap-1.5 text-xs text-tp-secondary hover:text-white transition-colors cursor-pointer">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        {/* Popular Rig badge — only shown if isPopularRig = true */}
                        {post.isPopularRig && (
                            <span className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-tp-orange/10 text-tp-orange border border-tp-orange/20">
                                <Award className="w-3 h-3" />
                                Popular Rig
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── CommunitiesPage Component ────────────────────────────────────────────────
export default function CommunitiesPage() {
    // Controls whether the sidebar is open or collapsed.
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Tracks the active sort mode. Sorting logic is a placeholder —
    // actual filtering/ordering would be applied here once a backend exists.
    const [sortBy, setSortBy] = useState("newest");

    // Bound to the search input. Filtering is a placeholder —
    // actual search filtering would be applied against POSTS here.
    const [searchQuery, setSearchQuery] = useState("");

    // Sort options array — rendered as buttons in the sort bar.
    // Each option has an id, label, and icon.
    const SORT_OPTIONS = [
        {
            id: "newest",
            label: "Newest",
            // Inline SVG clock icon (no Lucide equivalent available).
            icon: (
                <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        { id: "hot", label: "Hot", icon: <Flame className="w-3.5 h-3.5" /> },
        {
            id: "top",
            label: "Top Rated",
            icon: <TrendingUp className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <div className="min-h-screen bg-tp-bg text-white flex flex-col font-sans">

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
                    className={`flex-1 transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-64" : "ml-0"
                    }`}
                >

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">

                        {/* Community Header Card ────────────────────────────────────────
                            Showcases the featured community (g/battlestations).
                            Posts Count badge dynamically displays the total number of posts. */}
                        <div className="rounded-2xl border border-tp-border bg-tp-card p-5 mb-4">
                            <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                                {/* Community icon badge */}
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border"
                                    style={{
                                        backgroundColor: "#00D8F615",
                                        borderColor: "#00D8F630",
                                        color: "#00D8F6",
                                    }}
                                >
                                    <Monitor className="w-6 h-6" />
                                </div>
                                {/* Community name, tagline, and description */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold text-white">g/battlestations</h2>
                                    <p className="text-sm text-tp-accent font-semibold">
                                        Battlestations & Setups
                                    </p>
                                    <p className="text-xs text-tp-secondary mt-1.5 leading-relaxed max-w-xl">
                                        Show off your clean desk space, cable management, RGB setups,
                                        speaker systems, and ergonomics. High-end PC rooms and
                                        minimalist desks.
                                    </p>
                                </div>
                                {/* Posts count + Write Post action */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Dynamic post count — reads from POSTS array length */}
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tp-input border border-tp-border text-xs text-tp-secondary">
                                        <LayoutGrid className="w-3.5 h-3.5" />
                                        <span>Posts Count:</span>
                                        <span className="font-bold text-white">{POSTS.length}</span>
                                    </div>
                                    {/* Write Post button — placeholder, no action implemented yet */}
                                    <button className="px-4 py-2 rounded-xl bg-white text-tp-bg text-xs font-bold transition-all hover:bg-gray-200 cursor-pointer">
                                        Write Post here
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sort Bar ─────────────────────────────────────────────────────
                            Three sort options: Newest, Hot, Top Rated.
                            Active button gets an accent-colored highlight.
                            Note: actual sorting logic is not yet implemented. */}
                        <div className="rounded-2xl border border-tp-border bg-tp-card p-3 mb-4 flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-tp-muted px-2">
                                Sort Rig Log:
                            </span>
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setSortBy(opt.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${sortBy === opt.id
                                            ? "bg-tp-accent/10 text-tp-accent border border-tp-accent/20"
                                            : "text-tp-secondary hover:text-white hover:bg-tp-input border border-transparent"
                                        }`}
                                >
                                    {opt.icon}
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Posts Feed ───────────────────────────────────────────────────
                            Renders each post from the POSTS array as a PostCard.
                            Each PostCard manages its own vote state independently.      */}
                        <div className="space-y-4">
                            {POSTS.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
