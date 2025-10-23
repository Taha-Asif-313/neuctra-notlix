import { NeuctraAuthix } from "@neuctra/authix";
import { generateId } from "../utils/cryptoUtils";
import toast from "react-hot-toast";

export const authix = new NeuctraAuthix({
  baseUrl: "https://server.authix.neuctra.com/api",
  apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",
  appId: "ba73c20458ba4be9f11dab081550a960",
});

// Small delay between requests
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 📝 Get all notes (filtered by category)
 */
export async function getAllNotes(userId) {
  try {
    // 🔹 Fetch all user data
    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];

    if (!Array.isArray(allData) || allData.length === 0) {
      console.log("No user data found for this user.");
      return [];
    }

    // 🔍 Filter only items where category = "note"
    const notes = allData.filter(
      (item) => item?.category?.toLowerCase() === "note"
    );

    console.log(`Found ${notes.length} notes for user.`);
    return notes;
  } catch (err) {
    console.error("Error fetching notes:", err);
    toast.error("Failed to load your notes. Please try again later.");
    return [];
  }
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
 * 📦 Create a new package with category support
 */
export async function createPackage(userId, packageData) {
  try {
    // 🧱 Prepare package with category and timestamp
    const dataToSave = {
      ...packageData,
      category: packageData.category || "package",
      createdAt: new Date().toISOString(),
    };

    // 🪶 Create new package
    const res = await authix.addUserData({
      userId,
      data: dataToSave,
    });

    console.log("✅ Package created:", res?.data);
    toast.success("Package created successfully!");
    return res?.data || null;
  } catch (err) {
    console.error("❌ Package creation failed:", err);
    toast.error("Failed to create package. Please try again later.");
    return null;
  }
}

/**
 * ✏️ Update an existing package
 */
export async function updatePackage(userId, packageId, updatedData) {
  try {
    // 🧱 Prepare updated data with category and timestamp
    const dataToUpdate = {
      ...updatedData,
      category: updatedData.category || "package",
      updatedAt: new Date().toISOString(),
    };

    // 🔄 Update the existing package (not create new)
    const res = await authix.updateUserData({
      userId,
      dataId: packageId,
      data: dataToUpdate,
    });

    console.log("✅ Package updated:", res?.data);
    toast.success("Package updated successfully!");
    return res?.data || null;
  } catch (err) {
    console.error("❌ Package update failed:", err);
    toast.error("Failed to update package. Please try again later.");
    return null;
  }
}

/**
 * 🧩 Check if user already has a package
 * Returns true if a package with category "package" exists
 */
export async function checkPackage(userId) {
  try {
    // 🔹 Fetch all user data
    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];

    if (!Array.isArray(allData) || allData.length === 0) {
      console.log("📭 No user data found for this user.");
      return false;
    }

    // 🔍 Check for any item with category "package"
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



/**
 * 🔄 Increment or decrement package usage (notes or AI prompts)
 */
export async function updatePackageUsage(userId, type = "notes", action = "increment") {
  try {
    // 🔹 Fetch all user data
    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];
    console.log("📦 All user data:", allData);

    // 🔍 Find the existing package
    const packageItem = allData.find(
      (item) => item?.category?.toLowerCase() === "package"
    );

    console.log("📦 Found package:", packageItem);

    if (!packageItem) {
      console.warn("⚠️ No package found for user:", userId);
      return;
    }

    // ✅ Ensure usage object exists
    const usage = {
      notesUsed: packageItem?.usage?.notesUsed ?? 0,
      aiPromptsUsed: packageItem?.usage?.aiPromptsUsed ?? 0,
    };

    // 🔢 Update counters safely
    if (type === "notes") {
      usage.notesUsed = Math.max(
        0,
        usage.notesUsed + (action === "increment" ? 1 : -1)
      );
    }

    if (type === "ai") {
      usage.aiPromptsUsed = Math.max(
        0,
        usage.aiPromptsUsed + (action === "increment" ? 1 : -1)
      );
    }

    console.log("🧮 Updated usage:", usage);

    // 🧱 Merge updated usage into full package
    const updatedPackage = {
      ...packageItem,
      usage,
      updatedAt: new Date().toISOString(),
    };

    // ✅ Save updated package (not just usage)
    await authix.updateUserData({
      userId,
      dataId: packageItem.id,
      data: updatedPackage,
    });

    console.log(
      `✅ ${action === "increment" ? "Increased" : "Decreased"} ${type} usage.`,
      updatedPackage
    );

    return updatedPackage;
  } catch (err) {
    console.error("❌ Failed to update package usage:", err);
  }
}



/**
 * 📦 Get user package info
 */
export async function getPackage(userId) {
  try {
    // 🔹 Validate
    if (!userId) {
      console.warn("❌ getPackage: Missing userId");
      return null;
    }

    // 🔹 Fetch all user data
    const res = await authix.getUserData({ userId });
    const allData = res?.data || [];

    if (!Array.isArray(allData) || allData.length === 0) {
      console.log("No data found for this user.");
      return null;
    }

    // 🔍 Find the package entry
    const pkg = allData.find(
      (item) => item?.category?.toLowerCase() === "package"
    );

    if (!pkg) {
      console.log("⚠️ No package found for this user.");
      return null;
    }

    console.log("📦 Package retrieved successfully:", pkg);
    return pkg;
  } catch (err) {
    console.error("❌ Error fetching package:", err);
    toast.error("Failed to load package. Please try again later.");
    return null;
  }
}

