import api from "./api.js";

// Fetch all groups with optional search and category filters
export async function getGroups(params = {}) {
  const response = await api.get("/api/groups", { params });
  return response.data?.data?.groups ?? [];
}

// Fetch single group by MongoDB _id or name slug
export async function getGroupByIdOrName(idOrName) {
  if (!idOrName) return null;
  const response = await api.get(`/api/groups/${idOrName}`);
  return response.data?.data?.group ?? null;
}

// Create a new group (creator becomes first member)
export async function createGroup(groupData) {
  const response = await api.post("/api/groups", groupData);
  return response.data?.data?.group ?? response.data;
}

// Update group settings (creator only)
export async function updateGroup(id, updates) {
  const response = await api.patch(`/api/groups/${id}`, updates);
  return response.data?.data?.group ?? response.data;
}

// Join a public group immediately or submit a private group request
export async function joinGroup(id) {
  const response = await api.post(`/api/groups/${id}/join`);
  return response.data?.data ?? response.data;
}

// Leave a group
export async function leaveGroup(id) {
  const response = await api.post(`/api/groups/${id}/leave`);
  return response.data?.data ?? response.data;
}

// View pending join requests (creator only)
export async function getJoinRequests(id) {
  const response = await api.get(`/api/groups/${id}/requests`);
  return response.data?.data?.requests ?? [];
}

// Accept or reject a user's join request (creator only)
export async function handleJoinRequest(id, userId, action) {
  const response = await api.patch(`/api/groups/${id}/requests/${userId}`, {
    action,
  });
  return response.data?.data ?? response.data;
}
