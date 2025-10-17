// utils/cryptoUtils.js
import CryptoJS from "crypto-js";

const SECRET_KEY = "your-very-strong-secret-key"; // store in env for production

export function encryptData(data) {
  const stringified = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
}

export function decryptData(ciphertext) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}


export function generateId(prefix = "id") {
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const randomHex = Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${randomHex}`;
}