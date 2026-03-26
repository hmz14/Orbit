(function () {
  const appData = loadAppData();

  if (!appData.currentUserId) {
    window.location.href = "../login/login.html";
    return;
  }

  const currentUser = (appData.users || []).find((u) => u.id === appData.currentUserId);
  if (!currentUser) {
    window.location.href = "../login/login.html";
    return;
  }

  const logoutBtn          = document.getElementById("logoutBtn");
  const createPostForm     = document.getElementById("createPostForm");
  const createPostText     = document.getElementById("createPostText");
  const createPostImages   = document.getElementById("createPostImages");
  const cpImagePreviews    = document.getElementById("cp-image-previews");
  const meAvatarEl         = document.getElementById("me-avatar");
  const aboutAvatarEl   = document.getElementById("about-avatar");
  const aboutNameEl     = document.getElementById("about-name");
  const aboutHandleEl   = document.getElementById("about-handle");
  const aboutBioEl      = document.getElementById("about-bio");
  const peopleListEl    = document.getElementById("peopleList");
  const followingListEl = document.getElementById("followingList");
  const feedPostsListEl = document.getElementById("feed-posts-list");
  const peopleViewMoreBtn = document.getElementById("peopleViewMoreBtn");
  const peopleMoreTabEl = document.getElementById("peopleMoreTab");
  const peopleMoreCloseBtn = document.getElementById("peopleMoreCloseBtn");
  const peopleMoreSearchEl = document.getElementById("peopleMoreSearch");
  const peopleMoreListEl = document.getElementById("peopleMoreList");

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

  function saveAndRefresh() {
    saveAppData(appData);
    renderTopInfo();
    renderPeopleYouMayKnow();
    renderFollowing();
    if (peopleMoreTabEl && !peopleMoreTabEl.classList.contains("hidden")) {
      renderPeopleMoreList();
    }
    renderFeedPosts();
  }

  let pendingImages = [];

  function renderImagePreviews() {
    cpImagePreviews.innerHTML = "";
    if (pendingImages.length === 0) return;

    pendingImages.forEach((src, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "cp-preview-wrap";

      const img = document.createElement("img");
      img.src = src;
      img.className = "cp-preview-img";
      img.alt = "preview";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "cp-preview-remove";
      removeBtn.innerHTML = "×";
      removeBtn.setAttribute("aria-label", "Remove image");
      removeBtn.addEventListener("click", () => {
        pendingImages.splice(idx, 1);
        renderImagePreviews();
      });

      wrap.appendChild(img);
      wrap.appendChild(removeBtn);
      cpImagePreviews.appendChild(wrap);
    });
  }

  createPostImages.addEventListener("change", () => {
    const files = createPostImages.files;
    if (!files) return;
    const remaining = 4 - pendingImages.length;
    let added = 0;

    for (let i = 0; i < files.length; i++) {
      if (added >= remaining) break;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX = 800;
          if (width > height && width > MAX) {
            height = Math.round((height * MAX) / width);
            width = MAX;
          } else if (height > MAX) {
            width = Math.round((width * MAX) / height);
            height = MAX;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          pendingImages.push(canvas.toDataURL("image/jpeg", 0.7));
          renderImagePreviews();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(files[i]);
      added++;
    }
    createPostImages.value = "";
  });

  function renderTopInfo() {
    const src = getAvatarSrc(currentUser);

    meAvatarEl.src = src;
    aboutAvatarEl.src = src;

    aboutNameEl.textContent = currentUser.username;
    aboutHandleEl.textContent = toHandle(currentUser.username);
    aboutBioEl.textContent =
      currentUser.bio && currentUser.bio.trim() ? currentUser.bio : "No bio yet.";
  }

  function getFollowingArray() {
    return currentUser.following && currentUser.following.length !== undefined ? currentUser.following : [];
  }

  function renderPeopleYouMayKnow() {
    const following = getFollowingArray();
    const others = (appData.users || []).filter(
      (u) => u.id !== currentUser.id && !following.includes(u.id)
    );

    peopleListEl.innerHTML = "";

    if (others.length === 0) {
      const li = document.createElement("li");
      li.className = "orbit-empty";
      li.textContent = "You are following everyone already.";
      peopleListEl.appendChild(li);
      return;
    }

    others.slice(0, 8).forEach((u) => {
      peopleListEl.appendChild(createPeopleItem(u));
    });
  }

  function createPeopleItem(u) {
    const li = document.createElement("li");
    li.className = "people-item";
    li.dataset.userId = u.id;

    const left = document.createElement("div");
    left.className = "people-item-left";

    const img = document.createElement("img");
    img.className = "people-avatar";
    img.src = getAvatarSrc(u);
    img.alt = u.username;
    img.onerror = () => {
      img.src = PLACEHOLDER_AVATAR;
    };

    const textWrap = document.createElement("div");

    const name = document.createElement("p");
    name.className = "people-item-name";
    name.textContent = u.username;

    const handle = document.createElement("p");
    handle.className = "people-item-handle";
    handle.textContent = toHandle(u.username);

    textWrap.appendChild(name);
    textWrap.appendChild(handle);
    left.appendChild(img);
    left.appendChild(textWrap);

    left.style.cursor = "pointer";
    left.title = "View " + u.username + "'s profile";
    left.addEventListener("click", () => {
      const url = new URL("../profile/profile.html", window.location.href);
      url.searchParams.set("userId", u.id);
      window.location.href = url.toString();
    });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "follow-btn";
    btn.textContent = "Follow";

    btn.addEventListener("click", () => {
      toggleFollow(u.id);
    });

    li.appendChild(left);
    li.appendChild(btn);
    return li;
  }

  function renderPeopleMoreList() {
    const following = getFollowingArray();
    const others = (appData.users || []).filter(
      (u) => u.id !== currentUser.id && !following.includes(u.id)
    );

    const q = (peopleMoreSearchEl && peopleMoreSearchEl.value
      ? peopleMoreSearchEl.value
      : ""
    )
      .trim()
      .toLowerCase();

    const filtered = q
      ? others.filter((u) => {
          const username = (u.username || "").toLowerCase();
          const handle = toHandle(u.username).toLowerCase();
          return username.includes(q) || handle.includes(q);
        })
      : others;

    peopleMoreListEl.innerHTML = "";

    if (filtered.length === 0) {
      const li = document.createElement("li");
      li.className = "orbit-empty";
      li.textContent = q ? "No matching users." : "No users to show.";
      peopleMoreListEl.appendChild(li);
      return;
    }

    filtered.forEach((u) => {
      peopleMoreListEl.appendChild(createPeopleItem(u));
    });
  }

  function renderFollowing() {
    const following = getFollowingArray();
    const followedUsers = (appData.users || []).filter(
      (u) => u.id !== currentUser.id && following.includes(u.id)
    );

    followingListEl.innerHTML = "";

    if (followedUsers.length === 0) {
      const li = document.createElement("li");
      li.className = "orbit-empty";
      li.textContent = "You are not following anyone yet.";
      followingListEl.appendChild(li);
      return;
    }

    followedUsers.forEach((u) => {
      const li = document.createElement("li");
      li.className = "people-item";
      li.dataset.userId = u.id;

      const left = document.createElement("div");
      left.className = "people-item-left";

      const img = document.createElement("img");
      img.className = "people-avatar";
      img.src = getAvatarSrc(u);
      img.alt = u.username;
      img.onerror = () => { img.src = PLACEHOLDER_AVATAR; };

      const textWrap = document.createElement("div");

      const name = document.createElement("p");
      name.className = "people-item-name";
      name.textContent = u.username;

      const handle = document.createElement("p");
      handle.className = "people-item-handle";
      handle.textContent = toHandle(u.username);

      textWrap.appendChild(name);
      textWrap.appendChild(handle);
      left.appendChild(img);
      left.appendChild(textWrap);

      left.style.cursor = "pointer";
      left.title = "View " + u.username + "'s profile";
      left.addEventListener("click", () => {
        const url = new URL("../profile/profile.html", window.location.href);
        url.searchParams.set("userId", u.id);
        window.location.href = url.toString();
      });

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "follow-btn following";
      btn.textContent = "Unfollow";

      btn.addEventListener("click", () => {
        toggleFollow(u.id);
      });

      li.appendChild(left);
      li.appendChild(btn);
      followingListEl.appendChild(li);
    });
  }

  function toggleFollow(targetId) {
    if (!targetId || targetId === currentUser.id) return;

    const me     = appData.users.find((u) => u.id === currentUser.id);
    const target = appData.users.find((u) => u.id === targetId);
    if (!me || !target) return;

    if (!me.following || me.following.length === undefined)     me.following = [];
    if (!target.followers || target.followers.length === undefined) target.followers = [];

    const alreadyFollowing = me.following.includes(targetId);

    if (alreadyFollowing) {
      me.following      = me.following.filter((id) => id !== targetId);
      target.followers  = target.followers.filter((id) => id !== me.id);
    } else {
      me.following.push(targetId);
      target.followers.push(me.id);
    }

    currentUser.following = me.following;

    saveAndRefresh();
  }

  function getFeedPosts() {
    if (window.OrbitPosts && typeof window.OrbitPosts.getFeedPosts === "function") {
      return window.OrbitPosts.getFeedPosts(appData);
    }
    const allowed = getFollowingArray().slice();
    allowed.push(currentUser.id);
    return (appData.posts || []).filter((p) => allowed.includes(p.userId));
  }

  function renderFeedPosts() {
    const posts = getFeedPosts();
    if (window.OrbitPosts && typeof window.OrbitPosts.initPostsList === "function") {
      window.OrbitPosts.initPostsList(feedPostsListEl, {
        appData,
        posts,
        showDelete: true,
        showCommentForm: true,
        cardIsView: true,
      });
    } else {
      feedPostsListEl.innerHTML = "<li>Could not load posts.</li>";
    }
  }

  logoutBtn.addEventListener("click", () => {
    appData.currentUserId = null;
    saveAppData(appData);
    window.location.href = "../login/login.html";
  });

  createPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (createPostText.value || "").trim();
    if (!text && pendingImages.length === 0) return;

    const newPost = {
      id:        "p_" + Date.now().toString(36),
      userId:    currentUser.id,
      content:   text,
      images:    pendingImages.slice(),
      timestamp: new Date().toISOString(),
      likes:     [],
      comments:  [],
    };

    if (!appData.posts || appData.posts.length === undefined) appData.posts = [];
    appData.posts.push(newPost);

    const success = saveAppData(appData);
    if (!success) {
      appData.posts.pop();
      return;
    }

    createPostText.value = "";
    pendingImages = [];
    renderImagePreviews();
    renderTopInfo();
    renderPeopleYouMayKnow();
    renderFollowing();
    if (peopleMoreTabEl && !peopleMoreTabEl.classList.contains("hidden")) {
      renderPeopleMoreList();
    }
    renderFeedPosts();

    feedPostsListEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderTopInfo();
  renderPeopleYouMayKnow();
  renderFollowing();
  renderFeedPosts();

  if (peopleViewMoreBtn && peopleMoreTabEl) {
    const openTab = () => {
      peopleMoreTabEl.classList.remove("hidden");
      if (peopleMoreSearchEl) {
        peopleMoreSearchEl.value = "";
      }
      renderPeopleMoreList();
      if (peopleMoreSearchEl) peopleMoreSearchEl.focus();
    };

    const closeTab = () => {
      peopleMoreTabEl.classList.add("hidden");
    };

    peopleViewMoreBtn.addEventListener("click", openTab);
    if (peopleMoreCloseBtn) peopleMoreCloseBtn.addEventListener("click", closeTab);

    if (peopleMoreSearchEl) {
      peopleMoreSearchEl.addEventListener("input", () => {
        renderPeopleMoreList();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && peopleMoreTabEl && !peopleMoreTabEl.classList.contains("hidden")) {
        closeTab();
      }
    });
  }
})();
