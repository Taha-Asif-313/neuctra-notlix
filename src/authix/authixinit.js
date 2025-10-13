import { NeuctraAuthix } from "@neuctra/authix";

// Initialize with your app credentials
const authix = new NeuctraAuthix({
  baseUrl: "https://server.authix.neuctra.com/api", // Authix API URL
  apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3", // Get from Authix dashboard
  appId: "ba73c20458ba4be9f11dab081550a960", // Get from Authix dashboard
});

export async function createNote(userId, noteData) {
  return await authix.addUserData({
    userId: userId,
    data: noteData,
  });
}

export async function getSingleNote(userId, noteId) {
  return await authix.getSingleUserData({
    userId: userId,
    dataId: noteId,
  });
}

export async function getAllNotes(userId) {
  return await authix.getUserData({ userId });
}

export async function getNote(userId, noteId) {
  return await authix.getSingleUserData({
    userId: userId,
    dataId: noteId,
  });
}

export async function updateNote(userId, noteId, noteData) {
  return await authix.updateUserData({
    userId: userId,
    dataId: noteId,
    data: noteData,
  });
}

export async function deleteNote(userId, noteId) {
  return await authix.deleteUserData({
    userId: userId,
    dataId: noteId,
  });
}
