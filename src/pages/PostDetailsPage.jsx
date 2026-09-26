import { useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getPostById as getPostByIdMock,
  COMMUNITY_ICON_MAP,
} from "../data/mockData";
import {
  getPostById as getPostByIdApi,
  updatePost,
  deletePost,
  toggleSavePost,
  POST_KEYS,
} from "../services/posts";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Share2,
  Bookmark,
  CircleUserRound,
  Boxes,
  Send,
  Reply,
  Edit3,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// ─── Comment Item Sub-Component ───────────────────────────────────────────────
// Renders an individual comment with independent vote controls, score, and reply capability.
function CommentItem({ comment, onAddReply, isNested = false }) {
  const [voteState, setVoteState] = useState(null);
  const [voteCount, setVoteCount] = useState(comment.upvotes ?? 0);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleUpvote = () => {
    if (voteState === "down") {
      setVoteCount((prev) => prev + 2);
    } else if (voteState === "up") {
      setVoteCount((prev) => prev - 1);
    } else {
      setVoteCount((prev) => prev + 1);
    }
    setVoteState(voteState === "up" ? null : "up");
  };

  const handleDownvote = () => {
    if (voteState === "up") {
      setVoteCount((prev) => prev - 2);
    } else if (voteState === "down") {
      setVoteCount((prev) => prev + 1);
    } else {
      setVoteCount((prev) => prev - 1);
    }
    setVoteState(voteState === "down" ? null : "down");
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (onAddReply) {
      onAddReply(comment.id, replyText.trim());
    }

    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div
      className={`rounded-xl border border-[#222834] transition ${
        isNested
          ? "p-3 bg-[#11141c]"
          : "p-3.5 sm:p-4 bg-[#161922] hover:border-[#2A3142]"
      }`}
    >
      <div className="flex gap-3 sm:gap-3.5">
        {/* Vote Column */}
        <div className="flex flex-col items-center shrink-0 pt-0.5">
          <button
            onClick={handleUpvote}
            aria-label="Upvote comment"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              voteState === "up"
                ? "bg-[#00D8F6] text-[#0B0D11] shadow-[0_0_10px_rgba(0,216,246,0.4)]"
                : "text-[#8F99A8] hover:text-[#00D8F6] hover:bg-[#0B0D11]"
            }`}
          >
            <ArrowUp
              className={`w-4 h-4 stroke-[2.5] ${
                voteState === "up" ? "fill-current" : ""
              }`}
            />
          </button>

          <span
            className={`text-xs font-bold my-1 transition-colors ${
              voteState === "up"
                ? "text-[#00D8F6]"
                : voteState === "down"
                  ? "text-rose-400"
                  : "text-[#8F99A8]"
            }`}
          >
            {voteCount}
          </span>

          <button
            onClick={handleDownvote}
            aria-label="Downvote comment"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              voteState === "down"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "text-[#8F99A8] hover:text-rose-400 hover:bg-[#0B0D11]"
            }`}
          >
            <ArrowDown className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Comment Content Column */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <CircleUserRound className="w-4 h-4 text-[#00D8F6]" />
            <span className="font-semibold text-white">{comment.author}</span>
            <span className="text-[#8F99A8]/60 font-bold">•</span>
            <span className="text-[#8F99A8]">{comment.time}</span>
          </div>

          <p className="text-xs sm:text-sm text-[#C4C9D4] leading-relaxed whitespace-pre-line">
            {comment.content}
          </p>

          {/* Reply Action Button */}
          {!isNested && (
            <div className="pt-1.5 flex items-center gap-2">
              <button
                onClick={() => setIsReplying((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isReplying
                    ? "bg-[#00D8F6]/15 text-[#00D8F6] border-[#00D8F6]/40 shadow-[0_0_10px_rgba(0,216,246,0.15)]"
                    : "bg-[#0B0D11] text-[#8F99A8] border-[#222834] hover:text-white hover:border-[#00D8F6]/40 hover:bg-[#161922]"
                }`}
              >
                <Reply className="w-3.5 h-3.5" />
                <span>{isReplying ? "Cancel Reply" : "Reply"}</span>
              </button>
            </div>
          )}

          {/* Inline Reply Form */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-2 space-y-2">
              <textarea
                rows={2}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to @${comment.author}...`}
                className="w-full bg-[#0B0D11] text-xs sm:text-sm text-white placeholder-[#8F99A8]/60 p-2.5 rounded-lg border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#0B0D11] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-1 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(0,216,246,0.25)] transition cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>
            </form>
          )}

          {/* Nested Replies Stream */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-3 sm:pl-4 border-l-2 border-[#222834] space-y-2.5">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isNested={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Post Details Page Main Component ─────────────────────────────────────────
export default function PostDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Query live post from backend API by ID
  const {
    data: apiPost,
    isLoading,
    error: apiError,
  } = useQuery({
    queryKey: POST_KEYS.post(id),
    queryFn: () => getPostByIdApi(id),
    retry: false,
  });

  // Fallbacks: passed navigation state or mockData for static testing
  const passedPost = location.state?.post;
  const fetchedMock = getPostByIdMock(id);
  const rawPost = apiPost || passedPost || fetchedMock;

  // Normalize post properties across API & mock structures
  const postId = rawPost?._id || rawPost?.id || id;
  const title = rawPost?.heading || rawPost?.title || `Post #${id}`;
  const content =
    rawPost?.description ||
    rawPost?.content ||
    "No additional text content provided for this post.";
  const author =
    rawPost?.user?.username ||
    rawPost?.author ||
    rawPost?.authorname ||
    "Community Member";
  const authorAvatar =
    rawPost?.user?.imageLink || rawPost?.authorAvatar || null;
  const subGroupName = rawPost?.group?.name
    ? rawPost.group.name.startsWith("g/")
      ? rawPost.group.name
      : `g/${rawPost.group.name}`
    : rawPost?.subGroup || rawPost?.community || "g/pcbuilders";
  const subGroupSlug = subGroupName.replace(/^g\//, "");
  const rawCreatedAt = rawPost?.createdAt || rawPost?.timestamp;
  const createdAt = rawCreatedAt
    ? isNaN(Date.parse(rawCreatedAt))
      ? rawCreatedAt
      : new Date(rawCreatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
    : "Recently";
  const sectionHeader =
    rawPost?.sectionHeader || rawPost?.previewSnippet || null;
  const image = rawPost?.imageLink || rawPost?.image || null;
  const initialVotes = rawPost?.upvotes ?? 1;

  // Determine post ownership
  const isOwner =
    rawPost?.isOwner ||
    (user &&
      (String(rawPost?.user?._id || rawPost?.user) ===
        String(user.id || user._id) ||
        author === user.username));

  // Subgroup Icon
  const SubIcon =
    COMMUNITY_ICON_MAP[subGroupName] ||
    COMMUNITY_ICON_MAP[subGroupSlug] ||
    Boxes;

  // Saved / Bookmark State with Optimistic Toggle
  const [isSaved, setIsSaved] = useState(Boolean(rawPost?.isSaved));
  const [prevRawPostSaved, setPrevRawPostSaved] = useState(rawPost?.isSaved);
  if (rawPost?.isSaved !== prevRawPostSaved) {
    setPrevRawPostSaved(rawPost?.isSaved);
    setIsSaved(Boolean(rawPost?.isSaved));
  }

  const handleToggleSave = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    try {
      await toggleSavePost(postId);
      queryClient.invalidateQueries({ queryKey: POST_KEYS.post(id) });
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (err) {
      setIsSaved(prevSaved);
      console.error("Failed to toggle save post:", err);
    }
  };

  // Voting state initialized from the post's vote count
  const [vote, setVote] = useState(null);
  const [voteCount, setVoteCount] = useState(initialVotes);

  const handleVote = (type) => {
    if (vote === type) {
      setVote(null);
      setVoteCount((prev) => (type === "up" ? prev - 1 : prev + 1));
    } else if (vote === null) {
      setVote(type);
      setVoteCount((prev) => (type === "up" ? prev + 1 : prev - 1));
    } else {
      setVote(type);
      setVoteCount((prev) => (type === "up" ? prev + 2 : prev - 2));
    }
  };

  // Comments state with nested replies support
  const [comments, setComments] = useState([
    {
      id: "comment-1",
      author: "HardwareFan",
      time: "2 hours ago",
      content: "Great share! Thanks for posting the breakdown and details.",
      upvotes: 4,
      replies: [
        {
          id: "reply-1",
          author: "SFF_Builder",
          time: "1 hour ago",
          content: "Agreed! That cable routing in particular is super clean.",
          upvotes: 2,
        },
      ],
    },
    {
      id: "comment-2",
      author: "RigMaster",
      time: "1 hour ago",
      content:
        "Clean aesthetics and great thermals. What paste compound did you use for the cooler mount?",
      upvotes: 2,
      replies: [],
    },
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  // Calculate total comments + replies count
  const totalCommentsCount =
    (rawPost?.commentsCount ?? 0) > 0
      ? rawPost.commentsCount
      : comments.reduce(
          (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
          0,
        );

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: user?.username || "You",
      time: "Just now",
      content: newCommentText.trim(),
      upvotes: 0,
      replies: [],
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const handleAddReply = (parentCommentId, replyContent) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      author: user?.username || "You",
      time: "Just now",
      content: replyContent,
      upvotes: 0,
    };

    setComments((prevComments) =>
      prevComments.map((c) => {
        if (c.id === parentCommentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      }),
    );
  };

  // Open Edit Modal with current values
  const handleOpenEdit = () => {
    setEditTitle(title);
    setEditContent(content);
    setEditImage(image || "");
    setEditError("");
    setIsEditOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsEditing(true);
    setEditError("");

    try {
      await updatePost(postId, {
        heading: editTitle.trim(),
        description: editContent.trim(),
        imageLink: editImage.trim(),
      });

      queryClient.invalidateQueries({ queryKey: POST_KEYS.post(id) });
      queryClient.invalidateQueries({ queryKey: POST_KEYS.feed() });
      setIsEditOpen(false);
    } catch (err) {
      setEditError(
        err.response?.data?.message || err.message || "Failed to update post.",
      );
    } finally {
      setIsEditing(false);
    }
  };

  // Handle Delete Submit
  const handleDeleteSubmit = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      await deletePost(postId);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsDeleteOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || err.message || "Failed to delete post.",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* EDIT POST MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0F1117] border border-[#222834] rounded-2xl p-6 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222834] pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00D8F6]/10 border border-[#00D8F6]/30 flex items-center justify-center text-[#00D8F6]">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    Edit Post
                  </h2>
                  <p className="text-xs text-[#8F99A8]">
                    Update your title, description, or image
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-[#8F99A8] hover:text-white hover:bg-[#161922] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
                  Title <span className="text-[#00D8F6]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#161922] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
                  Content
                </label>
                <textarea
                  rows={5}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-[#161922] text-sm text-white p-3.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8F99A8] mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#161922] text-sm text-white px-3.5 py-2.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222834]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  disabled={isEditing}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#161922] transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditing}
                  className="flex items-center gap-2 px-5 py-2 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-xl shadow-[0_0_14px_rgba(0,216,246,0.3)] active:scale-95 transition cursor-pointer disabled:opacity-50"
                >
                  {isEditing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => !isDeleting && setIsDeleteOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0F1117] border border-[#222834] rounded-2xl p-6 sm:p-7 shadow-2xl z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-bold text-white">Delete Post?</h2>
              <p className="text-xs text-[#8F99A8] leading-relaxed">
                Are you sure you want to permanently delete this post? This will
                also cascade delete all associated comments and saved bookmarks.
                This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#161922] transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-[0_0_14px_rgba(225,29,72,0.3)] active:scale-95 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
              {/* Back navigation button */}
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#161922] px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-[#222834]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>

              {/* LOADING STATE */}
              {isLoading && (
                <div className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
                  <div className="w-8 h-8 border-2 border-[#00D8F6] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-[#8F99A8]">Loading discussion...</p>
                </div>
              )}

              {/* 404 / ERROR / MISSING POST */}
              {!isLoading && !rawPost && (
                <div className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-white">
                      Post Not Found
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8F99A8] max-w-md mx-auto">
                      {apiError?.response?.data?.message ||
                        "This post might have been removed or does not exist."}
                    </p>
                  </div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-full shadow-[0_0_15px_rgba(0,216,246,0.3)] transition-all cursor-pointer"
                  >
                    <span>Return to Home Feed</span>
                  </Link>
                </div>
              )}

              {/* MAIN POST DETAILS CARD */}
              {!isLoading && rawPost && (
                <article className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl overflow-hidden flex flex-row shadow-xl select-none">
                  {/* Vote Column */}
                  <div className="w-14 sm:w-16 bg-[#0B0D11] border-r border-[#222834]/60 flex flex-col items-center py-4 px-2 shrink-0">
                    <button
                      onClick={() => handleVote("up")}
                      aria-label="Upvote post"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        vote === "up"
                          ? "bg-[#00D8F6] text-[#0B0D11] shadow-[0_0_14px_rgba(0,216,246,0.4)]"
                          : "text-[#8F99A8] hover:text-[#00D8F6] hover:bg-[#161922]"
                      }`}
                    >
                      <ArrowUp
                        className={`w-5 h-5 stroke-[2.5] ${
                          vote === "up" ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    <span
                      className={`text-xs sm:text-sm font-bold my-2 transition-colors ${
                        vote === "up"
                          ? "text-[#00D8F6]"
                          : vote === "down"
                            ? "text-rose-400"
                            : "text-[#8F99A8]"
                      }`}
                    >
                      {voteCount}
                    </span>

                    <button
                      onClick={() => handleVote("down")}
                      aria-label="Downvote post"
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        vote === "down"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                          : "text-[#8F99A8] hover:text-rose-400 hover:bg-[#161922]"
                      }`}
                    >
                      <ArrowDown className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Main Content Column */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col min-w-0">
                    {/* Metadata Header Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-[#8F99A8] mb-2.5">
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                        {/* Subgroup Badge */}
                        <Link
                          to={`/communities/${subGroupSlug}`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] text-white font-medium border border-[#222834] hover:border-[#00D8F6]/40 transition cursor-pointer"
                        >
                          <SubIcon className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-xs">{subGroupName}</span>
                        </Link>

                        <span className="text-[#8F99A8]/60 font-bold">•</span>

                        {/* Author */}
                        <div className="inline-flex items-center gap-1 cursor-pointer group">
                          {authorAvatar ? (
                            <img
                              src={authorAvatar}
                              alt={author}
                              className="w-4 h-4 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <CircleUserRound className="w-4 h-4 text-[#00D8F6]" />
                          )}
                          <span className="text-white font-semibold text-xs group-hover:text-[#00D8F6] transition">
                            {author}
                          </span>
                        </div>

                        <span className="text-[#8F99A8]/60 font-bold">•</span>

                        {/* Timestamp */}
                        <span className="text-[#8F99A8] text-xs">
                          {createdAt}
                        </span>
                      </div>

                      {/* Owner Actions (Edit & Delete) */}
                      {isOwner && (
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            onClick={handleOpenEdit}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#161922] border border-[#222834] text-[#8F99A8] hover:text-[#00D8F6] hover:border-[#00D8F6]/40 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setIsDeleteOpen(true)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#161922] border border-[#222834] text-[#8F99A8] hover:text-rose-400 hover:border-rose-500/40 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="text-base sm:text-xl font-bold text-white mb-2 leading-snug">
                      {title}
                    </h1>

                    {/* Body Content */}
                    <p className="text-xs sm:text-sm text-[#C4C9D4] leading-relaxed mb-3 whitespace-pre-line">
                      {content}
                    </p>

                    {/* Section Snippet / Specs Header */}
                    {sectionHeader && (
                      <div className="text-xs font-mono text-[#8F99A8] mb-3 bg-[#161922] border border-[#222834] rounded-xl p-3.5">
                        {sectionHeader}
                      </div>
                    )}

                    {/* Post Image */}
                    {image && (
                      <div className="rounded-xl overflow-hidden border border-[#222834] mb-3 max-h-[500px] bg-[#0B0D11]">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    {/* Divider Line */}
                    <div className="border-t border-[#222834] my-2" />

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5 sm:gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#8F99A8] font-semibold text-xs">
                          <MessageSquare className="w-4 h-4 stroke-[2]" />
                          <span>{totalCommentsCount} Comments</span>
                        </div>

                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(
                                window.location.href,
                              );
                              alert("Post link copied to clipboard!");
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#8F99A8] hover:text-white hover:bg-[#161922] font-semibold text-xs transition cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 stroke-[2]" />
                          <span>Share</span>
                        </button>

                        <button
                          onClick={handleToggleSave}
                          aria-label={isSaved ? "Remove from saved" : "Save post"}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
                            isSaved
                              ? "bg-[#00D8F6]/15 text-[#00D8F6] border border-[#00D8F6]/30 shadow-[0_0_10px_rgba(0,216,246,0.15)]"
                              : "text-[#8F99A8] hover:text-white hover:bg-[#161922]"
                          }`}
                        >
                          <Bookmark
                            className={`w-4 h-4 stroke-[2] ${isSaved ? "fill-current" : ""}`}
                          />
                          <span>{isSaved ? "Saved" : "Save"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* COMMENTS & DISCUSSION CARD */}
              {!isLoading && rawPost && (
                <section className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-[#222834] pb-3">
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#00D8F6]" />
                      <span>Discussion ({totalCommentsCount})</span>
                    </h2>
                  </div>

                  {/* Add Comment Input Form */}
                  <form onSubmit={handleAddComment} className="space-y-3">
                    <textarea
                      rows={3}
                      required
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Share your thoughts, advice, or feedback on this post..."
                      className="w-full bg-[#161922] text-xs sm:text-sm text-white placeholder-[#8F99A8]/60 p-3.5 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold rounded-xl shadow-[0_0_12px_rgba(0,216,246,0.25)] active:scale-95 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Comment</span>
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-3 pt-2">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onAddReply={handleAddReply}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
