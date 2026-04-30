import { createComment } from "@/repositories/commentRepository";

export async function POST(req) {
  const body = await req.json();

  const comment = await createComment(
    body.userId,
    body.postId,
    body.content
  );

  return Response.json(comment);
}