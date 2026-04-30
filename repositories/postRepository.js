import { prisma } from "@/lib/prisma";

export async function getAllPosts() {
  return await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createPost(content, authorId, images) {
  return await prisma.post.create({
    data: {
      content: content,
      authorId: Number(authorId),
      images: images ? JSON.stringify(images) : null,
    },
  });
}
export async function deletePost(postId) {
  return await prisma.post.delete({
    where: {
      id: Number(postId),
    },
  });
}
