// src/utils/getImageUrl.js
export const getImageUrl = (profilePic) => {
  if (!profilePic) return null;

  // If it's already a full Cloudinary URL
  if (profilePic.startsWith("http") || profilePic.startsWith("https")) {
    return profilePic;
  }

  // Otherwise, it's local (during development)
  return `${import.meta.env.VITE_SERVER_URL}/uploads/${profilePic}`;
};
