import { toggleFollow } from "@/repositories/followRepository";

export async function POST(req) {
  const body = await req.json();

  const result = await toggleFollow(body.followerId, body.followingId);

  return Response.json(result);
}