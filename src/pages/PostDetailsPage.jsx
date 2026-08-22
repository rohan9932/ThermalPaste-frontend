import React, { useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
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
} from "lucide-react";

// ─── Comment Item Sub-Component ───────────────────────────────────────────────
// Renders an individual comment with independent upvote/downvote controls & score.
function CommentItem({ comment }) {
  const [voteState, setVoteState] = useState(null);
  const [voteCount, setVoteCount] = useState(comment.upvotes ?? 0);

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

  return (
    <div className="p-4 rounded-xl bg-[#161922] border border-[#222834] flex gap-3.5 hover:border-[#2A3142] transition">
      {/* Vote Controls Column for Comment */}
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

      {/* Comment Content Area */}
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
      </div>
    </div>
  );
}

// ─── Post Details Page Main Component ─────────────────────────────────────────
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
    {
      id: "comment-2",
      author: "RigMaster",
      time: "1 hour ago",
      content: "Clean aesthetics and great thermals. What paste compound did you use for the cooler mount?",
      upvotes: 2,
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
      upvotes: 0,
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

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

              {/* MAIN POST DETAILS CARD */}
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
                  <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-[#8F99A8] mb-2.5">
                    {/* Subgroup Badge */}
                    <Link
                      to={`/communities/${post.subGroupSlug}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] text-white font-medium border border-[#222834] hover:border-[#00D8F6]/40 transition cursor-pointer"
                    >
                      <Boxes className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-xs">{post.subGroup}</span>
                    </Link>

                    <span className="text-[#8F99A8]/60 font-bold">•</span>

                    {/* Author */}
                    <div className="inline-flex items-center gap-1 cursor-pointer group">
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
                      <span className="text-white font-semibold text-xs group-hover:text-[#00D8F6] transition">
                        {post.author}
                      </span>
                    </div>

                    <span className="text-[#8F99A8]/60 font-bold">•</span>

                    {/* Timestamp */}
                    <span className="text-[#8F99A8] text-xs">{post.createdAt}</span>

                    {/* Hardware Tag Badges */}
                    {post.hardwareTags && post.hardwareTags.length > 0 && (
                      <>
                        {post.hardwareTags.map((tag, i) => (
                          <React.Fragment key={i}>
                            <span className="text-[#8F99A8]/60 font-bold">•</span>
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded border text-[10px] font-mono font-semibold"
                              style={{
                                backgroundColor: "#00D8F610",
                                borderColor: "#00D8F630",
                                color: "#00D8F6",
                              }}
                            >
                              {tag}
                            </span>
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-base sm:text-xl font-bold text-white mb-2 leading-snug">
                    {post.title}
                  </h1>

                  {/* Body Content */}
                  <p className="text-xs sm:text-sm text-[#C4C9D4] leading-relaxed mb-3 whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Section Snippet / Specs Header */}
                  {post.sectionHeader && (
                    <div className="text-xs font-mono text-[#8F99A8] mb-3 bg-[#161922] border border-[#222834] rounded-xl p-3.5">
                      {post.sectionHeader}
                    </div>
                  )}

                  {/* Post Image */}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden border border-[#222834] mb-3 max-h-[500px] bg-[#0B0D11]">
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

                  {/* Divider Line */}
                  <div className="border-t border-[#222834] my-2" />

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#8F99A8] font-semibold text-xs">
                        <MessageSquare className="w-4 h-4 stroke-[2]" />
                        <span>{comments.length} Comments</span>
                      </div>

                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Post link copied to clipboard!");
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#8F99A8] hover:text-white hover:bg-[#161922] font-semibold text-xs transition cursor-pointer"
                      >
                        <Share2 className="w-4 h-4 stroke-[2]" />
                        <span>Share</span>
                      </button>

                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#8F99A8] hover:text-white hover:bg-[#161922] font-semibold text-xs transition cursor-pointer">
                        <Bookmark className="w-4 h-4 stroke-[2]" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* COMMENTS & DISCUSSION CARD */}
              <section className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-[#222834] pb-3">
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00D8F6]" />
                    <span>Discussion ({comments.length})</span>
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
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
