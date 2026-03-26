(function () {
  function ensurePostStyles() {
    if (document.getElementById("orbit-post-styles")) return;
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    let hasPostCss = false;
    for (let i = 0; i < links.length; i++) {
      if ((links[i].getAttribute("href") || "").includes("post.css")) {
        hasPostCss = true;
        break;
      }
    }
    if (hasPostCss) return;

    const link = document.createElement("link");
    link.id = "orbit-post-styles";
    link.rel = "stylesheet";

    const current = document.currentScript && document.currentScript.src;
    if (current && current.includes("post.js")) {
      link.href = current.replace("post.js", "post.css");
    } else {
      link.href = "post.css";
    }

    document.head.appendChild(link);
  }

  function escapeHtml(s) {
    return String(s)
      .split("&").join("&amp;")
      .split("<").join("&lt;")
      .split(">").join("&gt;")
      .split('"').join("&quot;")
      .split("'").join("&#039;");
  }

  function safeStr(v) {
    if (v === null || v === undefined) return "";
    return String(v);
  }

  function getCommentContent(comment) {
    return safeStr(comment.content ?? comment.text);
  }

  function getCommentTimestamp(comment) {
    return safeStr(comment.timestamp ?? comment.createdAt);
  }

  function getPostTimestamp(post) {
    return safeStr(post.timestamp ?? post.createdAt);
  }

  function formatDate(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function toHandle(username) {
    return "@" + (username || "").replace(/\s+/g, "").toLowerCase();
  }

  const PLACEHOLDER = "../../assets/images/profile.svg";

  function buildUsersById(users) {
    const map = {};
    (users || []).forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }

  function getUsername(usersById, userId) {
    const u = usersById[userId];
    return u && u.username ? u.username : "Unknown";
  }

  function resolvePosts(appData, options) {
    if (options.posts && options.posts.length !== undefined) {
      const ids = options.posts
        .map((p) => (typeof p === "string" ? p : p && p.id ? p.id : null))
        .filter(Boolean);

      const postsById = {};
      (appData.posts || []).forEach((p) => {
        postsById[p.id] = p;
      });

      return ids.map((id) => postsById[id]).filter(Boolean);
    }
    if (typeof options.getPosts === "function") return options.getPosts(appData);
    return appData.posts || [];
  }

  function sortPostsNewestFirst(posts) {
    const copy = posts.slice();
    copy.sort((a, b) => {
      const at = new Date(getPostTimestamp(a)).getTime();
      const bt = new Date(getPostTimestamp(b)).getTime();
      return (bt || 0) - (at || 0);
    });
    return copy;
  }

  function renderEmptyState(targetEl, text) {
    targetEl.innerHTML = "";
    const p = document.createElement("p");
    p.textContent = text;
    p.className = "orbit-empty";
    targetEl.appendChild(p);
  }

  function createPostCard({ post, usersById, currentUserId, options, onAction }) {
    const li = document.createElement("li");
    li.className = "orbit-post";
    li.dataset.postId = post.id;

    const author     = getUsername(usersById, post.userId);
    const handle     = toHandle(author);
    const postTime   = formatDate(getPostTimestamp(post));
    const likeCount  = post.likes && post.likes.length !== undefined ? post.likes.length : 0;
    const commentCount = post.comments && post.comments.length !== undefined ? post.comments.length : 0;
    const iLiked     = currentUserId && post.likes && post.likes.length !== undefined && post.likes.includes(currentUserId);
    const isOwn      = currentUserId && post.userId === currentUserId;

    const topRow = document.createElement("div");
    topRow.className = "orbit-post-top";

    const avatarImg = document.createElement("img");
    avatarImg.className = "orbit-post-avatar";
    avatarImg.alt = author;
    const postUser = usersById[post.userId];
    const pic = postUser && postUser.profilePicture ? postUser.profilePicture : "";
    if (pic && !pic.includes("default.png")) {
      if (pic.startsWith("data:")) {
        avatarImg.src = pic;
      } else {
        avatarImg.src = pic.startsWith("assets/") ? "../../" + pic : "../../assets/" + pic;
      }
    } else {
      avatarImg.src = PLACEHOLDER;
    }
    avatarImg.onerror = () => { avatarImg.src = PLACEHOLDER; };

    const authorInfo = document.createElement("div");
    authorInfo.className = "orbit-post-author-info";

    const authorEl = document.createElement("span");
    authorEl.className = "orbit-post-author";
    authorEl.textContent = author;

    const handleEl = document.createElement("span");
    handleEl.className = "orbit-post-handle";
    handleEl.textContent = handle;

    authorInfo.appendChild(authorEl);
    authorInfo.appendChild(handleEl);

    const timeEl = document.createElement("span");
    timeEl.className = "orbit-post-time";
    timeEl.textContent = postTime;

    const authorLink = document.createElement("div");
    authorLink.className = "orbit-post-author-link";
    authorLink.title = "View " + author + "'s profile";
    authorLink.appendChild(avatarImg);
    authorLink.appendChild(authorInfo);
    authorLink.addEventListener("click", (e) => {
      e.stopPropagation();
      const url = new URL("../profile/profile.html", window.location.href);
      url.searchParams.set("userId", post.userId);
      window.location.href = url.toString();
    });

    topRow.appendChild(authorLink);
    topRow.appendChild(timeEl);

    const contentEl = document.createElement("p");
    contentEl.className = "orbit-post-content";
    contentEl.textContent = safeStr(post.content);

    const images = post.images && post.images.length !== undefined ? post.images.filter(Boolean) : [];
    let imagesEl = null;
    if (images.length > 0) {
      imagesEl = document.createElement("div");
      imagesEl.className = "orbit-post-images orbit-post-images--" + (images.length < 4 ? images.length : 4);
      images.slice(0, 4).forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "orbit-post-image";
        img.alt = "post image";
        img.loading = "lazy";
        imagesEl.appendChild(img);
      });
    }

    const actionBar = document.createElement("div");
    actionBar.className = "orbit-post-actions";

    const likeBtn = document.createElement("button");
    likeBtn.type = "button";
    likeBtn.className = "orbit-action-btn orbit-like-btn" + (iLiked ? " liked" : "");
    likeBtn.disabled = !currentUserId;
    likeBtn.setAttribute("aria-pressed", iLiked ? "true" : "false");
    likeBtn.innerHTML =
      `<span class="orbit-action-icon">${iLiked ? "♥" : "♡"}</span>` +
      `<span class="orbit-action-count">${likeCount}</span>`;

    likeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!currentUserId) return;
      onAction("like", post.id);
    });

    const commentBtn = document.createElement("button");
    commentBtn.type = "button";
    commentBtn.className = "orbit-action-btn orbit-comment-btn";
    commentBtn.innerHTML =
      `<span class="orbit-action-icon">💬</span>` +
      `<span class="orbit-action-count">${commentCount}</span>`;

    commentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    actionBar.appendChild(likeBtn);
    actionBar.appendChild(commentBtn);

    if (options.showDelete !== false && isOwn) {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "orbit-action-btn orbit-delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const overlay = document.createElement("div");
        overlay.className = "orbit-delete-overlay";

        overlay.innerHTML =
          `<div class="orbit-delete-modal">` +
            `<h3 class="orbit-delete-modal-title">Delete post?</h3>` +
            `<p class="orbit-delete-modal-body">This action cannot be undone. The post will be permanently removed.</p>` +
            `<div class="orbit-delete-modal-actions">` +
              `<button class="orbit-delete-cancel-btn" type="button">Cancel</button>` +
              `<button class="orbit-delete-confirm-btn" type="button">Delete</button>` +
            `</div>` +
          `</div>`;

        const close = () => document.body.removeChild(overlay);

        overlay.querySelector(".orbit-delete-cancel-btn").addEventListener("click", close);
        overlay.querySelector(".orbit-delete-confirm-btn").addEventListener("click", () => {
          close();
          onAction("delete", post.id);
        });
        overlay.addEventListener("click", (ev) => {
          if (ev.target === overlay) close();
        });
        document.addEventListener("keydown", function esc(ev) {
          if (ev.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
        });

        document.body.appendChild(overlay);
      });
      actionBar.appendChild(deleteBtn);
    }

    const commentsWrap = document.createElement("div");
    commentsWrap.className = "orbit-comments";

    const commentsList = document.createElement("ul");
    commentsList.className = "orbit-comments-list";

    const comments = post.comments && post.comments.length !== undefined ? post.comments : [];

    if (comments.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.className = "orbit-comment orbit-comment-empty";
      emptyLi.textContent = "No comments yet.";
      commentsList.appendChild(emptyLi);
    } else {
      comments.forEach((c) => {
        const cLi = document.createElement("li");
        cLi.className = "orbit-comment";
        const cAuthor = getUsername(usersById, c.userId);
        const cTime   = formatDate(getCommentTimestamp(c));
        const cText   = getCommentContent(c);
        cLi.innerHTML =
          `<div class="orbit-comment-meta">` +
            `<span class="orbit-comment-author">${escapeHtml(cAuthor)}</span>` +
            `<span class="orbit-comment-time">${escapeHtml(cTime)}</span>` +
          `</div>` +
          `<div class="orbit-comment-body">${escapeHtml(cText)}</div>`;
        commentsList.appendChild(cLi);
      });
    }

    commentsWrap.appendChild(commentsList);

    if (options.showCommentForm !== false) {
      const form = document.createElement("form");
      form.className = "orbit-comment-form";

      const textarea = document.createElement("textarea");
      textarea.className = "orbit-comment-input";
      textarea.rows = 2;
      textarea.placeholder = currentUserId ? "Write a comment..." : "Log in to comment";
      textarea.disabled = !currentUserId;

      const btnRow = document.createElement("div");
      btnRow.className = "orbit-comment-actions";

      const submitBtn = document.createElement("button");
      submitBtn.type = "submit";
      submitBtn.className = "orbit-btn-primary";
      submitBtn.textContent = "Add comment";
      submitBtn.disabled = !currentUserId;

      btnRow.appendChild(submitBtn);
      form.appendChild(textarea);
      form.appendChild(btnRow);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUserId) return;
        const text = (textarea.value || "").trim();
        if (!text || text.length > 500) return;
        onAction("comment", post.id, { text });
        textarea.value = "";
      });

      commentsWrap.appendChild(form);
    }

    li.appendChild(topRow);
    li.appendChild(contentEl);
    if (imagesEl) li.appendChild(imagesEl);
    li.appendChild(actionBar);
    if (!options.cardIsView) {
      li.appendChild(commentsWrap);
    }

    if (options.cardIsView === true) {
      li.classList.add("orbit-post-clickable");
      li.title = "View post";
      li.addEventListener("click", (e) => {
        let el = e.target;
        let isInteractive = false;
        const interactiveTags = ["BUTTON", "TEXTAREA", "INPUT", "SELECT", "FORM", "A"];
        while (el && el !== li) {
          if (interactiveTags.includes(el.tagName)) {
            isInteractive = true;
            break;
          }
          el = el.parentElement;
        }
        if (isInteractive) return;

        const url = new URL("../post/post.html", window.location.href);
        url.searchParams.set("postId", post.id);
        window.location.href = url.toString();
      });
    }

    return li;
  }

  function renderPostsList({ containerEl, posts, state, options }) {
    containerEl.innerHTML = "";

    const sorted = sortPostsNewestFirst(posts || []);

    if (!sorted.length) {
      renderEmptyState(containerEl, "No posts yet.");
      return;
    }

    sorted.forEach((post) => {
      const card = createPostCard({
        post,
        usersById: state.usersById,
        currentUserId: state.currentUserId,
        options,
        onAction: state.onAction,
      });
      containerEl.appendChild(card);
    });
  }

  function toggleLike(appData, postId, currentUserId) {
    const post = (appData.posts || []).find((p) => p.id === postId);
    if (!post) return;
    if (!currentUserId) return;
    if (!post.likes || post.likes.length === undefined) post.likes = [];

    const idx = post.likes.indexOf(currentUserId);
    if (idx === -1) post.likes.push(currentUserId);
    else post.likes.splice(idx, 1);
  }

  function deletePost(appData, postId, currentUserId) {
    if (!currentUserId) return;
    const posts = appData.posts || [];
    const newPosts = posts.filter((p) => !(p.id === postId && p.userId === currentUserId));
    appData.posts = newPosts;
  }

  function addComment(appData, postId, userId, text) {
    if (!userId) return;
    const post = (appData.posts || []).find((p) => p.id === postId);
    if (!post) return;
    if (!post.comments || post.comments.length === undefined) post.comments = [];

    const commentId = "c_" + Math.random().toString(36).slice(2) + "_" + Date.now().toString(36);
    post.comments.push({
      id: commentId,
      userId: userId,
      content: text,
      timestamp: new Date().toISOString(),
    });
  }

  function renderPostsListShell(containerEl, options, state) {
    if (containerEl.tagName === "UL") {
      renderPostsList({ containerEl, posts: options.posts, state, options });
      return;
    }

    containerEl.innerHTML = "";
    const ul = document.createElement("ul");
    ul.className = "orbit-posts-list";
    containerEl.appendChild(ul);
    renderPostsList({ containerEl: ul, posts: options.posts, state, options });
  }

  function initPostsList(containerEl, options = {}) {
    ensurePostStyles();

    const appData = options.appData || (typeof loadAppData === "function" ? loadAppData() : null);
    if (!appData) return;

    const state = {
      appData,
      usersById: buildUsersById(appData.users || []),
      currentUserId: appData.currentUserId,
      options,
      onAction: () => {},
    };

    state.onAction = (type, postId, payload) => {
      if (type === "like") toggleLike(state.appData, postId, state.currentUserId);
      if (type === "delete") deletePost(state.appData, postId, state.currentUserId);
      if (type === "comment") addComment(state.appData, postId, state.currentUserId, payload && payload.text);

      if (typeof saveAppData === "function") saveAppData(state.appData);

      if (type === "delete" && typeof options.onDelete === "function") {
        options.onDelete();
        return;
      }

      const resolved = resolvePosts(state.appData, options);
      const newOptions = { ...options, posts: resolved };
      renderPostsListShell(containerEl, newOptions, state);
    };

    const resolved = resolvePosts(appData, options);
    options.posts = options.posts || resolved;

    renderPostsListShell(containerEl, options, state);
  }

  function getFeedPosts(appData) {
    const currentUserId = appData.currentUserId;
    if (!currentUserId) return [];

    const me = (appData.users || []).find((u) => u.id === currentUserId);
    if (!me) return [];

    const followingIds = me.following && me.following.length !== undefined ? me.following : [];
    const allowed = followingIds.concat([currentUserId]);
    return (appData.posts || []).filter((p) => allowed.includes(p.userId));
  }

  function getUserPosts(appData, userId) {
    return (appData.posts || []).filter((p) => p.userId === userId);
  }

  function initSinglePostPage() {
    ensurePostStyles();

    const containerEl = document.getElementById("single-post-container");
    if (!containerEl) return;

    const queryString = window.location.search.substring(1);
    const params = queryString.split("&");
    let postId = null;
    for (let i = 0; i < params.length; i++) {
      let pair = params[i].split("=");
      if (pair[0] === "postId" || pair[0] === "id" || pair[0] === "post" || pair[0] === "pid") {
        postId = pair[1];
      }
    }
    if (!postId) {
      containerEl.textContent = "Missing post id in URL.";
      return;
    }

    const appData = typeof loadAppData === "function" ? loadAppData() : null;
    if (!appData) return;

    const post = (appData.posts || []).find((p) => p.id === postId);
    if (!post) {
      containerEl.textContent = "Post not found.";
      return;
    }

    initPostsList(containerEl, {
      appData,
      posts: [post],
      showDelete: true,
      onDelete: () => {
        window.location.href = "../feed/feed.html";
      },
      showCommentForm: true,
      sort: "newest",
    });
  }

  window.OrbitPosts = {
    initPostsList,
    initSinglePostPage,
    getFeedPosts,
    getUserPosts,
    buildUsersById,
  };

  if (document.getElementById("single-post-container")) {
    initSinglePostPage();
  }
})();
