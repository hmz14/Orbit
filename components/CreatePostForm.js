"use client";

import { useState } from "react";

export default function CreatePostForm() {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();

    const text = content.trim();
    if (!text) return;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: text,
        authorId: 1,
        images: images,
      }),
    });

    if (!res.ok) {
      alert("Failed to create post");
      return;
    }

    setContent("");
    window.location.reload();
  }

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
      <div className="create-post-top">
        <img
          className="cp-avatar"
          src="/assets/images/profile.svg"
          alt="avatar"
        />

        <textarea
          className="create-post-textarea"
          rows="2"
          placeholder="What's on your mind?"
          maxLength="500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="create-post-footer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files);

            files.forEach((file) => {
              const reader = new FileReader();
              reader.onload = (ev) => {
                setImages((prev) => [...prev, ev.target.result]);
              };
              reader.readAsDataURL(file);
            });
          }}
        />
        <button type="submit" className="btn btn-primary post-btn">
          Post
        </button>
      </div>
    </form>
  );
}
