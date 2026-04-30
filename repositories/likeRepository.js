import { prisma } from "@/lib/prisma";

export async function toggleLike(userId, postId) {
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: Number(userId),
        postId: Number(postId),
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: Number(userId),
          postId: Number(postId),
        },
      },
    });

    return { liked: false };
  }

  await prisma.like.create({
    data: {
      userId: Number(userId),
      postId: Number(postId),
    },
  });

  return { liked: true };
}