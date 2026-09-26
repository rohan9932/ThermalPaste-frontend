import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, PlusCircle, Sparkles, Loader2 } from "lucide-react";
import { getGroups } from "../services/groups";
import { createPost } from "../services/posts";
import { useAuth } from "../context/AuthContext";

export function CreatePostForm({
  isOpen,
  onClose,
  defaultCommunity = "",
  onPostCreated,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [community, setCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sectionHeader, setSectionHeader] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Query live groups from database
  const { data: apiGroups, isLoading: isGroupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => getGroups(),
  });

  // Build community list strictly from database groups
  const groupOptions = (apiGroups || []).map((g) => {
    const slug = g.name.replace(/^g\//, "");
    return {
      id: slug,
      name: `g/${slug} (${g.tagline || g.category || "Community"})`,
    };
  });

  // Derived selected community: explicitly chosen > default prop > first loaded group > empty
  const selectedCommunity =
    community ||
    (defaultCommunity ? String(defaultCommunity).replace(/^g\//, "") : "") ||
    groupOptions[0]?.id ||
    "";

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    if (!selectedCommunity) {
      setError("Please select a sub-group for your post.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const fullContent = sectionHeader.trim()
        ? `${sectionHeader.trim()}\n\n${content.trim()}`
        : content.trim();

      const created = await createPost({
        group: selectedCommunity,
        heading: title.trim(),
        description: fullContent,
        imageLink: image.trim(),
      });

      // Invalidate posts cache so feeds update immediately
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      if (onPostCreated) {
        onPostCreated(created);
      }

      // Reset form & close modal
      setTitle("");
      setContent("");
      setSectionHeader("");
      setImage("");
      setError("");
      onClose();

      // Navigate to the newly created post
      const targetId = created?._id || created?.id;
      if (targetId) {
        navigate(`/post/${targetId}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create post. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Community */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Choose Sub-group <span className="text-[#00D8F6]">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedCommunity}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full bg-[#161922] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all cursor-pointer"
              >
                {groupOptions.length === 0 ? (
                  <option value="" disabled className="bg-[#0F1117] text-[#8F99A8]">
                    {isGroupsLoading ? "Loading sub-groups..." : "No sub-groups available"}
                  </option>
                ) : (
                  groupOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-[#0F1117] text-white"
                    >
                      {opt.name}
                    </option>
                  ))
                )}
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
              Specs Snippet / Sub-header{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
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
              Image URL{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
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
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#161922] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-xl shadow-[0_0_14px_rgba(0,216,246,0.3)] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostForm;
