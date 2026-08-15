import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";

function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
