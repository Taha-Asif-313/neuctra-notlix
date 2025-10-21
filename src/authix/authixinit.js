import { NeuctraAuthix } from "@neuctra/authix";
import { generateId } from "../utils/cryptoUtils";
import toast from "react-hot-toast";

const authix = new NeuctraAuthix({
  baseUrl: "https://server.authix.neuctra.com/api",
  apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",
  appId: "ba73c20458ba4be9f11dab081550a960",
});

// Small delay between requests
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 🔹 Ensure user data structure exists (with verified check + proper errors)
 */
async function ensureUserData(userId) {
  await delay();

  let allData = [];
  try {
    allData = await authix.getUserData({ userId });
  } catch (err) {
    console.error("❌ Failed to fetch user data:", err);
    toast.error("Could not load your data. Please check your connection.");
    return null;
  }

  // Normalize response
  const userArray = Array.isArray(allData)
    ? allData
    : Array.isArray(allData?.data)
    ? allData.data
    : [];

  // If user has no data — try creating it
  if (userArray.length === 0) {
    const defaultData = { notes: [], package: { id: generateId() } };

    try {
      const created = await authix.addUserData({ userId, data: defaultData });
      return created;
    } catch (err) {
      console.error("❌ addUserData failed:", err);

      // Handle 403 specifically (unverified user)
      if (err.message?.includes("403") || err.message?.includes("Forbidden")) {
        toast.error("Please verify your email before using notes.");
      } else {
        toast.error("Unable to initialize your account data.");
      }

      return null;
    }
  }

  return userArray[0];
}

/**
 * 🔹 Get all notes
 */
export async function getAllNotes(userId) {
  const userData = await ensureUserData(userId);
  if (!userData) return [];
  return userData?.notes || [];
}

/**
 * 🔹 Create a new note
 */
export async function createNote(userId, newNote) {
  const userData = await ensureUserData(userId);
  if (!userData?.id) {
    toast.error("Your account data is missing. Please verify and retry.");
    return [];
  }

  const notes = userData?.notes || [];
  const updatedNotes = [...notes, { id: Date.now().toString(), ...newNote }];

  try {
    await authix.updateUserData({
      userId,
      dataId: userData.id,
      data: { ...userData.data, notes: updatedNotes },
    });

    toast.success("Note saved successfully!");
  } catch (err) {
    console.error("❌ Error updating notes:", err);
    toast.error("Failed to save note. Please try again later.");
  }

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
  if (!userData?.id) {
    toast.error("Cannot update note: missing user data.");
    return [];
  }

  const notes = userData?.notes || [];
  const updatedNotes = notes.map((n) =>
    n.id === noteId ? { ...n, ...updatedFields } : n
  );

  try {
    await authix.updateUserData({
      userId,
      dataId: userData.id,
      data: { ...userData.data, notes: updatedNotes },
    });
    toast.success("Note updated successfully!");
  } catch (err) {
    console.error("❌ Update failed:", err);
    toast.error("Failed to update note.");
  }

  return updatedNotes;
}

/**
 * 🔹 Delete note
 */
export async function deleteNote(userId, noteId) {
  const userData = await ensureUserData(userId);
  if (!userData?.id) {
    toast.error("Cannot delete note: missing user data.");
    return [];
  }

  const updatedNotes = userData?.notes?.filter((n) => n.id !== noteId);

  try {
    await authix.updateUserData({
      userId,
      dataId: userData.id,
      data: { ...userData.data, notes: updatedNotes },
    });
    toast.success("Note deleted successfully!");
  } catch (err) {
    console.error("❌ Delete failed:", err);
    toast.error("Failed to delete note.");
  }

  return updatedNotes;
}

/**
 * 🔹 Update package info
 */
export async function updatePackage(userId, packageData) {
  const userData = await ensureUserData(userId);
  if (!userData?.id) {
    toast.error("Cannot update package: missing user data.");
    return;
  }

  try {
    await authix.updateUserData({
      userId,
      dataId: userData.id,
      data: { ...userData.data, package: packageData },
    });
    toast.success("Package updated successfully!");
  } catch (err) {
    console.error("❌ Package update failed:", err);
    toast.error("Failed to update package.");
  }

  return packageData;
}

/**
 * 🔹 Get package info
 */
export async function getPackage(userId) {
  const userData = await ensureUserData(userId);
  return userData?.package || {};
}
