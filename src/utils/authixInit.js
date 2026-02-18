import { NeuctraAuthix } from "@neuctra/authix";
import toast from "react-hot-toast";

export const authix = new NeuctraAuthix({
  baseUrl: "https://server.authix.neuctra.com/api",
  apiKey: import.meta.env.VITE_AUTHIX_API_KEY,
  appId: import.meta.env.VITE_AUTHIX_APP_ID,
});

// -------------------- NOTES --------------------

export async function getAllNotes(userId) {
  try {
    const res = await authix.searchUserData({ userId, category: "note" });
    return res?.data || [];
  } catch (err) {
    console.error("Error fetching notes:", err);
    toast.error("Failed to load notes.");
    return [];
  }
}

export async function createNote(userId, newNote) {
  try {
    const noteData = {
      ...newNote,
      category: "note",
      createdAt: new Date().toISOString(),
    };
    const res = await authix.addUserData({
      userId,
      data: noteData,
      dataCategory: "note",
    });
    return res?.data || null;
  } catch (err) {
    console.error("Error creating note:", err);
    toast.error("Failed to save note.");
    return null;
  }
}

export async function getSingleNote(userId, noteId) {
  try {
    const res = await authix.getSingleUserData({ userId, dataId: noteId });
    return res?.data || null;
  } catch (err) {
    console.error("Error fetching note:", err);
    toast.error("Failed to load note.");
    return null;
  }
}

export async function updateNote(userId, noteId, updates) {
  try {
    const res = await authix.updateUserData({
      userId,
      dataId: noteId,
      data: { ...updates, updatedAt: new Date().toISOString() },
    });
    toast.success("Note updated!");
    return res?.data || null;
  } catch (err) {
    console.error("Error updating note:", err);
    toast.error("Failed to update note.");
    return null;
  }
}

export async function deleteNote(userId, noteId) {
  try {
    const res = await authix.deleteUserData({ userId, dataId: noteId });
    toast.success("Note deleted!");
    return res?.data || null;
  } catch (err) {
    console.error("Error deleting note:", err);
    toast.error("Failed to delete note.");
    return null;
  }
}

// -------------------- PACKAGE --------------------

export async function getPackage(userId) {
  try {
    const res = await authix.searchUserData({ userId, category: "package" });
    return res?.data?.[0] || null; // Return first package if exists
  } catch (err) {
    console.error("Error fetching package:", err);
    toast.error("Failed to load package.");
    return null;
  }
}

export async function createPackage(userId, packageData) {
  try {
    const dataToSave = {
      ...packageData,
      createdAt: new Date().toISOString(),
      usage: {
        notesUsed: 0,
        aiPromptsUsed: 0,
        lastReset: new Date().toISOString(),
      },
      aiPromptsPerDay: packageData.aiPromptsPerDay || 5,
    };
    const res = await authix.addUserData({
      userId,
      data: dataToSave,
      dataCategory: "package",
    });
    return res?.data || null;
  } catch (err) {
    console.error("Error creating package:", err);
    toast.error("Failed to create package.");
    return null;
  }
}

export async function updatePackage(userId, packageId, updates = {}) {
  try {
    const validId = typeof packageId === "object" ? packageId.id : packageId;
    if (!validId) throw new Error("Invalid packageId");

    const res = await authix.updateUserData({
      userId,
      dataId: validId,
      data: {
        ...updates,
        category: "package",
        updatedAt: new Date().toISOString(),
      },
    });
    toast.success("Package updated!");
    return res?.data || null;
  } catch (err) {
    console.error("Error updating package:", err);
    toast.error("Failed to update package.");
    return null;
  }
}

export async function updatePackageUsage(
  userId,
  type = "notes",
  increment = true,
) {
  try {
    const pkg = await getPackage(userId);
    if (!pkg) return null;

    // Reset daily if needed
    const now = new Date();
    const lastReset = pkg.usage?.lastReset
      ? new Date(pkg.usage.lastReset)
      : null;
    if (!lastReset || lastReset.toDateString() !== now.toDateString()) {
      pkg.usage = {
        notesUsed: 0,
        aiPromptsUsed: 0,
        lastReset: now.toISOString(),
      };
    }

    // Increment usage
    if (type === "notes") pkg.usage.notesUsed += increment ? 1 : -1;
    if (type === "ai") pkg.usage.aiPromptsUsed += increment ? 1 : -1;

    pkg.usage.notesUsed = Math.max(0, pkg.usage.notesUsed);
    pkg.usage.aiPromptsUsed = Math.max(0, pkg.usage.aiPromptsUsed);
    pkg.updatedAt = now.toISOString();

    await updatePackage(userId, pkg.id, {
      usage: pkg.usage,
      updatedAt: pkg.updatedAt,
    });
    return pkg;
  } catch (err) {
    console.error("Error updating package usage:", err);
    toast.error("Failed to update usage.");
    return null;
  }
}

export async function hasPackage(userId) {
  const pkg = await getPackage(userId);
  return !!pkg;
}
