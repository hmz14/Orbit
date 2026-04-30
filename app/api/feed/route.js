import { NextResponse } from "next/server";
import { getFeedPosts } from "@/lib/repositories/postRepository";

// GET /api/feed?userId=1
// Returns posts from the user + everyone they follow, newest first
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId query param is required" }, { status: 400 });
  }

  try {
    const posts = await getFeedPosts(Number(userId));
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
