import React, { useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  ArrowLeft,
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  CircleUserRound,
  Boxes,
  Send,
  Sparkles,
} from "lucide-react";

export default function PostDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Retrieve post data passed via navigation state, or construct a clean fallback template based on id
  const passedPost = location.state?.post;

  const post = {
    id: id || passedPost?.id || "unknown",
    title: passedPost?.title || `Post #${id}`,
    content: passedPost?.content || "No additional text content provided for this post.",
    author: passedPost?.author || passedPost?.authorname || "Community Member",
    authorAvatar: passedPost?.authorAvatar || null,
    subGroup: passedPost?.subGroup || passedPost?.community || "g/pcbuilders",
    subGroupSlug: (passedPost?.subGroup || passedPost?.community || "pcbuilders").replace(/^g\//, ""),
    createdAt: passedPost?.createdAt || passedPost?.timestamp || "Recently",
    hardwareTags: passedPost?.hardwareTags || [],
    sectionHeader: passedPost?.sectionHeader || passedPost?.previewSnippet || null,
    image: passedPost?.image || null,
    upvotes: passedPost?.upvotes ?? 1,
    commentsCount: passedPost?.commentsCount ?? passedPost?.comments ?? 0,
  };

  // Voting state initialized from the post's vote count
  const [vote, setVote] = useState(null);
  const [voteCount, setVoteCount] = useState(post.upvotes);

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

  // Comments state
  const [comments, setComments] = useState([
    {
      id: "comment-1",
      author: "HardwareFan",
      time: "2 hours ago",
      content: "Great share! Thanks for posting the breakdown and details.",
      upvotes: 4,
    },
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: "You",
      time: "Just now",
      content: newCommentText.trim(),
      upvotes: 1,
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-white flex flex-col font-sans">
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
            {/* Back button */}
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#8F99A8] hover:text-white hover:bg-[#161922] px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-[#222834]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            {/* MAIN POST DETAILS CARD */}
            <article className="rounded-2xl border border-[#222834] bg-[#0F1117] overflow-hidden shadow-xl">
              <div className="flex flex-col sm:flex-row">
                {/* Vote Column */}
                <div className="sm:w-16 bg-[#0B0D11] border-b sm:border-b-0 sm:border-r border-[#222834]/80 flex sm:flex-col items-center justify-between sm:justify-start py-3 sm:py-5 px-4 sm:px-2 shrink-0">
                  <button
                    onClick={() => handleVote("up")}
                    aria-label="Upvote post"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      vote === "up"
                        ? "bg-[#00D8F6] text-[#0B0D11] shadow-[0_0_14px_rgba(0,216,246,0.4)]"
                        : "text-[#8F99A8] hover:text-[#00D8F6] hover:bg-[#161922]"
                    }`}
                  >
                    <ArrowBigUp className="w-5 h-5" />
                  </button>

                  <span
                    className={`text-sm font-bold my-0 sm:my-2 ${
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
                    <ArrowBigDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Main Body */}
                <div className="flex-1 p-5 sm:p-7 min-w-0">
                  {/* Metadata Header */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-[#8F99A8] mb-3">
                    {/* Subgroup Badge */}
                    <Link
                      to={`/communities/${post.subGroupSlug}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] text-white font-medium border border-[#222834] hover:border-[#00D8F6]/40 transition"
                    >
                      <Boxes className="w-3.5 h-3.5 text-[#00D8F6]" />
                      <span>{post.subGroup}</span>
                    </Link>

                    <span className="text-[#8F99A8]/50">•</span>

                    {/* Author */}
                    <div className="inline-flex items-center gap-1.5 text-white font-semibold">
                      {post.authorAvatar ? (
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-4 h-4 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <CircleUserRound className="w-4 h-4 text-[#00D8F6]" />
                      )}
                      <span>{post.author}</span>
                    </div>

                    <span className="text-[#8F99A8]/50">•</span>

                    {/* Timestamp */}
                    <span>{post.createdAt}</span>

                    {/* Hardware Tags */}
                    {post.hardwareTags && post.hardwareTags.length > 0 && (
                      <>
                        {post.hardwareTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#00D8F6]/10 text-[#00D8F6] border border-[#00D8F6]/30 hidden sm:inline-block"
                          >
                            {tag}
                          </span>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-4">
                    {post.title}
                  </h1>

                  {/* Body Content */}
                  <p className="text-sm sm:text-base text-[#D1D5DB] leading-relaxed mb-5 whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Section Snippet / Specs Header */}
                  {post.sectionHeader && (
                    <div className="bg-[#161922] border border-[#222834] rounded-xl p-3.5 mb-5 font-mono text-xs text-[#8F99A8]">
                      {post.sectionHeader}
                    </div>
                  )}

                  {/* Post Image */}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden border border-[#222834] mb-5 max-h-[500px] bg-[#0B0D11]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#222834] text-xs text-[#8F99A8]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-semibold text-white">
                        <MessageSquare className="w-4 h-4 text-[#00D8F6]" />
                        {comments.length} Comments
                      </span>

                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Post link copied to clipboard!");
                          }
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#161922] transition cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>

                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-white hover:bg-[#161922] transition cursor-pointer">
                        <Bookmark className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* COMMENTS SECTION */}
            <section className="rounded-2xl border border-[#222834] bg-[#0F1117] p-5 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#222834] pb-4">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#00D8F6]" />
                  Discussion ({comments.length})
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
                  className="w-full bg-[#161922] text-sm text-white placeholder-[#8F99A8]/60 p-4 rounded-xl border border-[#222834] focus:border-[#00D8F6] focus:outline-none transition-all resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#00D8F6] hover:bg-[#00c4e0] text-[#0B0D11] text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_12px_rgba(0,216,246,0.25)] active:scale-95 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3.5 pt-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-xl bg-[#161922] border border-[#222834] space-y-2 hover:border-[#2A3142] transition"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CircleUserRound className="w-4 h-4 text-[#00D8F6]" />
                        <span className="font-bold text-white">
                          {comment.author}
                        </span>
                        <span className="text-[#8F99A8]/50">•</span>
                        <span className="text-[#8F99A8]">{comment.time}</span>
                      </div>

                      <span className="text-[11px] font-bold text-[#00D8F6]">
                        +{comment.upvotes}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#E5E7EB] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
