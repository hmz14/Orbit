(function () {
  const API = "";

  const currentUserId = localStorage.getItem("orbit-uid")
    ? Number(localStorage.getItem("orbit-uid"))
    : null;

  if (!currentUserId) {
    window.location.href = "../login/login.html";
    return;
  }

  const logoutBtn    = document.getElementById("logoutBtn");
  const dashboard    = document.getElementById("dashboard");
  const statsLoading = document.getElementById("stats-loading");
  const statsError   = document.getElementById("stats-error");

  // Set today's date in the badge
  const dateEl = document.getElementById("today-date");
  if (dateEl) {
    const d = new Date();
    dateEl.textContent = "Today · " + d.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("orbit-uid");
    window.location.href = "../login/login.html";
  });

  function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function showError(msg) {
    statsLoading.classList.add("hidden");
    dashboard.classList.add("hidden");
    statsError.textContent = msg;
    statsError.classList.remove("hidden");
  }

  async function loadStats() {
    try {
      // 1. Verify user and role
      const userRes = await fetch(`${API}/api/users?id=${currentUserId}`);
      if (!userRes.ok) {
        localStorage.removeItem("orbit-uid");
        window.location.href = "../login/login.html";
        return;
      }

      const user = await userRes.json();

      if (user.role !== "ADMIN") {
        window.location.href = "../feed/feed.html";
        return;
      }

      // Show initials in avatar
      const initialsEl = document.getElementById("admin-initials");
      if (initialsEl && user.username) {
        initialsEl.textContent = user.username.charAt(0).toUpperCase();
      }

      // 2. Fetch statistics
      const statsRes = await fetch(`${API}/api/statistics`);
      if (!statsRes.ok) throw new Error("Failed to load statistics.");
      const s = await statsRes.json();

      // Dashboard Overview
      set("stat-total-users",    s.totalUsers    ?? 0);
      set("stat-total-posts",    s.totalPosts    ?? 0);
      set("stat-total-likes",    s.totalLikes    ?? 0);
      set("stat-total-comments", s.totalComments ?? 0);

      // User & Content Summary
      set("stat-new-users",    s.newUsersToday    ?? 0);
      set("stat-new-posts",    s.newPostsToday    ?? 0);
      set("stat-new-comments", s.newCommentsToday ?? 0);
      set("stat-new-likes",    s.newLikesToday    ?? 0);
      set("stat-active-today", s.activeUsersToday ?? 0);

      // System Overview
      set("stat-admin-count", s.adminCount ?? 0);
      set("stat-posts-7d",    s.postsLastSevenDays ?? 0);

      if (s.mostFollowedUser) {
        set("stat-most-followed",     s.mostFollowedUser.username);
        set("stat-most-followed-sub", s.mostFollowedUser.followers + " followers");
      } else {
        set("stat-most-followed",     "—");
        set("stat-most-followed-sub", "No data yet");
      }

      if (s.mostActiveUser) {
        set("stat-most-active",     s.mostActiveUser.username);
        set("stat-most-active-sub", s.mostActiveUser.posts + " posts");
      } else {
        set("stat-most-active",     "—");
        set("stat-most-active-sub", "No data yet");
      }

      // Show dashboard
      statsLoading.classList.add("hidden");
      dashboard.classList.remove("hidden");

    } catch (err) {
      console.error("Admin stats error:", err);
      showError("Could not load statistics. Is the server running?");
    }
  }

  loadStats();
})();
