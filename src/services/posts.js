import api from "./api.js";

// Standard React Query Keys for posts
export const POST_KEYS = {
  feed: (params) => (params ? ["posts", "feed", params] : ["posts", "feed"]),
  post: (id) => ["posts", String(id)],
  group: (groupId, params) =>
    params ? ["posts", "group", String(groupId), params] : ["posts", "group", String(groupId)],
  saved: (params) => (params ? ["saved", params] : ["saved"]),
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
