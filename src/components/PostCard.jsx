import {
  ArrowDown,
  ArrowUp,
  MessageSquare,
  Share2,
  CircleUserRound, 
  Boxes
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

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

export function PostCard({
  post = DEFAULT_POST,
}) {
  // Upvote state defaults to upvoted to match the provided mockup screenshot
  const [voteState, setVoteState] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(
    post.upvotes ?? DEFAULT_POST.upvotes,
  ); // fallback value

  const SubIcon = post.subGroupIcon || Boxes;

  // substact or add by 2 if down/up selcted. if not any selected just update by 1
  const handleUpvote = () => {
    if (voteState === "down") {
      setUpvoteCount((prev) => prev + 2);
    } else if (voteState === "up") {
      setUpvoteCount((prev) => prev - 1);
    } else {
      setUpvoteCount((prev) => prev + 1);
    }

    setVoteState(voteState === "up" ? null : "up");
  };

  const handleDownvote = () => {
    if (voteState === "up") {
      setUpvoteCount((prev) => prev - 2);
    } else if (voteState === "down") {
      setUpvoteCount((prev) => prev + 1);
    } else {
      setUpvoteCount((prev) => prev - 1);
    }

    setVoteState(voteState === "down" ? null : "down");
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
          <Link to={`/communities/${post.subGroup.replace('g/', '')}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] text-white font-medium border border-[#222834] hover:border-[#00D8F6]/40 transition cursor-pointer">
            <SubIcon className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-xs">{post.subGroup}</span>
          </Link>

          <span className="text-[#8F99A8]/60 font-bold">•</span>

          {/* AUTHOR INFO */}
          <div className="inline-flex items-center gap-1 cursor-pointer group">
            <CircleUserRound className="w-4 h-4 text-[#00D8F6]" />
            <span className="text-white font-semibold text-xs group-hover:text-[#00D8F6] transition">
              {post.authorname}
            </span>
          </div>

          <span className="text-[#8F99A8]/60 font-bold">•</span>

          {/* TIMESTAMP */}
          <span className="text-[#8F99A8] text-xs">{post.createdAt}</span>
        </div>

        {/* POST TITLE */}
        <h2 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug hover:text-[#00D8F6] transition cursor-pointer">
          {post.title}
        </h2>

        {/* CONTENT */}
        {post.content && (
          <p className="text-xs sm:text-sm text-[#C4C9D4] leading-relaxed mb-2">
            {post.content}
          </p>
        )}

        {/* PREVIEW SNIPPET */}
        {post.previewSnippet && (
          <div className="text-xs font-mono text-[#8F99A8] mb-3">
            {post.previewSnippet}
          </div>
        )}

        {/* DIVIDER LINE */}
        <div className="border-t border-[#222834] my-2" />

        {/* FOOTER ACTION BAR */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* LEFT ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#8F99A8] hover:text-white hover:bg-[#161922] font-semibold text-xs transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 stroke-[2]" />
              <span>{post.commentsCount ?? 0} Comments</span>
            </button>

            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#8F99A8] hover:text-white hover:bg-[#161922] font-semibold text-xs transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
