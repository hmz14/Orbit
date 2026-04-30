import { toggleLike } from "@/repositories/likeRepository";

export async function POST(req) {
  const body = await req.json();

  const result = await toggleLike(body.userId, body.postId);

  return Response.json(result);
}