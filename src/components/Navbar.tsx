import { Plus, Search, UserRoundCog } from "lucide-react";

function Navbar() {
  return (
    <header className="w-full bg-[#0F1117] border-b border-[#222834] px-8 py-2.5 flex items-center justify-between gap-4 select-none sticky top-0 z-50">
      {/* LOGO */}
      <div className="flex items-center gap-3 shrink-0 cursor-pointer">
        {/* will route to homepage later */}
        <p className="font-bold text-white text-2xl">ThermalPaste</p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#8F99A8] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search posts, groups, users"
            className="w-full bg-[#161922] hover:bg-[#1E2330] focus:bg-[#161922] text-xs text-white placeholder-[#8F99A8] pl-10 pr-24 py-2 rounded-full border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* ACTION ICONS & USER PROFILE*/}
      <div className="flex items-center gap-x-5 sm:gap-2 shrink-0">
        {/* CREATE POST */}
        <button className="flex items-center gap-1.5 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold px-3 py-1.5 rounded-full transition shadow-[0_0_12px_rgba(0,216,246,0.25)] active:scale-95 cursor-pointer">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden md:inline uppercase tracking-wider text-[11px]">
            Create
          </span>
        </button>

        {/* USER AVATAR */}
        <button className="relative ml-1 p-0.5 rounded-full hover:ring-2 hover:ring-[#00D8F6]/50 transition cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-200">
            <UserRoundCog className="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
