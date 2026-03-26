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
  const data = JSON.parse(saved);
  let dirty = false;

  // Sync profile pictures from seed (so updated PFP paths take effect).
  const seedUsersById = {};
  (SEED_USERS || []).forEach((u) => { seedUsersById[u.id] = u; });
  (data.users || []).forEach((u) => {
    const seed = seedUsersById[u.id];
    if (seed && seed.profilePicture && u.profilePicture !== seed.profilePicture) {
      u.profilePicture = seed.profilePicture;
      dirty = true;
    }
  });

  // Merge any new seed posts that don't exist yet in stored data.
  const existingIds = new Set((data.posts || []).map((p) => p.id));
  const newPosts = (SEED_POSTS || []).filter((p) => !existingIds.has(p.id));
  if (newPosts.length > 0) {
    data.posts = (data.posts || []).concat(newPosts);
    dirty = true;
  }

  if (dirty) saveAppData(data);
  return data;
}

function saveAppData(data) {
  localStorage.setItem(ORBIT_STORAGE_KEY, JSON.stringify(data));
}
