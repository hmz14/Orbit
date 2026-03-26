// All app state lives exclusively in localStorage under this key.
// seed.js must be loaded before this file — it provides SEED_USERS and SEED_POSTS.
const ORBIT_STORAGE_KEY = "orbit-app-data";

function getDefaultAppData() {
  return { currentUserId: null, users: SEED_USERS, posts: SEED_POSTS };
}

function loadAppData() {
  const saved = localStorage.getItem(ORBIT_STORAGE_KEY);
  if (saved === null) {
    const fresh = getDefaultAppData();
    saveAppData(fresh);
    return fresh;
  }
  return JSON.parse(saved);
}

function saveAppData(data) {
  localStorage.setItem(ORBIT_STORAGE_KEY, JSON.stringify(data));
}
