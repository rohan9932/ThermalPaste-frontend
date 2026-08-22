import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, PlusCircle, Image, FileText, LayoutGrid, Sparkles } from "lucide-react";

const COMMUNITY_OPTIONS = [
  { id: "g/battlestations", name: "g/battlestations (Setups & Desks)" },
  { id: "g/pcbuilders", name: "g/pcbuilders (Builds & Advice)" },
  { id: "g/watercooling", name: "g/watercooling (Custom Loops)" },
  { id: "g/overclocking", name: "g/overclocking (Tuning & Benchmarks)" },
  { id: "g/gpuhype", name: "g/gpuhype (Graphics Cards & News)" },
  { id: "g/techdeals", name: "g/techdeals (Discounts & Sales)" },
];

export function CreatePostForm({
  isOpen,
  onClose,
  defaultCommunity = "g/battlestations",
  onPostCreated,
}) {
  const navigate = useNavigate();

  const [community, setCommunity] = useState(defaultCommunity);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sectionHeader, setSectionHeader] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (defaultCommunity) {
      setCommunity(defaultCommunity);
    }
  }, [defaultCommunity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      subGroup: community,
      community: community,
      subGroupSlug: community.replace(/^g\//, ""),
      author: "You",
      authorname: "You",
      createdAt: "Just now",
      timestamp: "Just now",
      sectionHeader: sectionHeader.trim() || null,
      image: image.trim() || null,
      upvotes: 1,
      commentsCount: 0,
      comments: 0,
    };

    if (onPostCreated) {
      onPostCreated(newPost);
    }

    // Reset fields & close modal
    setTitle("");
    setContent("");
    setSectionHeader("");
    setImage("");
    onClose();

    // Navigate directly to the new post's dynamic route
    navigate(`/post/${newPost.id}`, { state: { post: newPost } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-[#0F1117] border border-[#222834] rounded-2xl p-6 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222834] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Create a Post
              </h2>
              <p className="text-xs text-[#8F99A8]">
                Share your rig, questions, or benchmarks
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
          {/* Target Community */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Choose Sub-group <span className="text-[#00D8F6]">*</span>
            </label>
            <div className="relative">
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full bg-[#161922] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all cursor-pointer"
              >
                {COMMUNITY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0F1117] text-white">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Post Title <span className="text-[#00D8F6]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g: Clean Walnut & SFF Fractal Terra Build"
              className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all"
            />
          </div>

          {/* Post Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Post Content <span className="text-[#00D8F6]">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your build, questions, temps, or components in detail..."
              className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 p-3.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Section Header / Snippet (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Specs Snippet / Sub-header <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={sectionHeader}
              onChange={(e) => setSectionHeader(e.target.value)}
              placeholder="e.g: ### Setup Gear... or ### Loop Specs..."
              className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all font-mono text-xs"
            />
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Image URL <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="e.g: https://... or /images/small-form-factor-mini-itx-pc-case-build-1.webp"
              className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222834]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#161922] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-xl shadow-[0_0_14px_rgba(0,216,246,0.3)] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostForm;
