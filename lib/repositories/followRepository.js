import prisma from "../prisma";

// Get all users that a given user is following
export async function getFollowing(followerId) {
  return prisma.follow.findMany({
    where:   { followerId },
    orderBy: { createdAt: "desc" },
    include: {
      following: { select: { id: true, username: true, profilePicture: true, bio: true } },
    },
  });
}

// Get all followers of a given user
export async function getFollowers(followingId) {
  return prisma.follow.findMany({
    where:   { followingId },
    orderBy: { createdAt: "desc" },
    include: {
      follower: { select: { id: true, username: true, profilePicture: true, bio: true } },
    },
  });
}

// Check if a user is already following another user
export async function getFollow(followerId, followingId) {
  return prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

// Follow a user (create)
export async function followUser(followerId, followingId) {
  return prisma.follow.create({
    data: {
      createdAt:   new Date(),
      followerId,
      followingId,
    },
  });
}

// Unfollow a user (delete)
export async function unfollowUser(followerId, followingId) {
  return prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

// Get follower count for a user
export async function getFollowerCount(followingId) {
  return prisma.follow.count({
    where: { followingId },
  });
}

// Get following count for a user
export async function getFollowingCount(followerId) {
  return prisma.follow.count({
    where: { followerId },
  });
}
