// Profile page — read user + posts from storage (filter / map from Lab 5)

const guestEl = document.getElementById("profile-guest");
const panelEl = document.getElementById("profile-panel");
const editBtn = document.getElementById("editProfileBtn");
const editTabEl = document.getElementById("editProfileTab");
const editFormEl = document.getElementById("editProfileForm");
const editUsernameEl = document.getElementById("edit-username");
const editEmailEl = document.getElementById("edit-email");
const editBioEl = document.getElementById("edit-bio");
const cancelEditBtn1 = document.getElementById("cancelEditBtn");
const cancelEditBtn2 = document.getElementById("cancelEditBtn2");

const appData = loadAppData();

if (appData.currentUserId === null || appData.currentUserId === "") {
  guestEl.classList.remove("hidden");
} else {
  const matches = appData.users.filter((u) => u.id === appData.currentUserId);
  if (matches.length === 0) {
    guestEl.textContent = "Could not load your profile.";
    guestEl.classList.remove("hidden");
  } else {
    const me = matches[0];

    document.getElementById("profile-username").textContent = me.username;
    document.getElementById("profile-email").textContent = me.email;
    document.getElementById("profile-bio").textContent =
      me.bio === "" ? "(No bio yet)" : me.bio;

    document.getElementById("stat-following").textContent =
      "Following: " + me.following.length;
    document.getElementById("stat-followers").textContent =
      "Followers: " + me.followers.length;

    const myPosts = appData.posts.filter((p) => p.userId === me.id);
    document.getElementById("stat-posts").textContent =
      "Posts: " + myPosts.length;

    const list = document.getElementById("profile-posts-list");
    if (myPosts.length === 0) {
      list.innerHTML = "<li>No posts yet.</li>";
    } else {
      list.innerHTML = myPosts
        .map((p) => {
          return `<li><span class="post-time">${p.timestamp}</span> — ${p.content}</li>`;
        })
        .join("");
    }

    panelEl.classList.remove("hidden");

    const closeEditTab = () => {
      editTabEl.classList.add("hidden");
    };

    const openEditTab = () => {
      editUsernameEl.value = me.username ?? "";
      editEmailEl.value = me.email ?? "";
      editBioEl.value = me.bio ?? "";
      editTabEl.classList.remove("hidden");
      // Simple UX: put cursor in username by default.
      editUsernameEl.focus();
    };

    editBtn.addEventListener("click", openEditTab);
    cancelEditBtn1.addEventListener("click", closeEditTab);
    cancelEditBtn2.addEventListener("click", closeEditTab);

    editFormEl.addEventListener("submit", (e) => {
      e.preventDefault();

      const newUsername = (editUsernameEl.value || "").trim();
      const newBio = (editBioEl.value || "").trim();

      if (newUsername.length === 0) {
        editUsernameEl.focus();
        return;
      }

      // Persist edits to the user object in app data.
      const userIndex = appData.users.findIndex((u) => u.id === me.id);
      if (userIndex === -1) return;

      appData.users[userIndex].username = newUsername;
      appData.users[userIndex].bio = newBio;

      // Save and update UI.
      saveAppData(appData);

      // Keep UI in sync with edited values.
      me.username = newUsername;
      me.bio = newBio;

      document.getElementById("profile-username").textContent = me.username;
      document.getElementById("profile-email").textContent = me.email;
      document.getElementById("profile-bio").textContent =
        me.bio === "" ? "(No bio yet)" : me.bio;

      closeEditTab();
    });
  }
}
