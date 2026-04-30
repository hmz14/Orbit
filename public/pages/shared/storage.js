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

  const seedUsersById = {};
  (SEED_USERS || []).forEach((u) => { seedUsersById[u.id] = u; });
  (data.users || []).forEach((u) => {
    const seed = seedUsersById[u.id];
    if (seed && seed.profilePicture && u.profilePicture !== seed.profilePicture) {
      u.profilePicture = seed.profilePicture;
      dirty = true;
    }
  });

  const existingIds = (data.posts || []).map((p) => p.id);
  const newPosts = (SEED_POSTS || []).filter((p) => !existingIds.includes(p.id));
  if (newPosts.length > 0) {
    data.posts = (data.posts || []).concat(newPosts);
    dirty = true;
  }

  if (dirty) saveAppData(data);
  return data;
}

function saveAppData(data) {
  try {
    localStorage.setItem(ORBIT_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error("Error saving to localStorage", e);
    alert("Storage limit exceeded! Please try uploading a smaller image or deleting some posts.");
    return false;
  }
}
