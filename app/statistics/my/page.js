import Link from "next/link";
import prisma from "../../../lib/prisma";

function getMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function formatAccountAge(createdAt) {
  if (!createdAt) {
    return "No account";
  }

  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.max(
    0,
    Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (diffDays < 1) {
    return "Created today";
  }

  if (diffDays === 1) {
    return "1 day";
  }

  return `${diffDays} days`;
}

function StatCard({ label, value, detail }) {
  return (
    <article style={styles.card}>
      <p style={styles.label}>{label}</p>
      <strong style={styles.value}>{value}</strong>
      {detail ? <span style={styles.detail}>{detail}</span> : null}
    </article>
  );
}

export default async function MyStatisticsPage({ searchParams }) {
  const params = await searchParams;
  const selectedUserId = Number(params?.userId);
  const whereUser = Number.isInteger(selectedUserId)
    ? { id: selectedUserId }
    : undefined;

  const user = await prisma.user.findFirst({
    where: whereUser,
    orderBy: {
      id: "asc",
    },
  });

  const monthStart = getMonthStart();
  const userId = user?.id;

  const [totalPosts, totalLikesReceived, mostLikedPost, postsThisMonth] =
    userId
      ? await Promise.all([
          prisma.post.count({
            where: {
              authorId: userId,
            },
          }),
          prisma.like.count({
            where: {
              post: {
                authorId: userId,
              },
            },
          }),
          prisma.post.findFirst({
            where: {
              authorId: userId,
            },
            orderBy: {
              likes: {
                _count: "desc",
              },
            },
            include: {
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          }),
          prisma.post.count({
            where: {
              authorId: userId,
              createdAt: {
                gte: monthStart,
              },
            },
          }),
        ])
      : [0, 0, null, 0];

  const averageLikes =
    totalPosts > 0 ? (totalLikesReceived / totalPosts).toFixed(1) : "0.0";

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Orbit analytics</p>
          <h1 style={styles.title}>My statistics</h1>
          <p style={styles.subtitle}>
            {user
              ? `Showing metrics for ${user.username}`
              : "No user was found in the database"}
          </p>
        </div>
        <Link href="/statistics" style={styles.link}>
          Platform statistics
        </Link>
      </header>

      <section style={styles.grid} aria-label="My statistics">
        <StatCard label="My total posts" value={totalPosts} />
        <StatCard label="My total likes received" value={totalLikesReceived} />
        <StatCard
          label="My most liked post"
          value={mostLikedPost?._count.likes ?? 0}
          detail={mostLikedPost?.content ?? "No posts yet"}
        />
        <StatCard label="My average likes per post" value={averageLikes} />
        <StatCard label="My posts this month" value={postsThisMonth} />
        <StatCard label="My account age" value={formatAccountAge(user?.createdAt)} />
      </section>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "48px 20px",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    color: "#17202a",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "28px",
  },
  eyebrow: {
    margin: "0 0 6px",
    color: "#4d6b57",
    fontSize: "0.9rem",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: "2.4rem",
    lineHeight: 1.1,
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#56616a",
  },
  link: {
    border: "1px solid #c9d6cd",
    borderRadius: "8px",
    color: "#17202a",
    padding: "10px 14px",
    textDecoration: "none",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    border: "1px solid #d9e2dc",
    borderRadius: "8px",
    background: "#ffffff",
    padding: "20px",
    minHeight: "138px",
    boxShadow: "0 8px 22px rgba(23, 32, 42, 0.06)",
  },
  label: {
    margin: "0 0 12px",
    color: "#58635c",
    fontSize: "0.95rem",
    fontWeight: 700,
  },
  value: {
    display: "block",
    marginBottom: "10px",
    color: "#17202a",
    fontSize: "2rem",
    lineHeight: 1.1,
    overflowWrap: "anywhere",
  },
  detail: {
    display: "block",
    color: "#56616a",
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },
};
