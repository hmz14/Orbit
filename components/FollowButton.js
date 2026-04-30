"use client";

import { useState } from "react";

export default function FollowButton({ followingId, initialFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  async function handleFollow() {
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: 1,
        followingId: followingId,
      }),
    });

    const data = await res.json();
    setIsFollowing(data.following);
  }

  return (
    <button
      type="button"
      onClick={handleFollow}
      className={isFollowing ? "follow-btn following" : "follow-btn"}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
