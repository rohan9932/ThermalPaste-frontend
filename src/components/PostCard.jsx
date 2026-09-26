import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  MessageSquare,
  Share2,
  Bookmark,
  CircleUserRound,
  Boxes,
  Award,
} from "lucide-react";
import { COMMUNITY_ICON_MAP } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { toggleSavePost, reactPost } from "../services/posts";

const DEFAULT_POST = {
  id: "post-1",
  subGroup: "g/pcbuilders",
  authorname: "GamerGirlAria",
  createdAt: "Aug 15, 08:30 PM",
  title:
    "Finished my very first solo PC build! Rate my setup and cable management",
  content:
    "I've been playing on a potato laptop for 5 years and finally saved up enough to build my absolute dream rig!",
  previewSnippet: "### Specs:...",
  upvotes: 1,
  downvotes: 0,
  commentsCount: 4,
};

export function PostCard({ post = DEFAULT_POST }) {
  // Normalize post properties to support backend API and mock data seamlessly
  const postId = post._id || post.id || "post-1";
  const subGroupName = post.group?.name
    ? post.group.name.startsWith("g/")
      ? post.group.name
      : `g/${post.group.name}`
    : post.subGroup || post.community || "g/pcbuilders";
  const subGroupSlug = subGroupName.replace(/^g\//, "");
  const author =
    post.user?.username || post.authorname || post.author || "Community Member";
  const rawCreatedAt = post.createdAt || post.timestamp;
  const timestamp = rawCreatedAt
    ? isNaN(Date.parse(rawCreatedAt))
      ? rawCreatedAt
      : new Date(rawCreatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
    : "Recently";
  const title = post.heading || post.title || "Untitled Post";
  const content = post.description || post.content || "";
  const sectionSnippet = post.previewSnippet || post.sectionHeader || null;
  // Upvotes from backend reactCount (upvote) or mock upvotes fallback
  const initialVotes =
    post.reactCount?.upvote ??
    post.reactcount?.upvote ??
    post.upvotes ??
    DEFAULT_POST.upvotes;
  const initialVoteState =
    post.userReaction === "upvote"
      ? "up"
      : post.userReaction === "downvote"
      ? "down"
      : null;
  const commentsTotal = post.commentsCount ?? post.comments ?? 0;
  const image = post.imageLink || post.image || null;
  const authorAvatar = post.user?.imageLink || post.authorAvatar || null;
  const isPopularRig = post.isPopularRig || false;

  // Derive SubGroup Icon from centralized icon map
  const SubIcon =
    COMMUNITY_ICON_MAP[subGroupName] ||
    COMMUNITY_ICON_MAP[subGroupSlug] ||
    post.subGroupIcon ||
    Boxes;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(Boolean(post.isSaved));

  // Sync isSaved state if post prop changes
  const [prevPostSaved, setPrevPostSaved] = useState(post.isSaved);
  if (post.isSaved !== prevPostSaved) {
    setPrevPostSaved(post.isSaved);
    setIsSaved(Boolean(post.isSaved));
  }

  // Local voting state initialized with backend reaction status & count
  const [voteState, setVoteState] = useState(initialVoteState);
  const [upvoteCount, setUpvoteCount] = useState(initialVotes);

  // Sync voting state if post props update
  const [prevPostId, setPrevPostId] = useState(postId);
  const [prevPostUpvotes, setPrevPostUpvotes] = useState(initialVotes);
  const [prevPostReaction, setPrevPostReaction] = useState(post.userReaction);
  if (
    postId !== prevPostId ||
    initialVotes !== prevPostUpvotes ||
    post.userReaction !== prevPostReaction
  ) {
    setPrevPostId(postId);
    setPrevPostUpvotes(initialVotes);
    setPrevPostReaction(post.userReaction);
    setVoteState(initialVoteState);
    setUpvoteCount(initialVotes);
  }

  const handleUpvote = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const prevVote = voteState;
    const prevCount = upvoteCount;
    let nextCount = prevCount;
    let nextVote = voteState === "up" ? null : "up";

    if (voteState === "up") {
      nextCount = Math.max(0, prevCount - 1);
    } else {
      nextCount = prevCount + 1;
    }

    setVoteState(nextVote);
    setUpvoteCount(nextCount);

    try {
      const data = await reactPost(postId, "upvote");
      if (data?.reactCount) {
        setUpvoteCount(data.reactCount.upvote ?? data.reactcount?.upvote ?? nextCount);
        setVoteState(
          data.userReaction === "upvote"
            ? "up"
            : data.userReaction === "downvote"
            ? "down"
            : null
        );
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (err) {
      console.error("Failed to upvote post:", err);
      setVoteState(prevVote);
      setUpvoteCount(prevCount);
    }
  };

  const handleDownvote = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const prevVote = voteState;
    const prevCount = upvoteCount;
    let nextCount = prevCount;
    let nextVote = voteState === "down" ? null : "down";

    if (voteState === "up") {
      nextCount = Math.max(0, prevCount - 1);
    }

    setVoteState(nextVote);
    setUpvoteCount(nextCount);

    try {
      const data = await reactPost(postId, "downvote");
      if (data?.reactCount) {
        setUpvoteCount(data.reactCount.upvote ?? data.reactcount?.upvote ?? nextCount);
        setVoteState(
          data.userReaction === "upvote"
            ? "up"
            : data.userReaction === "downvote"
            ? "down"
            : null
        );
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (err) {
      console.error("Failed to downvote post:", err);
      setVoteState(prevVote);
      setUpvoteCount(prevCount);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/post/${postId}`,
      );
      alert("Post link copied to clipboard!");
    }
  };

  const handleToggleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const prevSaved = isSaved;
    setIsSaved(!prevSaved);

    try {
      await toggleSavePost(postId);
      queryClient.invalidateQueries({ queryKey: ["saved"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (err) {
      setIsSaved(prevSaved);
      console.error("Failed to toggle save post:", err);
    }
  };

  return (
    <div className="w-full bg-[#0F1117] border border-[#222834] rounded-2xl overflow-hidden flex flex-row transition-all duration-200 hover:border-[#2A3142] shadow-xl select-none">
      {/* VOTE COLUMN */}
      <div className="w-14 sm:w-16 bg-[#0B0D11] border-r border-[#222834]/60 flex flex-col items-center py-4 px-2 shrink-0">
        <button
          onClick={handleUpvote}
          aria-label="Upvote post"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            voteState === "up"
              ? "bg-[#00D8F6] text-[#0B0D11] shadow-[0_0_14px_rgba(0,216,246,0.4)]"
              : "text-[#8F99A8] hover:text-[#00D8F6] hover:bg-[#161922]"
          }`}
        >
          <ArrowUp
            className={`w-5 h-5 stroke-[2.5] ${
              voteState === "up" ? "fill-current" : ""
            }`}
          />
        </button>

        <span
          className={`text-xs sm:text-sm font-bold my-2 transition-colors ${
            voteState === "up"
              ? "text-[#00D8F6]"
              : voteState === "down"
                ? "text-rose-400"
                : "text-[#8F99A8]"
          }`}
        >
          {upvoteCount}
        </span>

        <button
          onClick={handleDownvote}
          aria-label="Downvote post"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            voteState === "down"
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              : "text-[#8F99A8] hover:text-rose-400 hover:bg-[#161922]"
          }`}
        >
          <ArrowDown className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col min-w-0">
        {/* HEADER ROW */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-[#8F99A8] mb-2.5">
          {/* SUBGROUP BADGE */}
          <Link
            to={`/communities/${subGroupSlug}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] text-white font-medium border border-[#222834] hover:border-[#00D8F6]/40 transition cursor-pointer"
          >
            <SubIcon className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-xs">{subGroupName}</span>
          </Link>

          <span className="text-[#8F99A8]/60 font-bold">•</span>

          {/* AUTHOR INFO */}
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

          {/* TIMESTAMP */}
          <span className="text-[#8F99A8] text-xs">{timestamp}</span>
        </div>

        {/* POST TITLE */}
        <Link
          to={`/post/${postId}`}
          state={{ post }}
          className="block"
        >
          <h2 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug hover:text-[#00D8F6] transition cursor-pointer">
            {title}
          </h2>
        </Link>

        {/* CONTENT */}
        {content && (
          <p className="text-xs sm:text-sm text-[#C4C9D4] leading-relaxed mb-2">
            {content}
          </p>
        )}

        {/* PREVIEW SNIPPET / SPECS HEADER */}
        {sectionSnippet && (
          <div className="text-xs font-mono text-[#8F99A8] mb-3 bg-[#161922] border border-[#222834] rounded-xl p-3">
            {sectionSnippet}
          </div>
        )}

        {/* OPTIONAL POST IMAGE */}
        {image && (
          <Link
            to={`/post/${postId}`}
            state={{ post }}
            className="block rounded-xl overflow-hidden border border-[#222834] mb-3 max-h-[400px]"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </Link>
        )}

        {/* DIVIDER LINE */}
        <div className="border-t border-[#222834] my-2" />

        {/* FOOTER ACTION BAR */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 pt-1 flex-wrap">
          {/* LEFT ACTIONS */}
          <div className="flex items-center gap-1 sm:gap-2.5 flex-wrap">
            <Link
              to={`/post/${postId}`}
              state={{ post }}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-[#8F99A8] hover:text-white hover:bg-[#161922] font-semibold text-xs transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 stroke-[2]" />
              <span>
                {commentsTotal} <span className="hidden sm:inline">Comments</span>
              </span>
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-[#8F99A8] hover:text-white hover:bg-[#161922] font-semibold text-xs transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
              <span className="hidden xs:inline">Share</span>
            </button>

            <button
              onClick={handleToggleSave}
              aria-label={isSaved ? "Remove from saved" : "Save post"}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
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

          {/* POPULAR RIG BADGE */}
          {isPopularRig && (
            <span className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
              <Award className="w-3 h-3" />
              Popular Rig
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostCard;
