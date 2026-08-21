import React, { useState } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Monitor, Droplet, Gamepad2, Flame, Laptop, Tag } from "lucide-react";

// Mock data representing the communities the current user has joined
const JOINED_COMMUNITIES = [
  {
    id: "battlestations",
    name: "g/battlestations",
    icon: Monitor,
    description: "Show off your clean desk space, cable management, RGB setups, and ergonomics.",
    members: "14.2k",
    iconColor: "#F3F4F6", // text-gray-300
    bgColor: "#F3F4F615",
  },
  {
    id: "watercooling",
    name: "g/watercooling",
    icon: Droplet,
    description: "Custom loops, AIOs, temps, and everything liquid cooled.",
    members: "8.5k",
    iconColor: "#38BDF8", // text-sky-400
    bgColor: "#38BDF815",
  },
  {
    id: "gpuhype",
    name: "g/gpuhype",
    icon: Gamepad2,
    description: "Discuss the latest graphics cards, benchmarks, and rumors.",
    members: "22.1k",
    iconColor: "#C084FC", // text-purple-400
    bgColor: "#C084FC15",
  },
  {
    id: "overclocking",
    name: "g/overclocking",
    icon: Flame,
    description: "Push your hardware to the absolute limit. Voltages, timings, and high scores.",
    members: "11.7k",
    iconColor: "#F97316", // text-orange-500
    bgColor: "#F9731615",
  },
  {
    id: "pcbuilders",
    name: "g/pcbuilders",
    icon: Laptop,
    description: "Build advice, part lists, and troubleshooting for new PC builders.",
    members: "45.8k",
    iconColor: "#9CA3AF", // text-gray-400
    bgColor: "#9CA3AF15",
  },
  {
    id: "techdeals",
    name: "g/techdeals",
    icon: Tag,
    description: "The best sales on PC parts, peripherals, and software.",
    members: "31.4k",
    iconColor: "#FDE68A", // text-amber-200
    bgColor: "#FDE68A15",
  },
];

export default function CommunitiesListPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6 border-b border-tp-border pb-4">
              <h1 className="text-2xl font-bold text-white">Your Communities</h1>
              <p className="text-sm text-tp-secondary mt-1">
                Manage and explore the sub-groups you've joined.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {JOINED_COMMUNITIES.map((community) => {
                const Icon = community.icon;
                return (
                  <Link
                    key={community.id}
                    to={`/communities/${community.id}`}
                    className="p-5 rounded-2xl border border-tp-border bg-tp-card hover:border-tp-accent/40 transition-all group flex flex-col h-full"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-transparent group-hover:border-current transition-colors"
                        style={{
                          backgroundColor: community.bgColor,
                          color: community.iconColor,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white group-hover:text-tp-accent transition-colors">
                          {community.name}
                        </h2>
                        <p className="text-xs font-semibold text-tp-secondary">
                          {community.members} members
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-tp-text leading-relaxed flex-1">
                      {community.description}
                    </p>
                    <div className="mt-4 pt-3 border-t border-tp-border/50 text-xs font-bold text-tp-accent group-hover:underline">
                      Visit Community &rarr;
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
