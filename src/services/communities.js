// services/communities.js
// Community service methods for interacting with communities backend API

export {
  getGroups as getCommunities,
  getGroupByIdOrName as getCommunityByIdOrName,
  createGroup as createCommunity,
  updateGroup as updateCommunity,
  joinGroup as joinCommunity,
  leaveGroup as leaveCommunity,
  getJoinRequests as getCommunityJoinRequests,
  handleJoinRequest as handleCommunityJoinRequest,
  getGroups,
  getGroupByIdOrName,
  createGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
  getJoinRequests,
  handleJoinRequest,
} from "./groups.js";
