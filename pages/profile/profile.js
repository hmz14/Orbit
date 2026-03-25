// Profile page — hero layout + posts from storage (OrbitPosts)

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
const logoutBtn = document.getElementById("logoutBtn");
const navAvatarEl = document.getElementById("nav-avatar");
const heroAvatarEl = document.getElementById("profile-hero-avatar");
const profileHandleEl = document.getElementById("profile-handle");
const postsTitleEl = document.getElementById("profile-posts-title");

const PLACEHOLDER_AVATAR = "../../assets/images/profile.png";

function getAvatarSrc(user) {
  const pic = user && user.profilePicture ? user.profilePicture : "";
  if (!pic || pic.includes("default.png")) return PLACEHOLDER_AVATAR;
  if (pic.startsWith("images/")) return "../../assets/" + pic;
  if (pic.startsWith("assets/")) return "../../" + pic;
  return PLACEHOLDER_AVATAR;
}

function toHandle(username) {
  return "@" + (username || "").replace(/\s+/g, "").toLowerCase();
}

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

    function refreshHeader() {
      const avatarSrc = getAvatarSrc(me);
      heroAvatarEl.src = avatarSrc;
      heroAvatarEl.onerror = function () {
        heroAvatarEl.src = PLACEHOLDER_AVATAR;
      };

      if (navAvatarEl) {
        navAvatarEl.src = avatarSrc;
        navAvatarEl.classList.remove("hidden");
        navAvatarEl.onerror = function () {
          navAvatarEl.src = PLACEHOLDER_AVATAR;
        };
      }

      document.getElementById("profile-username").textContent = me.username;
      profileHandleEl.textContent = toHandle(me.username);
      document.getElementById("profile-email").textContent = me.email;
      document.getElementById("profile-bio").textContent =
        me.bio === "" ? "(No bio yet)" : me.bio;

      const following = Array.isArray(me.following) ? me.following.length : 0;
      const followers = Array.isArray(me.followers) ? me.followers.length : 0;

      document.getElementById("stat-following").textContent =
        "Following " + following;
      document.getElementById("stat-followers").textContent =
        "Followers " + followers;

      postsTitleEl.textContent = me.username + "'s Posts";
    }

    const list = document.getElementById("profile-posts-list");

    function renderMyPosts() {
      const myPosts = (appData.posts || []).filter((p) => p.userId === me.id);
      document.getElementById("stat-posts").textContent =
        "Posts " + myPosts.length;

      if (window.OrbitPosts && typeof window.OrbitPosts.initPostsList === "function") {
        window.OrbitPosts.initPostsList(list, {
          appData,
          posts: myPosts,
          showDelete: true,
          showCommentForm: true,
        });
        return;
      }

      if (myPosts.length === 0) {
        list.innerHTML = "<li class='orbit-empty'>No posts yet.</li>";
      } else {
        list.innerHTML = myPosts
          .map(
            (p) =>
              `<li><span class="orbit-post-time">${p.timestamp}</span> — ${p.content}</li>`
          )
          .join("");
      }
    }

    refreshHeader();
    renderMyPosts();

    panelEl.classList.remove("hidden");

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        appData.currentUserId = null;
        saveAppData(appData);
        window.location.href = "../login/login.html";
      });
    }

    const closeEditTab = () => {
      editTabEl.classList.add("hidden");
    };

    const openEditTab = () => {
      editUsernameEl.value = me.username ?? "";
      editEmailEl.value = me.email ?? "";
      editBioEl.value = me.bio ?? "";
      editTabEl.classList.remove("hidden");
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

      const userIndex = appData.users.findIndex((u) => u.id === me.id);
      if (userIndex === -1) return;

      appData.users[userIndex].username = newUsername;
      appData.users[userIndex].bio = newBio;

      saveAppData(appData);

      me.username = newUsername;
      me.bio = newBio;

      refreshHeader();
      closeEditTab();
      renderMyPosts();
    });
  }
}
