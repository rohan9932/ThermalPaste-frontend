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

/* ─── Types ─── */
interface Post {
    id: string;
    community: string;
    communityIcon: React.ReactNode;
    communityColor: string;
    author: string;
    authorAvatar: string;
    hardwareTags: string[];
    timestamp: string;
    title: string;
    content: string;
    sectionHeader?: string;
    image?: string;
    upvotes: number;
    comments: number;
    isPopularRig?: boolean;
}

/* ─── Mock Data ─── */
const POSTS: Post[] = [
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

/* ─── Avatar Fallback ─── */
function AvatarFallback({
    name,
    className = "w-4 h-4",
}: {
    name: string;
    className?: string;
}) {
    return (
        <div
            className={`${className} rounded-full bg-tp-input border border-tp-border flex items-center justify-center text-[10px] font-bold text-tp-secondary`}
        >
            {name.charAt(0)}
        </div>
    );
}

/* ─── Post Card ─── */
function PostCard({ post }: { post: Post }) {
    const [vote, setVote] = useState<"up" | "down" | null>(null);
    const voteCount =
        post.upvotes + (vote === "up" ? 1 : vote === "down" ? -1 : 0);

    return (
        <div className="rounded-2xl border border-tp-border bg-tp-card overflow-hidden">
            <div className="flex">
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1 py-4 px-3 bg-tp-bg/50">
                    <button
                        onClick={() => setVote(vote === "up" ? null : "up")}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${vote === "up"
                                ? "bg-tp-accent text-tp-bg"
                                : "text-tp-muted hover:text-tp-accent hover:bg-tp-accent/10"
                            }`}
                    >
                        <ArrowBigUp className="w-5 h-5" />
                    </button>
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

                {/* Content */}
                <div className="flex-1 min-w-0 p-4">
                    {/* Meta row */}
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-tp-secondary mb-2">
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
                        <span className="flex items-center gap-1">
                            <img
                                src={post.authorAvatar}
                                alt={post.author}
                                className="w-4 h-4 rounded-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
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

                    {/* Title */}
                    <h3 className="text-base font-bold text-white leading-snug mb-1.5">
                        {post.title}
                    </h3>

                    {/* Content */}
                    <p className="text-sm text-tp-text leading-relaxed mb-2">
                        {post.content}
                    </p>

                    {/* Section header */}
                    {post.sectionHeader && (
                        <p className="text-sm text-tp-secondary font-mono mb-3">
                            {post.sectionHeader}
                        </p>
                    )}

                    {/* Image */}
                    {post.image && (
                        <div className="rounded-xl overflow-hidden border border-tp-border mb-3 max-h-[400px]">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-2 border-t border-tp-border">
                        <button className="flex items-center gap-1.5 text-xs text-tp-secondary hover:text-white transition-colors cursor-pointer">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments} Comments
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-tp-secondary hover:text-white transition-colors cursor-pointer">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
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

/* ─── Main Component ─── */
export default function CommunitiesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<"newest" | "hot" | "top">("newest");
    const [searchQuery, setSearchQuery] = useState("");

    const SORT_OPTIONS = [
        {
            id: "newest" as const,
            label: "Newest",
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
        { id: "hot" as const, label: "Hot", icon: <Flame className="w-3.5 h-3.5" /> },
        {
            id: "top" as const,
            label: "Top Rated",
            icon: <TrendingUp className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <div className="min-h-screen bg-tp-bg text-white flex flex-col font-sans">
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
                    className={`flex-1 transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-64" : "ml-0"
                    }`}
                >
                    {/* Top Bar Search */}
                    <div className="sticky top-[57px] z-30 bg-tp-bg/80 backdrop-blur-xl border-b border-tp-border">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-tp-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search posts, component specs (e.g., RTX 4090, AM5)..."
                                    className="w-full bg-tp-card text-sm text-white placeholder-tp-muted pl-10 pr-4 py-2.5 rounded-xl border border-tp-border focus:border-tp-accent focus:outline-none transition-all"
                                />
                            </div>
                            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-tp-card border border-tp-border text-xs font-bold text-white hover:border-tp-accent/30 transition-all cursor-pointer">
                                <LayoutGrid className="w-4 h-4 text-tp-accent" />
                                Modify My Rig
                            </button>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                {/* Community Header */}
                <div className="rounded-2xl border border-tp-border bg-tp-card p-5 mb-4">
                    <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
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
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tp-input border border-tp-border text-xs text-tp-secondary">
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>Posts Count:</span>
                                <span className="font-bold text-white">{POSTS.length}</span>
                            </div>
                            <button className="px-4 py-2 rounded-xl bg-white text-tp-bg text-xs font-bold transition-all hover:bg-gray-200 cursor-pointer">
                                Write Post here
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sort Bar */}
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

                {/* Posts */}
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