import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/statistics
export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      totalPosts,
      totalLikes,
      totalComments,
      newUsersToday,
      newPostsToday,
      newCommentsToday,
      newLikesToday,
      postsLastSevenDays,
      adminCount,
      mostLikedPost,
      mostFollowedUser,
      mostActiveUser,
      activePostUsers,
      activeCommentUsers,
      activeLikeUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.post.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.comment.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.like.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.post.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.post.findFirst({
        orderBy: { likes: { _count: "desc" } },
        include: {
          author: { select: { username: true } },
          _count: { select: { likes: true } },
        },
      }),
      prisma.user.findFirst({
        orderBy: { followers: { _count: "desc" } },
        include: { _count: { select: { followers: true } } },
      }),
      prisma.user.findFirst({
        orderBy: { posts: { _count: "desc" } },
        include: { _count: { select: { posts: true } } },
      }),
      prisma.post.findMany({
        where: { createdAt: { gte: todayStart } },
        select: { authorId: true },
        distinct: ["authorId"],
      }),
      prisma.comment.findMany({
        where: { createdAt: { gte: todayStart } },
        select: { authorId: true },
        distinct: ["authorId"],
      }),
      prisma.like.findMany({
        where: { createdAt: { gte: todayStart } },
        select: { userId: true },
        distinct: ["userId"],
      }),
    ]);

    const activeUserIds = new Set([
      ...activePostUsers.map((p) => p.authorId),
      ...activeCommentUsers.map((c) => c.authorId),
      ...activeLikeUsers.map((l) => l.userId),
    ]);

    return NextResponse.json({
      totalUsers,
      totalPosts,
      totalLikes,
      totalComments,
      newUsersToday,
      newPostsToday,
      newCommentsToday,
      newLikesToday,
      activeUsersToday: activeUserIds.size,
      postsLastSevenDays,
      adminCount,
      mostLikedPost: mostLikedPost
        ? {
            likes: mostLikedPost._count.likes,
            content: mostLikedPost.content,
            author: mostLikedPost.author.username,
          }
        : null,
      mostFollowedUser: mostFollowedUser
        ? {
            username: mostFollowedUser.username,
            followers: mostFollowedUser._count.followers,
          }
        : null,
      mostActiveUser: mostActiveUser
        ? {
            username: mostActiveUser.username,
            posts: mostActiveUser._count.posts,
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
