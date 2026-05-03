import BackButton from "../BackButton";
import prisma from "../../../lib/prisma";

function getMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatAccountAge(createdAt) {
  if (!createdAt) return "—";
  const diffDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000)
  );
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "1 day";
  if (diffDays < 30) return `${diffDays} days`;
  const months = Math.floor(diffDays / 30);
  return months === 1 ? "1 month" : `${months} months`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

// ── Icon components ───────────────────────────────────────────────
function IconPosts() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function IconBar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}

// ── Card components ───────────────────────────────────────────────
function OverviewCard({ icon, label, value, sub }) {
  return (
    <div style={s.ovCard}>
      <div style={s.ovIcon}>{icon}</div>
      <div>
        <p style={s.ovLabel}>{label}</p>
        <strong style={s.ovValue}>{value}</strong>
        {sub ? <span style={s.ovSub}>{sub}</span> : null}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={s.sumCard}>
      <p style={s.sumLabel}>{label}</p>
      <strong style={s.sumValue}>{value}</strong>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default async function MyStatisticsPage({ searchParams }) {
  const params = await searchParams;
  const selectedUserId = Number(params?.userId);
  const whereUser = Number.isInteger(selectedUserId) && selectedUserId > 0
    ? { id: selectedUserId }
    : undefined;

  const user = await prisma.user.findFirst({
    where: whereUser,
    orderBy: { id: "asc" },
  });

  const monthStart = getMonthStart();
  const userId = user?.id;

  const [
    totalPosts,
    totalLikesReceived,
    mostLikedPost,
    postsThisMonth,
    followerCount,
    followingCount,
    totalComments,
  ] = userId
    ? await Promise.all([
        prisma.post.count({ where: { authorId: userId } }),
        prisma.like.count({ where: { post: { authorId: userId } } }),
        prisma.post.findFirst({
          where: { authorId: userId },
          orderBy: { likes: { _count: "desc" } },
          include: { _count: { select: { likes: true } } },
        }),
        prisma.post.count({
          where: { authorId: userId, createdAt: { gte: monthStart } },
        }),
        prisma.follow.count({ where: { followingId: userId } }),
        prisma.follow.count({ where: { followerId: userId } }),
        prisma.comment.count({ where: { authorId: userId } }),
      ])
    : [0, 0, null, 0, 0, 0, 0];

  const averageLikes =
    totalPosts > 0 ? (totalLikesReceived / totalPosts).toFixed(1) : "0.0";

  const today = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div style={s.page}>
      {/* Top bar */}
      <header style={s.topbar}>
        <div style={s.brand}>
          <img src="/assets/icons/orbit_logo.png" alt="Orbit" style={s.brandLogo} />
          <span style={s.brandText}>Statistics</span>
        </div>
        <BackButton style={s.backBtn} />
      </header>

      {/* Body */}
      <main style={s.body}>
        <div style={s.card}>

          {/* Dashboard header */}
          <div style={s.sectionHeader}>
            <div>
              <h2 style={s.sectionTitle}>My Statistics</h2>
              <p style={s.sectionSub}>
                {user ? `Showing metrics for ${user.username}` : "No user found"}
              </p>
            </div>
            <div style={s.dateBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Today · {today}
            </div>
          </div>

          {/* My Overview — 4 big icon cards */}
          <div style={s.ovGrid}>
            <OverviewCard
              icon={<IconPosts />}
              label="Total Posts"
              value={totalPosts}
              sub="All posts created"
            />
            <OverviewCard
              icon={<IconHeart />}
              label="Total Likes Received"
              value={totalLikesReceived}
              sub="Likes on all posts"
            />
            <OverviewCard
              icon={<IconStar />}
              label="Most Liked Post"
              value={mostLikedPost?._count.likes ?? 0}
              sub={mostLikedPost?.content ?? "No posts yet"}
            />
            <OverviewCard
              icon={<IconBar />}
              label="Avg. Likes / Post"
              value={averageLikes}
              sub="Average engagement"
            />
          </div>

          {/* My Activity — 5 smaller cards */}
          <h3 style={s.sectionHeading}>My Activity</h3>
          <div style={s.sumGrid}>
            <SummaryCard label="Posts This Month"  value={postsThisMonth} />
            <SummaryCard label="Followers"         value={followerCount} />
            <SummaryCard label="Following"         value={followingCount} />
            <SummaryCard label="Total Comments"    value={totalComments} />
            <SummaryCard label="Account Age"       value={formatAccountAge(user?.createdAt)} />
          </div>

          <p style={s.note}>Your personal statistics.</p>

        </div>
      </main>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = {
  page: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
    background: "#eceef6",
    minHeight: "100vh",
    color: "#1e2235",
  },
  // top bar
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: "60px",
    background: "#ffffff",
    borderBottom: "1px solid #e4e6f0",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e4e6f0",
    background: "#f8f9fd",
    color: "#4b5073",
    fontSize: "0.875rem",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px" },
  brandLogo: { height: "32px", width: "auto", objectFit: "contain" },
  brandText: { fontSize: "1.2rem", fontWeight: 800, color: "#1e2235", letterSpacing: "-0.3px" },
  // body
  body: { padding: "32px 24px 48px", maxWidth: "1060px", margin: "0 auto" },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "36px 36px 28px",
    boxShadow: "0 2px 18px rgba(30,34,53,0.08)",
  },
  // section header
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  sectionTitle: { fontSize: "1.35rem", fontWeight: 700, color: "#1e2235", margin: "0 0 4px" },
  sectionSub:   { fontSize: "0.875rem", color: "#8b90a8", margin: 0 },
  dateBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#f4f5fb",
    border: "1px solid #e4e6f0",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#4b5073",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  // overview grid
  ovGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
    marginBottom: "36px",
  },
  ovCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    background: "#f8f9fd",
    border: "1px solid #e8eaf4",
    borderRadius: "12px",
    padding: "20px 18px",
  },
  ovIcon: {
    flexShrink: 0,
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#eef0fb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4FD1C5",
  },
  ovLabel: { fontSize: "0.8rem", fontWeight: 600, color: "#8b90a8", margin: "0 0 4px" },
  ovValue: { display: "block", fontSize: "1.8rem", fontWeight: 800, color: "#1e2235", lineHeight: 1.1, marginBottom: "4px", overflowWrap: "anywhere" },
  ovSub:   { fontSize: "0.78rem", color: "#a0a4bc", overflowWrap: "anywhere", display: "block" },
  // section heading
  sectionHeading: { fontSize: "1rem", fontWeight: 700, color: "#1e2235", margin: "0 0 14px" },
  // summary grid
  sumGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
    marginBottom: "28px",
  },
  sumCard: {
    background: "#f8f9fd",
    border: "1px solid #e8eaf4",
    borderRadius: "12px",
    padding: "18px 16px",
  },
  sumLabel: { fontSize: "0.78rem", fontWeight: 600, color: "#8b90a8", margin: "0 0 10px" },
  sumValue: { display: "block", fontSize: "1.7rem", fontWeight: 800, color: "#1e2235", overflowWrap: "anywhere" },
  // footer note
  note: { textAlign: "center", fontSize: "0.8rem", color: "#a0a4bc", margin: 0, paddingTop: "4px" },
};
