import prisma from "../prisma";

function normalizePost(post) {
  if (!post) return post;
  let images = [];
  if (post.images != null && post.images !== "") {
    try {
      const parsed = JSON.parse(post.images);
      images = Array.isArray(parsed) ? parsed : [];
    } catch {
      images = [];
    }
  }
  return { ...post, images };
}

function normalizePosts(posts) {
  return posts.map(normalizePost);
}

// Get all posts, newest first, with author, likes, and comments counts
export async function getAllPosts() {
  const rows = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: { orderBy: { createdAt: "desc" } },
    },
  });
  return normalizePosts(rows);
}

// Get a single post by ID
export async function getPostById(id) {
  const post = await prisma.post.findUnique({
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
  return normalizePost(post);
}

// Get all posts by a specific user, newest first
export async function getPostsByUser(authorId) {
  const rows = await prisma.post.findMany({
    where:   { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      author:   { select: { id: true, username: true, profilePicture: true } },
      likes:    true,
      comments: true,
    },
  });
  return normalizePosts(rows);
}

// Create a new post
export async function createPost(data) {
  const imagesPayload =
    data.images === undefined || data.images === null
      ? undefined
      : typeof data.images === "string"
        ? data.images
        : JSON.stringify(data.images);

  const created = await prisma.post.create({
    data: {
      content:  data.content,
      authorId: data.authorId,
      images:   imagesPayload,
    },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
    },
  });
  return normalizePost(created);
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

  const rows = await prisma.post.findMany({
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
  return normalizePosts(rows);
}

// Get the most liked posts, sorted by like count descending
export async function getMostLikedPosts(limit = 10) {
  const rows = await prisma.post.findMany({
    orderBy: { likes: { _count: "desc" } },
    take:    limit,
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
      likes:  true,
    },
  });
  return normalizePosts(rows);
}
