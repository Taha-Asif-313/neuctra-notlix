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
 * 🔹 Get all notes
 */
export async function getAllNotes(userId) {
  const userData = await authix.getUserData({ userId });

  if (!userData) return [];
  return userData?.data || [];
}

/**
 * 🔹 Create and store a new note with category support
 */
export async function createNote(userId, newNote) {
  try {
    // 🧱 Ensure newNote has a category (fallback to "general")
    const noteData = {
      ...newNote,
      category: newNote.category || "note",
      createdAt: new Date().toISOString(),
    };

    // 🪶 Save the new note directly for this user
    const savedNote = await authix.addUserData({
      userId,
      data: noteData,
    });

    toast.success("Note saved successfully!");
    return savedNote;
  } catch (err) {
    console.error("❌ Error saving note:", err);
    toast.error("An error occurred while saving your note.");
    return null;
  }
}

/**
 * 📄 Get a single note for a user
 */
export async function getSingleNote(userId, noteId) {
  try {
    // 🔍 Fetch specific note data
    const res = await authix.getSingleUserData({
      userId,
      dataId: noteId,
    });

    console.log("✅ Specific note:", res?.data);

    // Return only the note data
    return res?.data || null;
  } catch (err) {
    console.error("❌ Failed to fetch note:", err);
    toast.error("Unable to load note. Please try again later.");
    return null;
  }
}

/**
 * ✏️ Update an existing note for a user
 */
export async function updateNote(userId, noteId, updatedFields) {
  try {
    // 🧱 Prepare updated data payload
    const updateData = {
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    // 🔄 Update the note on the server
    const res = await authix.updateUserData({
      userId,
      dataId: noteId,
      data: updateData,
    });

    console.log("✅ Note updated successfully:", res?.data);
    toast.success("Note updated successfully!");

    // Return only the response data
    return res?.data || null;
  } catch (err) {
    console.error("❌ Update failed:", err);
    toast.error("Failed to update note. Please try again later.");
    return null;
  }
}

/**
 * 🗑️ Delete a specific note for a user
 */
export async function deleteNote(userId, noteId) {
  try {
    // 🧱 Delete note directly from Authix
    const res = await authix.deleteUserData({
      userId,
      dataId: noteId,
    });

    console.log("✅ Data deleted successfully:", res?.data);
    toast.success("Note deleted successfully!");

    // Return only the API response data
    return res?.data || null;
  } catch (err) {
    console.error("❌ Delete failed:", err);
    toast.error("Failed to delete note. Please try again later.");
    return null;
  }
}

/**
 * 📦 Update (or create) a package with category support
 */
export async function updatePackage(userId, packageData) {
  try {
    // 🧱 Add category and timestamp
    const dataToSave = {
      ...packageData,
      category: packageData.category || "package",
      updatedAt: new Date().toISOString(),
    };

    // 🪶 Save package data
    const res = await authix.addUserData({
      userId,
      data: dataToSave,
    });

    console.log("✅ Package updated successfully:", res?.data);
    toast.success("Package updated successfully!");

    // Return only the response data
    return res?.data || null;

  } catch (err) {
    console.error("❌ Package update failed:", err);
    toast.error("Failed to update package. Please try again later.");
    return null;
  }
}


/**
 * 🔹 Get package info
 */
export async function getPackage(userId) {
  const userData = await ensureUserData(userId);
  return userData?.package || {};
}
