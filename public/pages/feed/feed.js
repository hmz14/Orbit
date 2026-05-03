(function () {
  const API = "";

  const currentUserId = localStorage.getItem("orbit-uid")
    ? Number(localStorage.getItem("orbit-uid"))
    : null;

  if (!currentUserId) {
    window.location.href = "../login/login.html";
    return;
  }

  const logoutBtn         = document.getElementById("logoutBtn");
  const createPostForm    = document.getElementById("createPostForm");
  const createPostText    = document.getElementById("createPostText");
  const createPostImages  = document.getElementById("createPostImages");
  const cpImagePreviews   = document.getElementById("cp-image-previews");
  const meAvatarEl        = document.getElementById("me-avatar");
  const aboutAvatarEl     = document.getElementById("about-avatar");
  const aboutNameEl       = document.getElementById("about-name");
  const aboutHandleEl     = document.getElementById("about-handle");
  const aboutBioEl        = document.getElementById("about-bio");
  const peopleListEl      = document.getElementById("peopleList");
  const followingListEl   = document.getElementById("followingList");
  const feedPostsListEl   = document.getElementById("feed-posts-list");
  const peopleViewMoreBtn = document.getElementById("peopleViewMoreBtn");
  const peopleMoreTabEl   = document.getElementById("peopleMoreTab");
  const peopleMoreCloseBtn   = document.getElementById("peopleMoreCloseBtn");
  const peopleMoreSearchEl   = document.getElementById("peopleMoreSearch");
  const peopleMoreListEl     = document.getElementById("peopleMoreList");

  const PLACEHOLDER_AVATAR = "../../assets/images/profile.svg";

  let currentUser  = null;
  let allUsers     = [];
  let followingIds = [];

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

  async function loadInitialData() {
    const [userRes, usersRes, followingRes] = await Promise.all([
      fetch(`${API}/api/users?id=${currentUserId}`),
      fetch(`${API}/api/users`),
      fetch(`${API}/api/follow?followerId=${currentUserId}`),
    ]);

    if (!userRes.ok) {
      localStorage.removeItem("orbit-uid");
      window.location.href = "../login/login.html";
      return;
    }

    currentUser  = await userRes.json();
    allUsers     = usersRes.ok ? await usersRes.json() : [];
    const follows = followingRes.ok ? await followingRes.json() : [];
    followingIds = follows.map((f) => f.followingId);
  }

  async function toggleFollow(targetId) {
    if (!targetId || targetId === currentUserId) return;

    const isFollowing = followingIds.includes(targetId);

    if (isFollowing) {
      await fetch(`${API}/api/follow?followerId=${currentUserId}&followingId=${targetId}`, {
        method: "DELETE",
      });
      followingIds = followingIds.filter((id) => id !== targetId);
    } else {
      await fetch(`${API}/api/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: currentUserId, followingId: targetId }),
      });
      followingIds.push(targetId);
    }

    renderTopInfo();
    renderPeopleYouMayKnow();
    renderFollowing();
    if (peopleMoreTabEl && !peopleMoreTabEl.classList.contains("hidden")) {
      renderPeopleMoreList();
    }
    renderFeedPosts();
  }

  function renderTopInfo() {
    if (!currentUser) return;
    const src = getAvatarSrc(currentUser);
    meAvatarEl.src    = src;
    aboutAvatarEl.src = src;
    aboutNameEl.textContent   = currentUser.name || currentUser.username;
    aboutHandleEl.textContent = toHandle(currentUser.username);
    aboutBioEl.textContent    = currentUser.bio && currentUser.bio.trim()
      ? currentUser.bio
      : "No bio yet.";
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
    img.onerror = () => { img.src = PLACEHOLDER_AVATAR; };

    const textWrap = document.createElement("div");
    const name     = document.createElement("p");
    name.className = "people-item-name";
    name.textContent = u.name || u.username;

    const handle = document.createElement("p");
    handle.className = "people-item-handle";
    handle.textContent = toHandle(u.username);

    textWrap.appendChild(name);
    textWrap.appendChild(handle);
    left.appendChild(img);
    left.appendChild(textWrap);

    left.style.cursor = "pointer";
    left.title = "View " + (u.name || u.username) + "'s profile";
    left.addEventListener("click", () => {
      const url = new URL("../profile/profile.html", window.location.href);
      url.searchParams.set("userId", u.id);
      window.location.href = url.toString();
    });

    const isFollowing = followingIds.includes(u.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "follow-btn" + (isFollowing ? " following" : "");
    btn.textContent = isFollowing ? "Unfollow" : "Follow";

    btn.addEventListener("click", async () => {
      await toggleFollow(u.id);
    });

    li.appendChild(left);
    li.appendChild(btn);
    return li;
  }

  function renderPeopleYouMayKnow() {
    const others = allUsers.filter(
      (u) => u.id !== currentUserId && !followingIds.includes(u.id) && u.role !== "ADMIN"
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

  function renderPeopleMoreList() {
    const others = allUsers.filter(
      (u) => u.id !== currentUserId && !followingIds.includes(u.id) && u.role !== "ADMIN"
    );

    const q = (peopleMoreSearchEl && peopleMoreSearchEl.value ? peopleMoreSearchEl.value : "")
      .trim()
      .toLowerCase();

    const filtered = q
      ? others.filter((u) => {
          const username = (u.username || "").toLowerCase();
          const handle   = toHandle(u.username).toLowerCase();
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
    const followedUsers = allUsers.filter(
      (u) => u.id !== currentUserId && followingIds.includes(u.id)
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
      const name     = document.createElement("p");
      name.className = "people-item-name";
      name.textContent = u.name || u.username;

      const handle = document.createElement("p");
      handle.className = "people-item-handle";
      handle.textContent = toHandle(u.username);

      textWrap.appendChild(name);
      textWrap.appendChild(handle);
      left.appendChild(img);
      left.appendChild(textWrap);

      left.style.cursor = "pointer";
      left.title = "View " + (u.name || u.username) + "'s profile";
      left.addEventListener("click", () => {
        const url = new URL("../profile/profile.html", window.location.href);
        url.searchParams.set("userId", u.id);
        window.location.href = url.toString();
      });

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "follow-btn following";
      btn.textContent = "Unfollow";
      btn.addEventListener("click", async () => {
        await toggleFollow(u.id);
      });

      li.appendChild(left);
      li.appendChild(btn);
      followingListEl.appendChild(li);
    });
  }

  async function getFeedPosts() {
    const res = await fetch(`${API}/api/feed?userId=${currentUserId}`);
    if (!res.ok) throw new Error("Failed to fetch feed");
    return res.json();
  }

  async function renderFeedPosts() {
    try {
      const posts = await getFeedPosts();
      if (window.OrbitPosts && typeof window.OrbitPosts.initPostsList === "function") {
        window.OrbitPosts.initPostsList(feedPostsListEl, {
          currentUserId,
          posts,
          showDelete: true,
          showCommentForm: true,
          cardIsView: true,
          onRefresh: getFeedPosts,
        });
      } else {
        feedPostsListEl.innerHTML = "<li>Could not load posts.</li>";
      }
    } catch (err) {
      console.error("Error rendering feed posts:", err);
      feedPostsListEl.innerHTML = "<li>Failed to load posts.</li>";
    }
  }

  // ---- Image preview (kept for UX; images aren't persisted to DB) ----
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
          let w = img.width, h = img.height;
          const MAX = 800;
          if (w > h && w > MAX) { h = Math.round((h * MAX) / w); w = MAX; }
          else if (h > MAX)     { w = Math.round((w * MAX) / h); h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
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
  // ---- End image preview ----

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("orbit-uid");
    window.location.href = "../login/login.html";
  });

  createPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = (createPostText.value || "").trim();
    if (!text && pendingImages.length === 0) return;

    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text || "(shared an image)",
          authorId: currentUserId,
          images: pendingImages.length > 0 ? pendingImages : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      createPostText.value = "";
      pendingImages = [];
      renderImagePreviews();
      await renderFeedPosts();
      feedPostsListEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post.");
    }
  });

  // ---- People "View More" tab ----
  if (peopleViewMoreBtn && peopleMoreTabEl) {
    const openTab = () => {
      peopleMoreTabEl.classList.remove("hidden");
      if (peopleMoreSearchEl) peopleMoreSearchEl.value = "";
      renderPeopleMoreList();
      if (peopleMoreSearchEl) peopleMoreSearchEl.focus();
    };
    const closeTab = () => {
      peopleMoreTabEl.classList.add("hidden");
    };

    peopleViewMoreBtn.addEventListener("click", openTab);
    if (peopleMoreCloseBtn) peopleMoreCloseBtn.addEventListener("click", closeTab);

    if (peopleMoreSearchEl) {
      peopleMoreSearchEl.addEventListener("input", renderPeopleMoreList);
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && peopleMoreTabEl && !peopleMoreTabEl.classList.contains("hidden")) {
        closeTab();
      }
    });
  }

  // ---- About card dropdown ----
  const aboutDotsBtn    = document.getElementById("aboutDotsBtn");
  const aboutAvatarWrap = document.getElementById("aboutAvatarWrap");
  const aboutDropdown   = document.getElementById("aboutDropdown");
  const aboutAnalysisBtn = document.getElementById("aboutAnalysisBtn");

  function closeAboutDropdown() {
    if (aboutDropdown) aboutDropdown.classList.add("hidden");
  }

  function toggleAboutDropdown(e) {
    e.stopPropagation();
    if (!aboutDropdown) return;
    const isHidden = aboutDropdown.classList.contains("hidden");
    closeAboutDropdown();
    if (isHidden) aboutDropdown.classList.remove("hidden");
  }

  if (aboutDotsBtn)    aboutDotsBtn.addEventListener("click", toggleAboutDropdown);
  if (aboutAvatarWrap) aboutAvatarWrap.addEventListener("click", toggleAboutDropdown);

  if (aboutAnalysisBtn) {
    aboutAnalysisBtn.addEventListener("click", () => {
      closeAboutDropdown();
      window.location.href = `/statistics/my?userId=${currentUserId}`;
    });
  }

  document.addEventListener("click", closeAboutDropdown);

  // ---- Boot ----
  loadInitialData().then(() => {
    renderTopInfo();
    renderPeopleYouMayKnow();
    renderFollowing();
    renderFeedPosts();
  }).catch((err) => {
    console.error("Failed to load feed data:", err);
  });
})();
