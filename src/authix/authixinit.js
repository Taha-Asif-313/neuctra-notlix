import { NeuctraAuthix } from "@neuctra/authix";
import { generateId } from "../utils/cryptoUtils";

const authix = new NeuctraAuthix({
  baseUrl: "https://server.authix.neuctra.com/api",
  apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",
  appId: "ba73c20458ba4be9f11dab081550a960",
});

// Small delay between requests
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 🔹 Ensure user data structure exists
 */
async function ensureUserData(userId) {
  await delay();

  let allData;
  try {
    allData = await authix.getUserData({ userId });
  } catch (err) {
    console.error("Failed to fetch user data:", err);
    allData = [];
  }

  // Handle different possible response shapes
  const userArray = Array.isArray(allData)
    ? allData
    : Array.isArray(allData?.data)
    ? allData.data
    : [];

  // Create default structure if none found
  if (userArray.length === 0) {
    const defaultData = { notes: [], package: { id: generateId() } };
    const created = await authix.addUserData({ userId, data: defaultData });
    return created;
  }

  return userArray[0];
}

/**
 * 🔹 Get all notes
 */
export async function getAllNotes(userId) {
  const userData = await ensureUserData(userId);
  return userData?.notes || [];
}

/**
 * 🔹 Create a new note
 */
export async function createNote(userId, newNote) {
  const userData = await ensureUserData(userId);
  const notes = userData?.notes || [];
  const updatedNotes = [...notes, { id: Date.now().toString(), ...newNote }];

  await authix.updateUserData({
    userId,
    dataId: userData.id,
    data: { ...userData.data, notes: updatedNotes },
  });

  return updatedNotes;
}

/**
 * 🔹 Get single note
 */
export async function getSingleNote(userId, noteId) {
  const userData = await ensureUserData(userId);
  return userData?.notes?.find((n) => n.id === noteId) || null;
}

/**
 * 🔹 Update note
 */
export async function updateNote(userId, noteId, updatedFields) {
  const userData = await ensureUserData(userId);
  const notes = userData?.notes || [];

  const updatedNotes = notes.map((n) =>
    n.id === noteId ? { ...n, ...updatedFields } : n
  );

  await authix.updateUserData({
    userId,
    dataId: userData.id,
    data: { ...userData.data, notes: updatedNotes },
  });

  return updatedNotes;
}

/**
 * 🔹 Delete note
 */
export async function deleteNote(userId, noteId) {
  const userData = await ensureUserData(userId);
  const updatedNotes = userData?.notes?.filter((n) => n.id !== noteId);

  await authix.updateUserData({
    userId,
    dataId: userData.id,
    data: { ...userData.data, notes: updatedNotes },
  });

  return updatedNotes;
}

/**
 * 🔹 Update package info
 */
export async function updatePackage(userId, packageData) {
  const userData = await ensureUserData(userId);

  await authix.updateUserData({
    userId,
    dataId: userData.id,
    data: { ...userData.data, package: packageData },
  });

  return packageData;
}

/**
 * 🔹 Get package info
 */
export async function getPackage(userId) {
  const userData = await ensureUserData(userId);
  return userData?.package || {};
}
