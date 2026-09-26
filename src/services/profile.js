import api from "./api.js";

export async function getProfile() {
  return api.get("/api/profile");
}

export async function createProfile(profile) {
  return api.post("/api/profile", profile);
}

export async function updateProfile(profile) {
  return api.put("/api/profile", profile);
}

export async function deleteProfile() {
  return api.delete("/api/profile");
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/api/profile/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
