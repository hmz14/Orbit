const API = "";

// ---- DOM refs ----
const guestEl             = document.getElementById("profile-guest");
const usersModalEl        = document.getElementById("usersModal");
const usersModalTitleEl   = document.getElementById("usersModalTitle");
const usersModalListEl    = document.getElementById("usersModalList");
const usersModalCloseBtn  = document.getElementById("usersModalClose");
const statFollowingBtn    = document.getElementById("stat-following");
const statFollowersBtn    = document.getElementById("stat-followers");
const panelEl             = document.getElementById("profile-panel");
const editBtn             = document.getElementById("editProfileBtn");
const followBtn           = document.getElementById("followProfileBtn");
const editTabEl           = document.getElementById("editProfileTab");
const editFormEl          = document.getElementById("editProfileForm");
const editNameEl          = document.getElementById("edit-name");
const editUsernameEl      = document.getElementById("edit-username");
const editEmailEl         = document.getElementById("edit-email");
const editBioEl           = document.getElementById("edit-bio");
const editAvatarInput     = document.getElementById("edit-avatar-input");
const editAvatarPreview   = document.getElementById("edit-avatar-preview");
const cancelEditBtn1      = document.getElementById("cancelEditBtn");
const cancelEditBtn2      = document.getElementById("cancelEditBtn2");
const logoutBtn           = document.getElementById("logoutBtn");
const navAvatarEl         = document.getElementById("nav-avatar");
const navAvatarWrapEl     = document.getElementById("navAvatarWrap");
const navAvatarDropdown   = document.getElementById("navAvatarDropdown");
const heroAvatarEl        = document.getElementById("profile-hero-avatar");
const profileHandleEl     = document.getElementById("profile-handle");
const postsTitleEl        = document.getElementById("profile-posts-title");
const emailEl             = document.getElementById("profile-email");
const createPostSectionEl = document.getElementById("profile-create-post");
const pcpAvatarEl         = document.getElementById("pcp-avatar");
const pcpFormEl           = document.getElementById("profileCreatePostForm");
const pcpTextEl           = document.getElementById("profilePostText");
const pcpImagesEl         = document.getElementById("profilePostImages");
const pcpPreviewsEl       = document.getElementById("pcp-previews");

const PLACEHOLDER_AVATAR = "../../assets/images/profile.svg";

function getAvatarSrc(user) {
  const pic = user && user.profilePicture ? user.profilePicture : "";
  if (!pic || pic.includes("default.png")) return PLACEHOLDER_AVATAR;
  if (pic.startsWith("data:"))   return pic;
  if (pic.startsWith("images/")) return "../../assets/" + pic;
  if (pic.startsWith("assets/")) return "../../" + pic;
  return PLACEHOLDER_AVATAR;
}

function toHandle(username) {
  return "@" + (username || "").replace(/\s+/g, "").toLowerCase();
}

// ---- Session ----
const currentUserId = localStorage.getItem("orbit-uid")
  ? Number(localStorage.getItem("orbit-uid"))
  : null;

const urlParams  = new URLSearchParams(window.location.search);
const viewUserId = urlParams.get("userId") ? Number(urlParams.get("userId")) : null;
const profileId  = viewUserId || currentUserId;
const isOwnProfile = profileId === currentUserId;

// ---- State ----
let currentUser   = null;
let targetUser    = null;
let userPosts     = [];
let followingCount = 0;
let followerCount  = 0;
let isFollowing    = false;

// ---- Bootstrap ----
if (!currentUserId) {
  guestEl.classList.remove("hidden");
} else {
  loadProfile();
}

async function loadProfile() {
  try {
    const requests = [
      fetch(`${API}/api/users?id=${profileId}`),
      fetch(`${API}/api/posts?authorId=${profileId}`),
      fetch(`${API}/api/follow?followerId=${profileId}&count=true`),
      fetch(`${API}/api/follow?followingId=${profileId}&count=true`),
    ];

    if (!isOwnProfile) {
      requests.push(fetch(`${API}/api/users?id=${currentUserId}`));
      requests.push(fetch(`${API}/api/follow?followerId=${currentUserId}&followingId=${profileId}`));
    }

    const results = await Promise.all(requests);

    if (!results[0].ok) {
      guestEl.textContent = "User not found.";
      guestEl.classList.remove("hidden");
      return;
    }

    targetUser     = await results[0].json();
    userPosts      = results[1].ok ? await results[1].json() : [];
    const fcData   = results[2].ok ? await results[2].json() : {};
    const flData   = results[3].ok ? await results[3].json() : {};
    followingCount = fcData.followingCount || 0;
    followerCount  = flData.followerCount  || 0;

    if (isOwnProfile) {
      currentUser = targetUser;
    } else {
      currentUser = results[4] && results[4].ok ? await results[4].json() : null;
      const followData = results[5] && results[5].ok ? await results[5].json() : {};
      isFollowing = !!followData.isFollowing;
    }

    render();
  } catch (err) {
    console.error("Failed to load profile:", err);
    guestEl.textContent = "Failed to load profile. Is the server running?";
    guestEl.classList.remove("hidden");
  }
}

function render() {
  if (!targetUser) return;

  if (navAvatarEl && currentUser) {
    navAvatarEl.src = getAvatarSrc(currentUser);
    navAvatarEl.onerror = () => { navAvatarEl.src = PLACEHOLDER_AVATAR; };
  }
  if (navAvatarWrapEl) navAvatarWrapEl.classList.remove("hidden");

  refreshHeader();
  renderPosts();
  panelEl.classList.remove("hidden");

  if (isOwnProfile) {
    if (editBtn)              editBtn.classList.remove("hidden");
    if (followBtn)            followBtn.classList.add("hidden");
    if (createPostSectionEl)  createPostSectionEl.classList.remove("hidden");
    setupEditForm();
    setupCreatePost();
  } else {
    if (editBtn)             editBtn.classList.add("hidden");
    if (editTabEl)           editTabEl.classList.add("hidden");
    if (createPostSectionEl) createPostSectionEl.classList.add("hidden");
    setupFollowButton();
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("orbit-uid");
      window.location.href = "../login/login.html";
    });
  }

  setupUsersModal();
}

function refreshHeader() {
  heroAvatarEl.src = getAvatarSrc(targetUser);
  heroAvatarEl.onerror = () => { heroAvatarEl.src = PLACEHOLDER_AVATAR; };

  if (pcpAvatarEl && currentUser) {
    pcpAvatarEl.src = getAvatarSrc(currentUser);
    pcpAvatarEl.onerror = () => { pcpAvatarEl.src = PLACEHOLDER_AVATAR; };
  }

  document.getElementById("profile-username").textContent = targetUser.name || targetUser.username;
  profileHandleEl.textContent = toHandle(targetUser.username);

  if (emailEl) {
    emailEl.textContent   = isOwnProfile ? targetUser.email : "";
    emailEl.style.display = isOwnProfile ? "" : "none";
  }

  document.getElementById("profile-bio").textContent =
    (targetUser.bio || "").trim() ? targetUser.bio : "(No bio yet)";

  document.getElementById("stat-posts").textContent     = "Posts "     + userPosts.length;
  document.getElementById("stat-following").textContent = "Following " + followingCount;
  document.getElementById("stat-followers").textContent = "Followers " + followerCount;

  postsTitleEl.textContent =
    (isOwnProfile ? "Your" : targetUser.username + "'s") + " Posts";
}

async function renderPosts() {
  const list = document.getElementById("profile-posts-list");
  if (!list) return;

  if (window.OrbitPosts && typeof window.OrbitPosts.initPostsList === "function") {
    window.OrbitPosts.initPostsList(list, {
      currentUserId,
      posts: userPosts,
      showDelete: isOwnProfile,
      showCommentForm: true,
      cardIsView: true,
      onRefresh: async () => {
        const res = await fetch(`${API}/api/posts?authorId=${profileId}`);
        if (res.ok) {
          userPosts = await res.json();
          document.getElementById("stat-posts").textContent = "Posts " + userPosts.length;
        }
        return userPosts;
      },
      onDelete: async () => {
        const res = await fetch(`${API}/api/posts?authorId=${profileId}`);
        if (res.ok) userPosts = await res.json();
        document.getElementById("stat-posts").textContent = "Posts " + userPosts.length;
        renderPosts();
      },
    });
    return;
  }

  list.innerHTML = userPosts.length === 0
    ? "<li class='orbit-empty'>No posts yet.</li>"
    : userPosts.map((p) => `<li>${p.content}</li>`).join("");
}

// ---- Edit profile ----
function setupEditForm() {
  let pendingAvatarBase64 = null;

  const profileDropdownEl    = document.getElementById("profileDropdown");
  const dropdownEditProfile  = document.getElementById("dropdownEditProfile");
  const dropdownAnalysis     = document.getElementById("dropdownAnalysis");

  const closeAllDropdowns = () => {
    if (profileDropdownEl)  profileDropdownEl.classList.add("hidden");
    if (navAvatarDropdown)  navAvatarDropdown.classList.add("hidden");
  };

  const closeEditTab = () => {
    editTabEl.classList.add("hidden");
    pendingAvatarBase64 = null;
  };

  const openEditTab = () => {
    closeAllDropdowns();
    if (editNameEl)     editNameEl.value     = targetUser.name     || "";
    editUsernameEl.value = targetUser.username || "";
    editEmailEl.value    = targetUser.email    || "";
    editBioEl.value      = targetUser.bio      || "";
    if (editAvatarPreview) {
      editAvatarPreview.src = getAvatarSrc(targetUser);
      editAvatarPreview.onerror = () => { editAvatarPreview.src = PLACEHOLDER_AVATAR; };
    }
    pendingAvatarBase64 = null;
    editTabEl.classList.remove("hidden");
    editUsernameEl.focus();
  };

  const goToAnalysis = () => {
    closeAllDropdowns();
    window.location.href = `/statistics/my?userId=${profileId}`;
  };

  // Dots button on profile hero toggles dropdown
  if (editBtn && profileDropdownEl) {
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = profileDropdownEl.classList.contains("hidden");
      closeAllDropdowns();
      if (isHidden) profileDropdownEl.classList.remove("hidden");
    });
  }

  if (dropdownEditProfile) dropdownEditProfile.addEventListener("click", openEditTab);
  if (dropdownAnalysis)    dropdownAnalysis.addEventListener("click", goToAnalysis);

  // Nav-avatar click toggles its own dropdown
  if (navAvatarWrapEl && navAvatarDropdown) {
    navAvatarWrapEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = navAvatarDropdown.classList.contains("hidden");
      closeAllDropdowns();
      if (isHidden) navAvatarDropdown.classList.remove("hidden");
    });
  }

  const navEdit     = document.getElementById("navDropdownEditProfile");
  const navAnalysis = document.getElementById("navDropdownAnalysis");
  if (navEdit)     navEdit.addEventListener("click", openEditTab);
  if (navAnalysis) navAnalysis.addEventListener("click", goToAnalysis);

  // Close dropdowns when clicking outside
  document.addEventListener("click", closeAllDropdowns);

  if (cancelEditBtn1) cancelEditBtn1.addEventListener("click", closeEditTab);
  if (cancelEditBtn2) cancelEditBtn2.addEventListener("click", closeEditTab);

  if (editAvatarInput) {
    editAvatarInput.addEventListener("change", () => {
      const file = editAvatarInput.files && editAvatarInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let w = img.width, h = img.height;
          const MAX = 400;
          if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
          else if (h > MAX)     { w = Math.round((w * MAX) / h); h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          pendingAvatarBase64 = canvas.toDataURL("image/jpeg", 0.7);
          if (editAvatarPreview) editAvatarPreview.src = pendingAvatarBase64;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  editFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName     = (editNameEl     ? editNameEl.value     : "").trim();
    const newUsername = (editUsernameEl.value || "").trim();
    const newEmail    = (editEmailEl.value    || "").trim();
    const newBio      = (editBioEl.value      || "").trim();
    if (!newUsername) { editUsernameEl.focus(); return; }
    if (!newEmail)    { editEmailEl.focus();    return; }

    const body = { name: newName || null, username: newUsername, email: newEmail, bio: newBio };
    if (pendingAvatarBase64) body.profilePicture = pendingAvatarBase64;

    try {
      const res = await fetch(`${API}/api/users?id=${currentUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to update profile.");
        return;
      }

      targetUser = await res.json();
      currentUser = targetUser;
      if (navAvatarEl) navAvatarEl.src = getAvatarSrc(currentUser);
      refreshHeader();
      closeEditTab();
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Could not connect to server.");
    }
  });
}

// ---- Follow button (other user's profile) ----
function setupFollowButton() {
  if (!followBtn) return;
  followBtn.classList.remove("hidden");

  function updateFollowBtn() {
    followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
    followBtn.className   = "btn " + (isFollowing ? "btn-secondary" : "btn-primary") + " profile-follow-btn";
  }

  updateFollowBtn();

  followBtn.addEventListener("click", async () => {
    try {
      if (isFollowing) {
        await fetch(`${API}/api/follow?followerId=${currentUserId}&followingId=${profileId}`, {
          method: "DELETE",
        });
        isFollowing = false;
        followerCount = Math.max(0, followerCount - 1);
      } else {
        await fetch(`${API}/api/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: currentUserId, followingId: profileId }),
        });
        isFollowing = true;
        followerCount++;
      }
      updateFollowBtn();
      refreshHeader();
    } catch (err) {
      console.error("Follow action failed:", err);
    }
  });
}

// ---- Create post (own profile) ----
function setupCreatePost() {
  if (!pcpFormEl) return;

  let pendingPostImages = [];

  function renderPostImagePreviews() {
    if (!pcpPreviewsEl) return;
    pcpPreviewsEl.innerHTML = "";
    pendingPostImages.forEach((src, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "pcp-preview-wrap";

      const img = document.createElement("img");
      img.src = src; img.className = "pcp-preview-img"; img.alt = "preview";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button"; removeBtn.className = "pcp-preview-remove"; removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => {
        pendingPostImages.splice(idx, 1);
        renderPostImagePreviews();
      });

      wrap.appendChild(img); wrap.appendChild(removeBtn);
      pcpPreviewsEl.appendChild(wrap);
    });
  }

  if (pcpImagesEl) {
    pcpImagesEl.addEventListener("change", () => {
      const files = pcpImagesEl.files;
      if (!files) return;
      const remaining = 4 - pendingPostImages.length;
      let added = 0;
      for (let i = 0; i < files.length; i++) {
        if (added >= remaining) break;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let w = img.width, h = img.height;
            const MAX = 800;
            if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
            else if (h > MAX)     { w = Math.round((w * MAX) / h); h = MAX; }
            canvas.width = w; canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            pendingPostImages.push(canvas.toDataURL("image/jpeg", 0.7));
            renderPostImagePreviews();
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(files[i]);
        added++;
      }
      pcpImagesEl.value = "";
    });
  }

  pcpFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = (pcpTextEl ? pcpTextEl.value : "").trim();
    if (!text && pendingPostImages.length === 0) return;

    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text || "(shared an image)",
          authorId: currentUserId,
          images: pendingPostImages.length > 0 ? pendingPostImages : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      if (pcpTextEl) pcpTextEl.value = "";
      pendingPostImages = [];
      renderPostImagePreviews();

      const postsRes = await fetch(`${API}/api/posts?authorId=${profileId}`);
      if (postsRes.ok) userPosts = await postsRes.json();
      document.getElementById("stat-posts").textContent = "Posts " + userPosts.length;
      renderPosts();
    } catch (err) {
      console.error("Create post failed:", err);
      alert("Failed to create post.");
    }
  });
}

// ---- Following / Followers modal ----
function setupUsersModal() {
  function openUsersModal(title, users, showUnfollow) {
    usersModalTitleEl.textContent = title;
    renderModalList(users, showUnfollow);
    usersModalEl.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeUsersModal() {
    usersModalEl.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function renderModalList(users, showUnfollow) {
    usersModalListEl.innerHTML = "";

    if (!users || users.length === 0) {
      const empty = document.createElement("li");
      empty.className = "users-modal-empty";
      empty.textContent = "No users yet.";
      usersModalListEl.appendChild(empty);
      return;
    }

    users.forEach((u) => {
      const li = document.createElement("li");
      li.className = "users-modal-item";

      const avatar = document.createElement("img");
      avatar.className = "users-modal-avatar";
      avatar.alt = u.username;
      avatar.src = getAvatarSrc(u);
      avatar.onerror = () => { avatar.src = PLACEHOLDER_AVATAR; };

      const info = document.createElement("div");
      info.className = "users-modal-info";

      const name = document.createElement("span");
      name.className = "users-modal-name";
      name.textContent = u.name || u.username;

      const handle = document.createElement("span");
      handle.className = "users-modal-handle";
      handle.textContent = toHandle(u.username);

      info.appendChild(name);
      info.appendChild(handle);
      li.appendChild(avatar);
      li.appendChild(info);

      li.addEventListener("click", () => {
        closeUsersModal();
        const url = new URL("../profile/profile.html", window.location.href);
        url.searchParams.set("userId", u.id);
        window.location.href = url.toString();
      });

      if (showUnfollow) {
        const unfollowBtn = document.createElement("button");
        unfollowBtn.type = "button";
        unfollowBtn.className = "modal-unfollow-btn";
        unfollowBtn.textContent = "Unfollow";

        unfollowBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          try {
            await fetch(`${API}/api/follow?followerId=${currentUserId}&followingId=${u.id}`, {
              method: "DELETE",
            });
            followingCount = Math.max(0, followingCount - 1);
            refreshHeader();
            // Re-fetch following and re-render modal
            const res = await fetch(`${API}/api/follow?followerId=${profileId}`);
            if (res.ok) {
              const follows = await res.json();
              const users = follows.map((f) => f.following);
              renderModalList(users, true);
            }
          } catch (err) {
            console.error("Unfollow failed:", err);
          }
        });

        li.appendChild(unfollowBtn);
      }

      usersModalListEl.appendChild(li);
    });
  }

  if (statFollowingBtn) {
    statFollowingBtn.addEventListener("click", async () => {
      const res = await fetch(`${API}/api/follow?followerId=${profileId}`);
      if (res.ok) {
        const follows = await res.json();
        const users = follows.map((f) => f.following);
        openUsersModal("Following", users, isOwnProfile);
      }
    });
  }

  if (statFollowersBtn) {
    statFollowersBtn.addEventListener("click", async () => {
      const res = await fetch(`${API}/api/follow?followingId=${profileId}`);
      if (res.ok) {
        const follows = await res.json();
        const users = follows.map((f) => f.follower);
        openUsersModal("Followers", users, false);
      }
    });
  }

  if (usersModalCloseBtn) usersModalCloseBtn.addEventListener("click", closeUsersModal);
  if (usersModalEl) {
    usersModalEl.addEventListener("click", (e) => {
      if (e.target === usersModalEl) closeUsersModal();
    });
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeUsersModal();
  });
}
