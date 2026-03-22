// Profile page — read user + posts from storage (filter / map from Lab 5)

const guestEl = document.getElementById("profile-guest");
const panelEl = document.getElementById("profile-panel");

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
  }
}
