import prisma from "../prisma";

// Get all posts, newest first, with author, likes, and comments counts
export async function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: { orderBy: { createdAt: "desc" } },
    },
  });
}

// Get a single post by ID
export async function getPostById(id) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true, profilePicture: true } },
        },
      },
    },
  });
}

// Get all posts by a specific user, newest first
export async function getPostsByUser(authorId) {
  return prisma.post.findMany({
    where:   { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: true,
    },
  });
}

// Create a new post
export async function createPost(data) {
  return prisma.post.create({
    data: {
      content:  data.content,
      authorId: data.authorId,
    },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}

// Update a post's content
export async function updatePost(id, content) {
  return prisma.post.update({
    where: { id },
    data:  { content },
  });
}

// Delete a post by ID
export async function deletePost(id) {
  return prisma.post.delete({
    where: { id },
  });
}

// Get feed posts for a user: their own posts + posts from users they follow
export async function getFeedPosts(userId) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const authorIds = [userId, ...follows.map((f) => f.followingId)];

  return prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
      likes: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, username: true, profilePicture: true } },
        },
      },
    },
  });
}

// Get the most liked posts, sorted by like count descending
export async function getMostLikedPosts(limit = 10) {
  return prisma.post.findMany({
    orderBy: { likes: { _count: "desc" } },
    take:    limit,
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
      likes:  true,
    },
  });
}
