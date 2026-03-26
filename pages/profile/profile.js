
const guestEl             = document.getElementById("profile-guest");
const usersModalEl        = document.getElementById("usersModal");
const usersModalTitleEl   = document.getElementById("usersModalTitle");
const usersModalListEl    = document.getElementById("usersModalList");
const usersModalCloseBtn  = document.getElementById("usersModalClose");
const statFollowingBtn    = document.getElementById("stat-following");
const statFollowersBtn    = document.getElementById("stat-followers");
const panelEl            = document.getElementById("profile-panel");
const editBtn            = document.getElementById("editProfileBtn");
const followBtn          = document.getElementById("followProfileBtn");
const editTabEl          = document.getElementById("editProfileTab");
const editFormEl         = document.getElementById("editProfileForm");
const editUsernameEl     = document.getElementById("edit-username");
const editEmailEl        = document.getElementById("edit-email");
const editBioEl          = document.getElementById("edit-bio");
const editAvatarInput    = document.getElementById("edit-avatar-input");
const editAvatarPreview  = document.getElementById("edit-avatar-preview");
const cancelEditBtn1     = document.getElementById("cancelEditBtn");
const cancelEditBtn2     = document.getElementById("cancelEditBtn2");
const logoutBtn          = document.getElementById("logoutBtn");
const navAvatarEl        = document.getElementById("nav-avatar");
const heroAvatarEl       = document.getElementById("profile-hero-avatar");
const profileHandleEl    = document.getElementById("profile-handle");
const postsTitleEl       = document.getElementById("profile-posts-title");
const emailEl            = document.getElementById("profile-email");
const createPostSectionEl = document.getElementById("profile-create-post");
const pcpAvatarEl        = document.getElementById("pcp-avatar");
const pcpFormEl          = document.getElementById("profileCreatePostForm");
const pcpTextEl          = document.getElementById("profilePostText");
const pcpImagesEl        = document.getElementById("profilePostImages");
const pcpPreviewsEl      = document.getElementById("pcp-previews");

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

const appData = loadAppData();

const urlParams  = new URLSearchParams(window.location.search);
const viewUserId = urlParams.get("userId");

if (!appData.currentUserId) {
  guestEl.classList.remove("hidden");
} else {
  const me = appData.users.find((u) => u.id === appData.currentUserId);

  if (!me) {
    guestEl.textContent = "Could not load your profile.";
    guestEl.classList.remove("hidden");
  } else {
    const isOwnProfile = !viewUserId || viewUserId === appData.currentUserId;
    const targetUser   = isOwnProfile
      ? me
      : appData.users.find((u) => u.id === viewUserId);

    if (!targetUser) {
      guestEl.textContent = "User not found.";
      guestEl.classList.remove("hidden");
    } else {
      if (navAvatarEl) {
        navAvatarEl.src    = getAvatarSrc(me);
        navAvatarEl.classList.remove("hidden");
        navAvatarEl.onerror = function () { navAvatarEl.src = PLACEHOLDER_AVATAR; };
      }

      function refreshHeader() {
        const avatarSrc = getAvatarSrc(targetUser);
        heroAvatarEl.src    = avatarSrc;
        heroAvatarEl.onerror = function () { heroAvatarEl.src = PLACEHOLDER_AVATAR; };

        if (pcpAvatarEl) {
          pcpAvatarEl.src    = getAvatarSrc(me);
          pcpAvatarEl.onerror = function () { pcpAvatarEl.src = PLACEHOLDER_AVATAR; };
        }

        document.getElementById("profile-username").textContent = targetUser.username;
        profileHandleEl.textContent = toHandle(targetUser.username);

        if (emailEl) {
          emailEl.textContent   = isOwnProfile ? targetUser.email : "";
          emailEl.style.display = isOwnProfile ? "" : "none";
        }

      document.getElementById("profile-bio").textContent =
          (targetUser.bio || "").trim() ? targetUser.bio : "(No bio yet)";

        const following = Array.isArray(targetUser.following) ? targetUser.following.length : 0;
        const followers = Array.isArray(targetUser.followers) ? targetUser.followers.length : 0;

        document.getElementById("stat-following").textContent = "Following " + following;
        document.getElementById("stat-followers").textContent = "Followers " + followers;

        postsTitleEl.textContent =
          (isOwnProfile ? "Your" : targetUser.username + "'s") + " Posts";
    }

    const list = document.getElementById("profile-posts-list");

      function renderPosts() {
        const userPosts = (appData.posts || []).filter((p) => p.userId === targetUser.id);
        document.getElementById("stat-posts").textContent = "Posts " + userPosts.length;

      if (window.OrbitPosts && typeof window.OrbitPosts.initPostsList === "function") {
        window.OrbitPosts.initPostsList(list, {
          appData,
            posts: userPosts,
            showDelete: isOwnProfile,
          showCommentForm: true,
          cardIsView: true,
        });
        return;
      }

        list.innerHTML = userPosts.length === 0
          ? "<li class='orbit-empty'>No posts yet.</li>"
          : userPosts
              .map((p) => `<li><span class="orbit-post-time">${p.timestamp}</span> — ${p.content}</li>`)
          .join("");
    }

    refreshHeader();
      renderPosts();
    panelEl.classList.remove("hidden");

      if (isOwnProfile) {
        if (editBtn)   editBtn.classList.remove("hidden");
        if (followBtn) followBtn.classList.add("hidden");

        
        if (createPostSectionEl) createPostSectionEl.classList.remove("hidden");

        let pendingAvatarBase64 = null; 

    const closeEditTab = () => {
      editTabEl.classList.add("hidden");
          pendingAvatarBase64 = null;
    };

    const openEditTab = () => {
      editUsernameEl.value = me.username ?? "";
          editEmailEl.value    = me.email    ?? "";
          editBioEl.value      = me.bio      ?? "";
          if (editAvatarPreview) {
            editAvatarPreview.src    = getAvatarSrc(me);
            editAvatarPreview.onerror = function () { editAvatarPreview.src = PLACEHOLDER_AVATAR; };
          }
          pendingAvatarBase64 = null;
      editTabEl.classList.remove("hidden");
      editUsernameEl.focus();
    };

    editBtn.addEventListener("click", openEditTab);
    cancelEditBtn1.addEventListener("click", closeEditTab);
    cancelEditBtn2.addEventListener("click", closeEditTab);

        if (editAvatarInput) {
          editAvatarInput.addEventListener("change", () => {
            const file = editAvatarInput.files && editAvatarInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              pendingAvatarBase64 = e.target.result;
              if (editAvatarPreview) editAvatarPreview.src = pendingAvatarBase64;
            };
            reader.readAsDataURL(file);
          });
        }

    editFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const newUsername = (editUsernameEl.value || "").trim();
          const newBio      = (editBioEl.value      || "").trim();
          if (!newUsername) { editUsernameEl.focus(); return; }

          const idx = appData.users.findIndex((u) => u.id === me.id);
          if (idx === -1) return;

          appData.users[idx].username = newUsername;
          appData.users[idx].bio      = newBio;
          if (pendingAvatarBase64) {
            appData.users[idx].profilePicture = pendingAvatarBase64;
          }
      saveAppData(appData);

      me.username = newUsername;
          me.bio      = newBio;
          if (pendingAvatarBase64) me.profilePicture = pendingAvatarBase64;

          if (navAvatarEl) navAvatarEl.src = getAvatarSrc(me);

      refreshHeader();
      closeEditTab();
          renderPosts();
        });

        let pendingPostImages = [];

        function renderPostImagePreviews() {
          if (!pcpPreviewsEl) return;
          pcpPreviewsEl.innerHTML = "";
          pendingPostImages.forEach((src, idx) => {
            const wrap = document.createElement("div");
            wrap.className = "pcp-preview-wrap";

            const img = document.createElement("img");
            img.src = src;
            img.className = "pcp-preview-img";
            img.alt = "preview";

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "pcp-preview-remove";
            removeBtn.textContent = "×";
            removeBtn.addEventListener("click", () => {
              pendingPostImages.splice(idx, 1);
              renderPostImagePreviews();
            });

            wrap.appendChild(img);
            wrap.appendChild(removeBtn);
            pcpPreviewsEl.appendChild(wrap);
          });
        }

        if (pcpImagesEl) {
          pcpImagesEl.addEventListener("change", () => {
            const files     = Array.from(pcpImagesEl.files);
            const remaining = 4 - pendingPostImages.length;
            const toAdd     = files.slice(0, remaining);

            const readers = toAdd.map(
              (file) =>
                new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = (ev) => resolve(ev.target.result);
                  reader.readAsDataURL(file);
                })
            );

            Promise.all(readers).then((results) => {
              pendingPostImages = pendingPostImages.concat(results);
              renderPostImagePreviews();
              pcpImagesEl.value = "";
            });
          });
        }

        if (pcpFormEl) {
          pcpFormEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = (pcpTextEl ? pcpTextEl.value : "").trim();
            if (!text && pendingPostImages.length === 0) return;

            const newPost = {
              id:        "p_" + Date.now().toString(36),
              userId:    me.id,
              content:   text,
              images:    pendingPostImages.slice(),
              timestamp: new Date().toISOString(),
              likes:     [],
              comments:  [],
            };

            if (!Array.isArray(appData.posts)) appData.posts = [];
            appData.posts.push(newPost);
            saveAppData(appData);

            if (pcpTextEl) pcpTextEl.value = "";
            pendingPostImages = [];
            renderPostImagePreviews();
            renderPosts();
          });
        }

      } else {
        if (editBtn)              editBtn.classList.add("hidden");
        if (editTabEl)            editTabEl.classList.add("hidden");
        if (createPostSectionEl)  createPostSectionEl.classList.add("hidden");

        if (followBtn) {
          followBtn.classList.remove("hidden");

          function updateFollowBtn() {
            const iFollow = Array.isArray(me.following) && me.following.includes(targetUser.id);
            followBtn.textContent = iFollow ? "Unfollow" : "Follow";
            followBtn.className   =
              "btn " + (iFollow ? "btn-secondary" : "btn-primary") + " profile-follow-btn";
          }

          updateFollowBtn();

          followBtn.addEventListener("click", () => {
            if (!Array.isArray(me.following))         me.following = [];
            if (!Array.isArray(targetUser.followers)) targetUser.followers = [];

            const iFollow = me.following.includes(targetUser.id);
            if (iFollow) {
              me.following         = me.following.filter((id) => id !== targetUser.id);
              targetUser.followers = targetUser.followers.filter((id) => id !== me.id);
            } else {
              me.following.push(targetUser.id);
              targetUser.followers.push(me.id);
            }

            const meIdx     = appData.users.findIndex((u) => u.id === me.id);
            const targetIdx = appData.users.findIndex((u) => u.id === targetUser.id);
            if (meIdx     !== -1) appData.users[meIdx]     = me;
            if (targetIdx !== -1) appData.users[targetIdx] = targetUser;

            saveAppData(appData);
            updateFollowBtn();
            refreshHeader();
          });
        }
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          appData.currentUserId = null;
          saveAppData(appData);
          window.location.href = "../login/login.html";
        });
      }

      const PLACEHOLDER_MODAL = "../../assets/images/profile.svg";

      function openUsersModal(title, userIds, showUnfollow) {
        usersModalTitleEl.textContent = title;

        function renderModalList(ids) {
          usersModalListEl.innerHTML = "";
          const users = ids.map((id) => appData.users.find((u) => u.id === id)).filter(Boolean);

          if (users.length === 0) {
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
            avatar.onerror = function () { avatar.src = PLACEHOLDER_MODAL; };

            const info = document.createElement("div");
            info.className = "users-modal-info";

            const name = document.createElement("span");
            name.className = "users-modal-name";
            name.textContent = u.username;

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

              unfollowBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                if (!Array.isArray(me.following))   me.following = [];
                if (!Array.isArray(u.followers))    u.followers  = [];

                me.following = me.following.filter((id) => id !== u.id);
                u.followers  = u.followers.filter((id) => id !== me.id);

                const meIdx = appData.users.findIndex((x) => x.id === me.id);
                const uIdx  = appData.users.findIndex((x) => x.id === u.id);
                if (meIdx !== -1) appData.users[meIdx] = me;
                if (uIdx  !== -1) appData.users[uIdx]  = u;

                saveAppData(appData);
                refreshHeader();

                renderModalList(me.following);
              });

              li.appendChild(unfollowBtn);
            }

            usersModalListEl.appendChild(li);
          });
        }

        renderModalList(userIds);
        usersModalEl.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }

      function closeUsersModal() {
        usersModalEl.classList.add("hidden");
        document.body.style.overflow = "";
      }

      if (statFollowingBtn) {
        statFollowingBtn.addEventListener("click", () => {
          const ids = Array.isArray(targetUser.following) ? targetUser.following : [];
          openUsersModal("Following", ids, isOwnProfile);
        });
      }

      if (statFollowersBtn) {
        statFollowersBtn.addEventListener("click", () => {
          const ids = Array.isArray(targetUser.followers) ? targetUser.followers : [];
          openUsersModal("Followers", ids, false);
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
  }
}
