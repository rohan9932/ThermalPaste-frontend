import { Monitor, Droplet, Gamepad2, Flame, Laptop, Tag } from "lucide-react";

// ─── Sub-groups / Communities ────────────────────────────────────────────────
export const SUB_GROUPS = [
  {
    id: "battlestations",
    name: "g/battlestations",
    topic: "Battlestations & Setups",
    description: "Show off your clean desk space, cable management, RGB setups, speaker systems, and ergonomics. High-end PC rooms and minimalist desks.",
    icon: Monitor,
    members: "14.2k",
    iconColor: "text-gray-300",
    colorHex: "#F3F4F6",
    bgColor: "#F3F4F615",
  },
  {
    id: "watercooling",
    name: "g/watercooling",
    topic: "Custom Loops & Liquid Cooling",
    description: "Custom loops, AIOs, temps, coolant fluids, and everything liquid cooled.",
    icon: Droplet,
    members: "8.5k",
    iconColor: "text-sky-400",
    colorHex: "#38BDF8",
    bgColor: "#38BDF815",
  },
  {
    id: "gpuhype",
    name: "g/gpuhype",
    topic: "Graphics Cards & Benchmarks",
    description: "Discuss the latest graphics cards, rasterization, DLSS, ray tracing, and hardware leaks.",
    icon: Gamepad2,
    members: "22.1k",
    iconColor: "text-purple-400",
    colorHex: "#C084FC",
    bgColor: "#C084FC15",
  },
  {
    id: "overclocking",
    name: "g/overclocking",
    topic: "Tuning, Voltages & OC",
    description: "Push your silicon to the absolute limit. Voltages, memory timings, Cinebench scores, and delidding.",
    icon: Flame,
    members: "11.7k",
    iconColor: "text-orange-500",
    colorHex: "#F97316",
    bgColor: "#F9731615",
  },
  {
    id: "pcbuilders",
    name: "g/pcbuilders",
    topic: "AM5, Intel & Build Guides",
    description: "Build advice, part lists, thermal paste application, and troubleshooting for builders.",
    icon: Laptop,
    members: "45.8k",
    iconColor: "text-gray-400",
    colorHex: "#9CA3AF",
    bgColor: "#9CA3AF15",
  },
  {
    id: "techdeals",
    name: "g/techdeals",
    topic: "Hardware Sales & GPU Discounts",
    description: "The best sales, bundle discounts, rebates, and deals on PC parts and peripherals.",
    icon: Tag,
    members: "31.4k",
    iconColor: "text-amber-200",
    colorHex: "#FDE68A",
    bgColor: "#FDE68A15",
  },
];

// Map community name (e.g. "g/battlestations") to its corresponding Lucide icon
export const COMMUNITY_ICON_MAP = {};
SUB_GROUPS.forEach((group) => {
  COMMUNITY_ICON_MAP[group.name] = group.icon;
  COMMUNITY_ICON_MAP[group.id] = group.icon;
});

// ─── Posts Registry ──────────────────────────────────────────────────────────
export const POSTS = [
  {
    id: "post_1",
    community: "g/battlestations",
    subGroup: "g/battlestations",
    communityColor: "#00D8F6",
    author: "SFF_Enthusiast",
    authorname: "SFF_Enthusiast",
    authorAvatar: "/images/avatar.jpg",
    timestamp: "Aug 16, 12:45 AM",
    createdAt: "Aug 16, 12:45 AM",
    title: "Clean Walnut & SFF Setup. Tucked away 9.9L Fractal Terra",
    content:
      "I wanted a distraction-free home office workspace that could double as a decent 1440p gaming machine at night. Cable managed everything underneath the desk.",
    sectionHeader: "### Setup Gear...",
    image: "/images/small-form-factor-mini-itx-pc-case-build-1.webp",
    upvotes: 4,
    commentsCount: 2,
    comments: 2,
    isPopularRig: true,
  },
  {
    id: "post_2",
    community: "g/watercooling",
    subGroup: "g/watercooling",
    communityColor: "#3B82F6",
    author: "LoopMaster",
    authorname: "LoopMaster",
    authorAvatar: "/images/avatar.jpg",
    timestamp: "Aug 15, 8:30 PM",
    createdAt: "Aug 15, 8:30 PM",
    title:
      "First hardline build — full EK Quantum loop with dual 360 radiators",
    content:
      "Took me 3 weekends but finally finished my first hardline custom loop. Temps are insane — 55°C on all-core stress test.",
    sectionHeader: "### Loop Specs...",
    image: "/images/water-cooling-custom-loop-pc-build-1.jpg",
    upvotes: 47,
    commentsCount: 12,
    comments: 12,
    isPopularRig: true,
  },
  {
    id: "post_3",
    community: "g/overclocking",
    subGroup: "g/overclocking",
    communityColor: "#FB923C",
    author: "VoltageKing",
    authorname: "VoltageKing",
    authorAvatar: "/images/avatar.jpg",
    timestamp: "Aug 14, 3:15 PM",
    createdAt: "Aug 14, 3:15 PM",
    title: "5.8GHz all-core on 7950X3D — full voltage & cooling breakdown",
    content:
      "Managed to hit 5.8GHz all-core stable with 1.45V. Running custom loop with dual 420mm rads. Cinebench R23 score: 42,800.",
    sectionHeader: "### OC Settings...",
    image: "/images/overclocking-cpu-benchmark-gaming-1.webp",
    upvotes: 89,
    commentsCount: 34,
    comments: 34,
    isPopularRig: false,
  },
  {
    id: "post_4",
    community: "g/gpuhype",
    subGroup: "g/gpuhype",
    communityColor: "#A78BFA",
    author: "GPUBeliever",
    authorname: "GPUBeliever",
    authorAvatar: "/images/avatar.jpg",
    timestamp: "Aug 13, 11:00 AM",
    createdAt: "Aug 13, 11:00 AM",
    title: "RTX 5090 FE vs RX 9070 XT — first real-world benchmarks",
    content:
      "Finally got both cards side by side. RTX 5090 is about 35% faster in rasterization but the 9070 XT is incredible value for performance.",
    sectionHeader: "### Benchmark Results...",
    image: "/images/gpu-graphics-card-rtx-nvidia-1.webp",
    upvotes: 156,
    commentsCount: 67,
    comments: 67,
    isPopularRig: true,
  },
  {
    id: "post_5",
    community: "g/pcbuilders",
    subGroup: "g/pcbuilders",
    communityColor: "#34D399",
    author: "BuildLogger",
    authorname: "BuildLogger",
    authorAvatar: "/images/avatar.jpg",
    timestamp: "Aug 12, 6:45 PM",
    createdAt: "Aug 12, 6:45 PM",
    title: "Complete AM5 build guide — from parts to Windows in 8 hours",
    content:
      "Thought I'd share my step-by-step process for anyone building their first AM5 system. Including BIOS tips, EXPO setup, and thermal paste application.",
    sectionHeader: "### Parts List...",
    image: "/images/pc-build-guide-step-by-step-tutorial-1.jpg",
    upvotes: 203,
    commentsCount: 45,
    comments: 45,
    isPopularRig: true,
  },
  {
    id: "post_6",
    community: "g/techdeals",
    subGroup: "g/techdeals",
    communityColor: "#FBBF24",
    author: "DealHunter",
    authorname: "DealHunter",
    authorAvatar: "/images/avatar.jpg",
    timestamp: "Aug 11, 2:20 PM",
    createdAt: "Aug 11, 2:20 PM",
    title: "RTX 4070 SUPER drops to $549 — best GPU value right now?",
    content:
      "Newegg has the RTX 4070 SUPER at $549 after rebate. Going through for me. Anyone else pulling the trigger?",
    image: "/images/gpu-graphics-card-rtx-nvidia-2.webp",
    upvotes: 78,
    commentsCount: 23,
    comments: 23,
    isPopularRig: false,
  },
  {
    id: "post-1",
    community: "g/pcbuilders",
    subGroup: "g/pcbuilders",
    communityColor: "#34D399",
    author: "GamerGirlAria",
    authorname: "GamerGirlAria",
    authorAvatar: null,
    timestamp: "Aug 15, 08:30 PM",
    createdAt: "Aug 15, 08:30 PM",
    title:
      "Finished my very first solo PC build! Rate my setup and cable management",
    content:
      "I've been playing on a potato laptop for 5 years and finally saved up enough to build my absolute dream rig!",
    sectionHeader: "### Specs:...",
    upvotes: 1,
    commentsCount: 4,
    comments: 4,
    isPopularRig: false,
  },
];

// ─── Users Registry ──────────────────────────────────────────────────────────
export const SEARCH_USERS = [
  { username: "LinusBuilds", role: "Host of Overclocked Tech Tips", link: "/profile" },
  { username: "SFF_Enthusiast", role: "Custom Mini-ITX Builder", link: "/profile" },
  { username: "LoopMaster", role: "Hardline Liquid Cooling Guru", link: "/profile" },
  { username: "VoltageKing", role: "Competitive Hardware Overclocker", link: "/profile" },
  { username: "GPUBeliever", role: "GPU Benchmark Reviewer", link: "/profile" },
  { username: "BuildLogger", role: "PC Assembly & BIOS Specialist", link: "/profile" },
  { username: "GamerGirlAria", role: "First-time Dream Rig Builder", link: "/profile" },
];

// ─── Helper Functions ────────────────────────────────────────────────────────
export function getPostById(id) {
  if (!id) return null;
  const normalizedId = String(id).toLowerCase();
  return (
    POSTS.find(
      (p) =>
        p.id.toLowerCase() === normalizedId ||
        p.id.replace("_", "-").toLowerCase() === normalizedId ||
        p.id.replace("-", "_").toLowerCase() === normalizedId
    ) || null
  );
}

export function getPostsByCommunity(groupId) {
  if (!groupId) return [];
  const cleanId = String(groupId).replace(/^g\//, "").toLowerCase();
  return POSTS.filter(
    (post) =>
      (post.community || post.subGroup || "")
        .replace(/^g\//, "")
        .toLowerCase() === cleanId
  );
}

export function getCommunityById(groupId) {
  if (!groupId) return null;
  const cleanId = String(groupId).replace(/^g\//, "").toLowerCase();
  return SUB_GROUPS.find((group) => group.id.toLowerCase() === cleanId) || null;
}
