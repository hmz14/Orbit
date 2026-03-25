// Feed / Home page — creates posts, follow/unfollow, renders feed

(function () {
  const appData = loadAppData();

  // If not logged in, send to login
  if (!appData.currentUserId) {
    window.location.href = "../login/login.html";
    return;
  }

  const currentUser = (appData.users || []).find((u) => u.id === appData.currentUserId);
  if (!currentUser) {
    window.location.href = "../login/login.html";
    return;
  }

  // DOM elements
  const logoutBtn       = document.getElementById("logoutBtn");
  const createPostForm  = document.getElementById("createPostForm");
  const createPostText  = document.getElementById("createPostText");
  const meAvatarEl      = document.getElementById("me-avatar");
  const aboutAvatarEl   = document.getElementById("about-avatar");
  const aboutNameEl     = document.getElementById("about-name");
  const aboutHandleEl   = document.getElementById("about-handle");
  const aboutBioEl      = document.getElementById("about-bio");
  const peopleListEl    = document.getElementById("peopleList");
  const feedPostsListEl = document.getElementById("feed-posts-list");

  const PLACEHOLDER_AVATAR = "../../assets/images/profile.png";

  // Get avatar src for a user, fallback to placeholder
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

  // Save and re-render everything
  function saveAndRefresh() {
    saveAppData(appData);
    renderTopInfo();
    renderPeopleYouMayKnow();
    renderFeedPosts();
  }

  // Top info: avatar, about card
  function renderTopInfo() {
    const src = getAvatarSrc(currentUser);

    meAvatarEl.src = src;
    aboutAvatarEl.src = src;

    aboutNameEl.textContent = currentUser.username;
    aboutHandleEl.textContent = toHandle(currentUser.username);
    aboutBioEl.textContent =
      currentUser.bio && currentUser.bio.trim() ? currentUser.bio : "No bio yet.";
  }

  function getFollowingSet() {
    return new Set(Array.isArray(currentUser.following) ? currentUser.following : []);
  }

  // People You May Know — users not yet followed
  function renderPeopleYouMayKnow() {
    const following = getFollowingSet();
    const others = (appData.users || []).filter(
      (u) => u.id !== currentUser.id && !following.has(u.id)
    );

    peopleListEl.innerHTML = "";

    if (others.length === 0) {
      const li = document.createElement("li");
      li.className = "orbit-empty";
      li.textContent = "You are following everyone already.";
      peopleListEl.appendChild(li);
      return;
    }

    others.slice(0, 3).forEach((u) => {
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

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "follow-btn";
      btn.textContent = "Follow";

      btn.addEventListener("click", () => {
        toggleFollow(u.id);
      });

      li.appendChild(left);
      li.appendChild(btn);
      peopleListEl.appendChild(li);
    });
  }

  function toggleFollow(targetId) {
    if (!targetId || targetId === currentUser.id) return;

    const me     = appData.users.find((u) => u.id === currentUser.id);
    const target = appData.users.find((u) => u.id === targetId);
    if (!me || !target) return;

    if (!Array.isArray(me.following))     me.following = [];
    if (!Array.isArray(target.followers)) target.followers = [];

    const alreadyFollowing = me.following.includes(targetId);

    if (alreadyFollowing) {
      me.following      = me.following.filter((id) => id !== targetId);
      target.followers  = target.followers.filter((id) => id !== me.id);
    } else {
      me.following.push(targetId);
      target.followers.push(me.id);
    }

    // keep currentUser in sync
    currentUser.following = me.following;

    saveAndRefresh();
  }

  // Get feed posts: current user + people they follow
  function getFeedPosts() {
    if (window.OrbitPosts && typeof window.OrbitPosts.getFeedPosts === "function") {
      return window.OrbitPosts.getFeedPosts(appData);
    }
    const allowed = new Set(getFollowingSet());
    allowed.add(currentUser.id);
    return (appData.posts || []).filter((p) => allowed.has(p.userId));
  }

  // Render the post feed using the reusable post module
  function renderFeedPosts() {
    const posts = getFeedPosts();
    if (window.OrbitPosts && typeof window.OrbitPosts.initPostsList === "function") {
      window.OrbitPosts.initPostsList(feedPostsListEl, {
        appData,
        posts,
        showDelete: true,
        showCommentForm: true,
      });
    } else {
      feedPostsListEl.innerHTML = "<li>Could not load posts.</li>";
    }
  }

  // Logout
  logoutBtn.addEventListener("click", () => {
    appData.currentUserId = null;
    saveAppData(appData);
    window.location.href = "../login/login.html";
  });

  // Create post
  createPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (createPostText.value || "").trim();
    if (!text) return;

    const newPost = {
      id:        "p_" + Date.now().toString(36),
      userId:    currentUser.id,
      content:   text,
      timestamp: new Date().toISOString(),
      likes:     [],
      comments:  [],
    };

    if (!Array.isArray(appData.posts)) appData.posts = [];
    appData.posts.push(newPost);

    createPostText.value = "";
    saveAndRefresh();
  });

  // First render
  renderTopInfo();
  renderPeopleYouMayKnow();
  renderFeedPosts();
})();
