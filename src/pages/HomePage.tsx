import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{/* Main content area */}</main>
      </div>
    </div>
  );
}

export default HomePage;
