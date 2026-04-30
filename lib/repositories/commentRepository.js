import prisma from "../prisma";

// Get all comments for a specific post, oldest first
export async function getCommentsByPost(postId) {
  return prisma.comment.findMany({
    where:   { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}

// Get all comments made by a specific user
export async function getCommentsByUser(authorId) {
  return prisma.comment.findMany({
    where:   { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { id: true, content: true } },
    },
  });
}

// Get a single comment by ID
export async function getCommentById(id) {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
      post:   { select: { id: true, content: true } },
    },
  });
}

// Create a new comment
export async function createComment(data) {
  return prisma.comment.create({
    data: {
      content:  data.content,
      authorId: data.authorId,
      postId:   data.postId,
    },
    include: {
      author: { select: { id: true, username: true, profilePicture: true } },
    },
  });
}

// Update a comment's content
export async function updateComment(id, content) {
  return prisma.comment.update({
    where: { id },
    data:  { content },
  });
}

// Delete a comment by ID
export async function deleteComment(id) {
  return prisma.comment.delete({
    where: { id },
  });
}
