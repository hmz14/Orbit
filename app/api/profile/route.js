import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { id: 1 },
    include: {
      posts: {
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
      },
      followers: true,
      following: true,
    },
  });

  return Response.json(user);
}