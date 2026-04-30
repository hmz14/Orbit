import prisma from "../prisma";

// Get all likes for a specific post
export async function getLikesByPost(postId) {
  return prisma.like.findMany({
    where:   { postId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}

// Get all posts liked by a specific user
export async function getLikesByUser(userId) {
  return prisma.like.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { id: true, content: true } },
    },
  });
}

// Check if a user has already liked a post
export async function getLike(userId, postId) {
  return prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
}

// Like a post (create)
export async function likePost(userId, postId) {
  return prisma.like.create({
    data: {
      createdAt: new Date(),
      userId,
      postId,
    },
  });
}

// Unlike a post (delete)
export async function unlikePost(userId, postId) {
  return prisma.like.delete({
    where: { userId_postId: { userId, postId } },
  });
}

// Get the count of likes for a post
export async function getLikeCount(postId) {
  return prisma.like.count({
    where: { postId },
  });
}
