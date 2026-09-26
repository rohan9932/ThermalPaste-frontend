import api from "./api.js";

// Standard React Query Keys for posts
export const POST_KEYS = {
  feed: (params) => (params ? ["posts", "feed", params] : ["posts", "feed"]),
  post: (id) => ["posts", String(id)],
  group: (groupId, params) =>
    params ? ["posts", "group", String(groupId), params] : ["posts", "group", String(groupId)],
  saved: (params) => (params ? ["saved", params] : ["saved"]),
  reaction: (id) => ["posts", String(id), "reaction"],
};

// Fetch cross-group feed with pagination & privacy filtering
export async function getFeed(params = {}) {
  const response = await api.get("/api/posts", { params });
  const data = response.data?.data;
  const posts = data?.posts ?? [];
  posts.totalPosts = data?.totalPosts ?? posts.length;
  posts.totalPages = data?.totalPages ?? 1;
  posts.currentPage = data?.currentPage ?? 1;
  return posts;
}

// Fetch single post by ID (populated user, group, commentsCount, isSaved, isOwner)
export async function getPostById(id) {
  if (!id) return null;
  const response = await api.get(`/api/posts/${id}`);
  return response.data?.data?.post ?? null;
}

// Fetch feed of posts for a specific group (by Mongo ID or slug)
export async function getPostsByGroup(idOrName, params = {}) {
  if (!idOrName) return [];
  const cleanId = String(idOrName).replace(/^g\//, "");
  const response = await api.get(`/api/groups/${cleanId}/posts`, { params });
  const data = response.data?.data;
  const posts = data?.posts ?? [];
  posts.totalPosts = data?.totalPosts ?? posts.length;
  posts.totalPages = data?.totalPages ?? 1;
  posts.currentPage = data?.currentPage ?? 1;
  posts.group = data?.group ?? null;
  return posts;
}

// Create a new post
export async function createPost(postData) {
  const response = await api.post("/api/posts", postData);
  return response.data?.data?.post ?? response.data;
}

// Update existing post (owner only)
export async function updatePost(id, updates) {
  const response = await api.put(`/api/posts/${id}`, updates);
  return response.data?.data?.post ?? response.data;
}

// Delete post and cascade delete comments/votes/saved (owner only)
export async function deletePost(id) {
  const response = await api.delete(`/api/posts/${id}`);
  return response.data?.data ?? response.data;
}

// Toggle save/bookmark status of a post
export async function toggleSavePost(id) {
  const response = await api.post(`/api/posts/${id}/save`);
  return response.data?.data ?? response.data;
}

// React to a post ('upvote' | 'downvote')
export async function reactPost(id, reaction) {
  if (!id) return null;
  const response = await api.post(`/api/posts/${id}/react`, { reaction });
  return response.data?.data ?? response.data;
}

// Get reaction counts & current user reaction status for a post
export async function getPostReaction(id) {
  if (!id) return { reactCount: { upvote: 0, downvote: 0 }, userReaction: null };
  const response = await api.get(`/api/posts/${id}/react`);
  return response.data?.data ?? { reactCount: { upvote: 0, downvote: 0 }, userReaction: null };
}

// Fetch saved posts for currently logged-in user
export async function getSavedPosts(params = {}) {
  const response = await api.get("/api/saved", { params });
  const data = response.data?.data;
  const posts = data?.posts ?? [];
  posts.totalPosts = data?.totalPosts ?? posts.length;
  posts.totalPages = data?.totalPages ?? 1;
  posts.currentPage = data?.currentPage ?? 1;
  return posts;
}

// Fetch comments for a post (nested tree)
export async function getComments(postId) {
  if (!postId) return { comments: [], count: 0 };
  const response = await api.get(`/api/posts/${postId}/comments`);
  return response.data?.data ?? { comments: [], count: 0 };
}

// Create a comment or reply on a post
export async function createComment(postId, commentData) {
  const response = await api.post("/api/comments", { postId, ...commentData });
  return response.data?.data?.comment ?? response.data;
}

// Like/unlike a comment
export async function likeComment(commentId) {
  const response = await api.post(`/api/comments/${commentId}/like`);
  return response.data?.data?.comment ?? response.data;
}

// Vote on a comment (1 = upvote, -1 = downvote)
export async function voteComment(commentId, value) {
  const response = await api.post(`/api/comments/${commentId}/vote`, { value });
  return response.data?.data ?? response.data;
}

// Get vote counts for a comment
export async function getCommentVotes(commentId) {
  const response = await api.get(`/api/comments/${commentId}/votes`);
  return response.data?.data ?? {};
}

// Fetch comments by user
export async function getUserComments(userId, params = {}) {
  if (!userId) return { comments: [], count: 0 };
  const response = await api.get(`/api/comments/user/${userId}`, { params });
  return response.data?.data ?? { comments: [], count: 0 };
}
