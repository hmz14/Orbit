"use client";
import { useState } from "react";
export default function PostCard({ post }) {
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [commentText, setCommentText] = useState("");
  const [commentsCount, setCommentsCount] = useState(post.comments.length);

  async function handleLike() {
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        postId: post.id,
      }),
    });

    const data = await res.json();

    if (data.liked) {
      setLikesCount((prev) => prev + 1);
    } else {
      setLikesCount((prev) => prev - 1);
    }
  }

  async function handleComment() {
    const text = commentText.trim();
    if (!text) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        postId: post.id,
        content: text,
      }),
    });

    if (!res.ok) {
      alert("Failed to add comment");
      return;
    }

    setCommentsCount((prev) => prev + 1);
    setCommentText("");
  }
  async function handleDelete() {
    const confirmDelete = confirm("Delete this post?");
    if (!confirmDelete) return;

    const res = await fetch("/api/posts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: Number(post.id),
      }),
    });

    if (!res.ok) {
      alert("Failed to delete post");
      return;
    }

    window.location.reload();
  }

  return (
    <li className="post-card card">
      <div className="post-header">
        <img
          className="post-avatar"
          src="/assets/images/profile.svg"
          alt="avatar"
        />
        <div>
          <p className="post-author">{post.author.username}</p>
          <p className="post-time">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <p className="post-content">{post.content}</p>
      {post.images &&
        JSON.parse(post.images).map((img, i) => (
          <img key={i} src={img} alt="post" className="post-image" />
        ))}

      <div className="post-actions">
        <button onClick={handleLike} className="post-action-btn">
          Like ({likesCount})
        </button>
        {post.authorId === 1 && (
          <button onClick={handleDelete} className="post-action-btn delete-btn">
            Delete
          </button>
        )}

        <button className="post-action-btn">Comment ({commentsCount})</button>
      </div>

      <div className="comment-box">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input"
        />

        <button onClick={handleComment} className="comment-btn">
          Add
        </button>
      </div>
      {post.comments.length > 0 && (
        <div className="comments-list">
          {post.comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <span className="comment-author">
                {comment.author?.username || "user"}:
              </span>{" "}
              <span className="comment-text">{comment.content}</span>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}
