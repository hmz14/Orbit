import prisma from "../prisma";

// Get all users, ordered by newest first
export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// Get a single user by ID (includes their posts, followers, following counts)
export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
      followers: true,
      following: true,
    },
  });
}

// Get a single user by username
export async function getUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      posts: { orderBy: { createdAt: "desc" } },
      followers: true,
      following: true,
    },
  });
}

// Get a single user by email
export async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// Create a new user
export async function createUser(data) {
  return prisma.user.create({
    data: {
      username:       data.username,
      email:          data.email,
      password:       data.password,
      role:           data.role ?? "USER",
      profilePicture: data.profilePicture ?? null,
      bio:            data.bio ?? null,
    },
  });
}

// Update a user's profile fields
export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data: {
      username:       data.username,
      email:          data.email,
      password:       data.password,
      profilePicture: data.profilePicture,
      bio:            data.bio,
    },
  });
}

// Delete a user by ID
export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}

// Search users by username (partial match, case-insensitive)
export async function searchUsers(query) {
  return prisma.user.findMany({
    where: {
      username: { contains: query },
    },
    orderBy: { username: "asc" },
  });
}
