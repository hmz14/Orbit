import { prisma } from "@/lib/prisma";

export async function toggleFollow(followerId, followingId) {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: Number(followerId),
        followingId: Number(followingId),
      },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: Number(followerId),
          followingId: Number(followingId),
        },
      },
    });

    return { following: false };
  }

  await prisma.follow.create({
    data: {
      followerId: Number(followerId),
      followingId: Number(followingId),
    },
  });

  return { following: true };
}

export async function getAllUsersExcept(currentUserId) {
  return await prisma.user.findMany({
    where: {
      id: {
        not: Number(currentUserId),
      },
    },
    include: {
      followers: true,
      following: true,
    },
  });
}