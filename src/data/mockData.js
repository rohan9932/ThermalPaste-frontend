import {
  Monitor,
  Droplet,
  Gamepad2,
  Flame,
  Laptop,
  Tag,
  Cpu,
  Shield,
  Wrench,
  Boxes,
} from "lucide-react";

// ─── Category Icon Map ────────────────────────────────────────────────────────
// Every community belongs to a category. Icons are assigned directly to categories.
export const CATEGORY_ICON_MAP = {
  hardware: Cpu,
  cooling: Droplet,
  battlestations: Monitor,
  overclocking: Flame,
  benchmarking: Flame,
  peripherals: Laptop,
  techdeals: Tag,
  gaming: Gamepad2,
  modding: Wrench,
  security: Shield,
};

// Helper: Resolve category Lucide icon with safe fallback
export function getCategoryIcon(category, fallback = Boxes) {
  if (!category) return fallback;
  const key = String(category).toLowerCase().trim().replace(/^g\//, "");
  return CATEGORY_ICON_MAP[key] || fallback;
}

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
