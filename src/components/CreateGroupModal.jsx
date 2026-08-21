import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Users, Globe, Shield, Sparkles } from "lucide-react";

export function CreateGroupModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("hardware");
  const [privacy, setPrivacy] = useState("public");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    // Sanitize group name for URL (remove g/, spaces, special characters)
    const cleanId = groupName
      .toLowerCase()
      .replace(/^g\//, "")
      .replace(/[^a-z0-9-_]/g, "");

    // Reset fields & close
    setGroupName("");
    setTagline("");
    setDescription("");
    onClose();

    // Navigate to the newly created sub-group
    navigate(`/communities/${cleanId || "custom-group"}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0F1117] border border-[#222834] rounded-2xl p-6 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222834] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Create a Sub-group
              </h2>
              <p className="text-xs text-[#8F99A8]">
                Start a new community
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8F99A8] hover:text-white hover:bg-[#161922] rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Identifier */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Group Name <span className="text-[#00D8F6]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-sm font-semibold text-[#8F99A8] select-none">
                g/
              </span>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g: keyboards"
                className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 pl-8 pr-4 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all"
              />
            </div>
            <p className="text-[11px] text-[#8F99A8] mt-1">
              Names cannot be changed later. Letters, numbers, and hyphens only.
            </p>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Topic / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Custom Mechanical Keyboards & Switches"
              className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Primary Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#161922] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all cursor-pointer"
            >
              <option value="hardware">PC Hardware & Components</option>
              <option value="battlestations">Battlestations & Setups</option>
              <option value="cooling">Custom Cooling & AIOs</option>
              <option value="overclocking">Overclocking & Benchmarking</option>
              <option value="peripherals">Keyboards & Peripherals</option>
              <option value="techdeals">Deals & Discussions</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this community all about? Tell potential members what to expect..."
              className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Privacy Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-2">
              Privacy Setting
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                onClick={() => setPrivacy("public")}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  privacy === "public"
                    ? "bg-[#00D8F6]/10 border-[#00D8F6] text-white"
                    : "bg-[#161922] border-[#222834] text-[#8F99A8] hover:border-[#2A3142]"
                }`}
              >
                <Globe className={`w-4 h-4 mt-0.5 shrink-0 ${privacy === "public" ? "text-[#00D8F6]" : ""}`} />
                <div>
                  <p className="text-xs font-bold text-white">Public</p>
                  <p className="text-[11px] text-[#8F99A8] leading-tight mt-0.5">
                    Anyone can view and submit posts
                  </p>
                </div>
              </label>

              <label
                onClick={() => setPrivacy("restricted")}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  privacy === "restricted"
                    ? "bg-[#00D8F6]/10 border-[#00D8F6] text-white"
                    : "bg-[#161922] border-[#222834] text-[#8F99A8] hover:border-[#2A3142]"
                }`}
              >
                <Shield className={`w-4 h-4 mt-0.5 shrink-0 ${privacy === "restricted" ? "text-[#00D8F6]" : ""}`} />
                <div>
                  <p className="text-xs font-bold text-white">Restricted</p>
                  <p className="text-[11px] text-[#8F99A8] leading-tight mt-0.5">
                    Only approved members can post
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222834] mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#161922] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,216,246,0.25)] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
