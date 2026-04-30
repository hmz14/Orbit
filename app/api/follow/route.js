import { NextResponse } from "next/server";
import {
  getFollowing,
  getFollowers,
  getFollow,
  followUser,
  unfollowUser,
  getFollowerCount,
  getFollowingCount,
} from "@/lib/repositories/followRepository";

// GET /api/follow?followingId=1          → get all followers of user 1
// GET /api/follow?followerId=1           → get all users that user 1 follows
// GET /api/follow?followerId=1&count=true
// GET /api/follow?followingId=1&count=true
// GET /api/follow?followerId=1&followingId=2  → check if user 1 follows user 2
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const followerId  = searchParams.get("followerId");
  const followingId = searchParams.get("followingId");
  const count       = searchParams.get("count");

  try {
    if (followerId && followingId) {
      const follow = await getFollow(Number(followerId), Number(followingId));
      return NextResponse.json({ isFollowing: !!follow });
    }

    if (followerId && count) {
      const total = await getFollowingCount(Number(followerId));
      return NextResponse.json({ followerId: Number(followerId), followingCount: total });
    }

    if (followingId && count) {
      const total = await getFollowerCount(Number(followingId));
      return NextResponse.json({ followingId: Number(followingId), followerCount: total });
    }

    if (followerId) {
      const following = await getFollowing(Number(followerId));
      return NextResponse.json(following);
    }

    if (followingId) {
      const followers = await getFollowers(Number(followingId));
      return NextResponse.json(followers);
    }

    return NextResponse.json(
      { error: "Provide followerId or followingId as a query param" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/follow
// Body: { followerId, followingId }
export async function POST(request) {
  try {
    const body = await request.json();
    const { followerId, followingId } = body;

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: "followerId and followingId are required" },
        { status: 400 }
      );
    }

    if (followerId === followingId) {
      return NextResponse.json({ error: "A user cannot follow themselves" }, { status: 400 });
    }

    const existing = await getFollow(Number(followerId), Number(followingId));
    if (existing) {
      return NextResponse.json({ error: "Already following this user" }, { status: 409 });
    }

    const follow = await followUser(Number(followerId), Number(followingId));
    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/follow?followerId=1&followingId=2
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const followerId  = searchParams.get("followerId");
  const followingId = searchParams.get("followingId");

  if (!followerId || !followingId) {
    return NextResponse.json(
      { error: "followerId and followingId query params are required" },
      { status: 400 }
    );
  }

  try {
    await unfollowUser(Number(followerId), Number(followingId));
    return NextResponse.json({ message: "Unfollowed successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Follow relationship not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
