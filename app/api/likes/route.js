import { NextResponse } from "next/server";
import {
  getLikesByPost,
  getLikesByUser,
  getLike,
  likePost,
  unlikePost,
  getLikeCount,
} from "@/lib/repositories/likeRepository";

// GET /api/likes?postId=1
// GET /api/likes?userId=3
// GET /api/likes?postId=1&count=true
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");
  const count  = searchParams.get("count");

  try {
    if (postId && count) {
      const total = await getLikeCount(Number(postId));
      return NextResponse.json({ postId: Number(postId), count: total });
    }

    if (postId) {
      const likes = await getLikesByPost(Number(postId));
      return NextResponse.json(likes);
    }

    if (userId) {
      const likes = await getLikesByUser(Number(userId));
      return NextResponse.json(likes);
    }

    return NextResponse.json(
      { error: "Provide postId or userId as a query param" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/likes
// Body: { userId, postId }
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, postId } = body;

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "userId and postId are required" },
        { status: 400 }
      );
    }

    const existing = await getLike(Number(userId), Number(postId));
    if (existing) {
      return NextResponse.json({ error: "Already liked" }, { status: 409 });
    }

    const like = await likePost(Number(userId), Number(postId));
    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/likes?userId=3&postId=1
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const postId = searchParams.get("postId");

  if (!userId || !postId) {
    return NextResponse.json(
      { error: "userId and postId query params are required" },
      { status: 400 }
    );
  }

  try {
    await unlikePost(Number(userId), Number(postId));
    return NextResponse.json({ message: "Like removed successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Like not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
