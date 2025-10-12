import { NeuctraAuthix } from "@neuctra/authix";


// Initialize with your app credentials
const authix = new NeuctraAuthix({
  baseUrl: "https://authix.neuctra.com/api",  // Authix API URL
  apiKey: "850a8c32c35f008d28295f065526825a656af0a784ea7b0910fc2a1f748adda3",                // Get from Authix dashboard
  appId: "ba73c20458ba4be9f11dab081550a960"                   // Get from Authix dashboard
});

