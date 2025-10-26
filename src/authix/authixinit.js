import { NeuctraAuthix } from "@neuctra/authix";
import { generateId } from "../utils/cryptoUtils";
import toast from "react-hot-toast";

export const authix = new NeuctraAuthix({
  baseUrl: "https://server.authix.neuctra.com/api",
  apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",
  appId: "ba73c20458ba4be9f11dab081550a960",
});

// 🕒 Add delay before API calls
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/* 📝 NOTES FUNCTIONS */
/* -------------------------------------------------------------------------- */

export async function getAllNotes(userId) {
  try {
    await delay();
    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];

    if (!Array.isArray(allData) || allData.length === 0) return [];

    const notes = allData.filter(
      (item) => item?.category?.toLowerCase() === "note"
    );

    console.log(`Found ${notes.length} notes for user.`);
    return notes;
  } catch (err) {
    console.error("Error fetching notes:", err);
    toast.error("Failed to load your notes.");
    return [];
  }
}

export async function createNote(userId, newNote) {
  try {
    await delay();
    const noteData = {
      ...newNote,
      category: newNote.category || "note",
      createdAt: new Date().toISOString(),
    };

    const savedNote = await authix.addUserData({ userId, data: noteData });
    return savedNote;
  } catch (err) {
    console.error("❌ Error saving note:", err);
    toast.error("An error occurred while saving your note.");
    return null;
  }
}

export async function getSingleNote(userId, noteId) {
  try {
    await delay();
    const res = await authix.getSingleUserData({ userId, dataId: noteId });
    console.log("✅ Specific note:", res?.data);
    return res?.data || null;
  } catch (err) {
    console.error("❌ Failed to fetch note:", err);
    toast.error("Unable to load note.");
    return null;
  }
}

export async function updateNote(userId, noteId, updatedFields) {
  try {
    await delay();
    const updateData = {
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    };

    const res = await authix.updateUserData({
      userId,
      dataId: noteId,
      data: updateData,
    });

    console.log("✅ Note updated successfully:", res?.data);
    toast.success("Note updated successfully!");
    return res?.data || null;
  } catch (err) {
    console.error("❌ Update failed:", err);
    toast.error("Failed to update note.");
    return null;
  }
}

export async function deleteNote(userId, noteId) {
  try {
    await delay();
    const res = await authix.deleteUserData({ userId, dataId: noteId });
    console.log("✅ Data deleted successfully:", res?.data);
    toast.success("Note deleted successfully!");
    return res?.data || null;
  } catch (err) {
    console.error("❌ Delete failed:", err);
    toast.error("Failed to delete note.");
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* 📦 PACKAGE FUNCTIONS */
/* -------------------------------------------------------------------------- */

export async function createPackage(userId, packageData) {
  try {
    await delay();
    const dataToSave = {
      ...packageData,
      category: packageData.category || "package",
      createdAt: new Date().toISOString(),
      usage: {
        notesUsed: 0,
        aiPromptsUsed: 0,
        lastReset: new Date().toISOString(),
      },
      aiPromptsPerDay: packageData.aiPromptsPerDay || 5,
    };

    const res = await authix.addUserData({ userId, data: dataToSave });
    console.log("✅ Package created:", res?.data);
    return res?.data || null;
  } catch (err) {
    console.error("❌ Package creation failed:", err);
    toast.error("Failed to create package.");
    return null;
  }
}

export async function updatePackage(userId, packageId, updatedData = {}) {
  try {
    await delay();

    // Ensure valid object
    const safeData = typeof updatedData === "object" && updatedData !== null ? updatedData : {};

    const dataToUpdate = {
      ...safeData,
      category: safeData.category || "package",
      updatedAt: new Date().toISOString(),
    };

    // ✅ If packageId is an object, extract the .id
    const validDataId = typeof packageId === "object" ? packageId.id : packageId;

    if (!validDataId) {
      throw new Error("Invalid packageId provided to updatePackage()");
    }

    const res = await authix.updateUserData({
      userId,
      dataId: validDataId,
      data: dataToUpdate,
    });

    console.log("✅ Package updated:", res?.data);
    toast.success("Package updated successfully!");
    return res?.data || null;
  } catch (err) {
    console.error("❌ Package update failed:", err);
    toast.error("Failed to update package.");
    return null;
  }
}



export async function checkPackage(userId) {
  try {
    await delay();
    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];

    if (!Array.isArray(allData) || allData.length === 0) return false;

    const hasPackage = allData.some(
      (item) => item?.category?.toLowerCase() === "package"
    );

    console.log("📦 Package found:", hasPackage);
    return hasPackage;
  } catch (err) {
    console.error("❌ Error checking package:", err);
    toast.error("Failed to check user package.");
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* 🔁 PACKAGE USAGE & DAILY RESET */
/* -------------------------------------------------------------------------- */

export async function updatePackageUsage(userId, type = "notes", action = "increment") {
  try {
    await delay();

    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];
    const packageItem = allData.find(
      (item) => item?.category?.toLowerCase() === "package"
    );

    if (!packageItem) return;

    const now = new Date();
    const lastReset = packageItem?.usage?.lastReset
      ? new Date(packageItem.usage.lastReset)
      : null;

    // 🗓️ If a new day started — reset usage
    if (
      !lastReset ||
      now.getDate() !== lastReset.getDate() ||
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear()
    ) {
      console.log("🕓 New day detected — resetting AI usage.");
      packageItem.usage = {
        notesUsed: packageItem.usage?.notesUsed ?? 0,
        aiPromptsUsed: 0, // reset daily
        lastReset: now.toISOString(),
      };
    }

    const usage = {
      ...packageItem.usage,
      notesUsed: packageItem.usage?.notesUsed ?? 0,
      aiPromptsUsed: packageItem.usage?.aiPromptsUsed ?? 0,
    };

    // 🔢 Increment usage safely
    if (type === "notes")
      usage.notesUsed = Math.max(0, usage.notesUsed + (action === "increment" ? 1 : -1));

    if (type === "ai")
      usage.aiPromptsUsed = Math.max(0, usage.aiPromptsUsed + (action === "increment" ? 1 : -1));

    const updatedPackage = {
      ...packageItem,
      usage,
      updatedAt: new Date().toISOString(),
    };

    await authix.updateUserData({
      userId,
      dataId: packageItem.id,
      data: updatedPackage,
    });

    console.log(`✅ ${action === "increment" ? "Increased" : "Decreased"} ${type} usage.`);
    return updatedPackage;
  } catch (err) {
    console.error("❌ Failed to update package usage:", err);
  }
}

/* -------------------------------------------------------------------------- */
/* 📦 GET PACKAGE */
/* -------------------------------------------------------------------------- */

export async function getPackage(userId) {
  try {
    await delay();
    if (!userId) {
      console.warn("❌ getPackage: Missing userId");
      return null;
    }

    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];
    if (!Array.isArray(allData) || allData.length === 0) return null;

    const pkg = allData.find(
      (item) => item?.category?.toLowerCase() === "package"
    );

    if (!pkg) {
      console.log("⚠️ No package found.");
      return null;
    }

    console.log("📦 Package retrieved successfully:", pkg);
    return pkg;
  } catch (err) {
    console.error("❌ Error fetching package:", err);
    toast.error("Failed to load package.");
    return null;
  }
}
