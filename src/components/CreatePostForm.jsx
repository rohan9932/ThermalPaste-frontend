import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  X,
  PlusCircle,
  Sparkles,
  Loader2,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image file size must not exceed 10MB.");
      return;
    }

    setError("");
    setImageFile(file);
    setImageUrl("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

      let postPayload;
      if (imageFile) {
        const formData = new FormData();
        formData.append("group", selectedCommunity);
        formData.append("heading", title.trim());
        formData.append("description", fullContent);
        formData.append("image", imageFile);
        postPayload = formData;
      } else {
        postPayload = {
          group: selectedCommunity,
          heading: title.trim(),
          description: fullContent,
          imageLink: imageUrl.trim(),
        };
      }

      const created = await createPost(postPayload);

      // Invalidate posts cache so feeds update immediately
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      if (onPostCreated) {
        onPostCreated(created);
      }

      // Reset form & close modal
      setTitle("");
      setContent("");
      setSectionHeader("");
      setImageFile(null);
      setImagePreview("");
      setImageUrl("");
      setError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

          {/* Post Image (Full File Upload to Cloudinary or URL) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
              Post Image{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview || imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-[#222834] bg-[#0B0D11] p-3 flex flex-col sm:flex-row items-center gap-3">
                <img
                  src={imagePreview || imageUrl}
                  alt="Post preview"
                  className="w-full sm:w-28 h-28 object-cover rounded-lg border border-[#222834]"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                  <p className="text-xs font-semibold text-white truncate">
                    {imageFile ? imageFile.name : "Image linked"}
                  </p>
                  <p className="text-[11px] text-[#8F99A8]">
                    {imageFile
                      ? `${(imageFile.size / (1024 * 1024)).toFixed(2)} MB • Uploads to Cloudinary`
                      : "Remote image URL"}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#00D8F6] hover:underline font-medium cursor-pointer"
                    >
                      Change Image
                    </button>
                    <span className="text-[#8F99A8]">•</span>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="text-xs text-rose-400 hover:underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#222834] hover:border-[#00D8F6]/60 hover:bg-[#161922]/50 transition-all rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 cursor-pointer group text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-[#161922] group-hover:bg-[#00D8F6]/10 flex items-center justify-center text-[#8F99A8] group-hover:text-[#00D8F6] transition-colors">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-[#00D8F6] transition-colors">
                      Click to upload an image from your device
                    </p>
                    <p className="text-[11px] text-[#8F99A8] mt-0.5">
                      JPG, PNG, or WebP up to 10MB (Automatically hosted on Cloudinary)
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center justify-center my-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#222834]" />
                  </div>
                  <span className="relative bg-[#0F1117] px-2 text-[10px] uppercase font-bold text-[#8F99A8]/70">
                    or paste image url
                  </span>
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setImagePreview(e.target.value.trim());
                    } else {
                      setImagePreview("");
                    }
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#161922] text-xs text-white placeholder-[#8F99A8]/60 px-3.5 py-2 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all"
                />
              </div>
            )}
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
