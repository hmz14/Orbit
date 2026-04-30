import { prisma } from "@/lib/prisma";

export async function createComment(userId, postId, content) {
  return await prisma.comment.create({
    data: {
      content: content,
      authorId: Number(userId),
      postId: Number(postId),
    },
  });
}
