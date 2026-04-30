import Link from "next/link";
import prisma from "../../lib/prisma";

function StatCard({ label, value, detail }) {
  return (
    <article style={styles.card}>
      <p style={styles.label}>{label}</p>
      <strong style={styles.value}>{value}</strong>
      {detail ? <span style={styles.detail}>{detail}</span> : null}
    </article>
  );
}

export default async function StatisticsPage() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    totalPosts,
    postsLastSevenDays,
    mostLikedPost,
    mostFollowedUser,
    mostActiveUser,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    prisma.post.findFirst({
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      include: {
        author: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    }),
    prisma.user.findFirst({
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            followers: true,
          },
        },
      },
    }),
    prisma.user.findFirst({
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    }),
  ]);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Orbit analytics</p>
          <h1 style={styles.title}>Platform statistics</h1>
        </div>
        <Link href="/statistics/my" style={styles.link}>
          My statistics
        </Link>
      </header>

      <section style={styles.grid} aria-label="Platform statistics">
        <StatCard label="Total users" value={totalUsers} />
        <StatCard label="Total posts/messages" value={totalPosts} />
        <StatCard
          label="Most liked post"
          value={mostLikedPost?._count.likes ?? 0}
          detail={
            mostLikedPost
              ? `${mostLikedPost.author.username}: ${mostLikedPost.content}`
              : "No posts yet"
          }
        />
        <StatCard
          label="Posts created in the last 7 days"
          value={postsLastSevenDays}
        />
        <StatCard
          label="Most followed user"
          value={mostFollowedUser?.username ?? "No users yet"}
          detail={`${mostFollowedUser?._count.followers ?? 0} followers`}
        />
        <StatCard
          label="Most active user"
          value={mostActiveUser?.username ?? "No users yet"}
          detail={`${mostActiveUser?._count.posts ?? 0} posts`}
        />
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
