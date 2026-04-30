import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // create users
  const user1 = await prisma.user.create({
    data: {
      username: "mazin",
      email: "mazin@test.com",
      password: "123456",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "ali",
      email: "ali@test.com",
      password: "123456",
    },
  });

  // posts
  const post1 = await prisma.post.create({
    data: {
      content: "Hello from Mazin",
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: "Ali's first post",
      authorId: user2.id,
    },
  });

  // comments
  await prisma.comment.create({
    data: {
      content: "Nice Post Mazen",
      authorId: user1.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Welcome Ali!",
      authorId: user1.id,
      postId: post2.id,
    },
  });

  // likes
  await prisma.like.create({
    data: {
      userId: user1.id,
      postId: post2.id,
    },
  });

  await prisma.like.create({
    data: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  // follows
  await prisma.follow.create({
    data: {
      followerId: user1.id,
      followingId: user2.id,
    },
  });

  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  });

  console.log("Seed completed successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
