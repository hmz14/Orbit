import { NextResponse } from "next/server";
import {
  getAllPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
  getMostLikedPosts,
} from "@/lib/repositories/postRepository";

// GET /api/posts
// GET /api/posts?id=1
// GET /api/posts?authorId=5
// GET /api/posts?mostLiked=true&limit=10
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id        = searchParams.get("id");
  const authorId  = searchParams.get("authorId");
  const mostLiked = searchParams.get("mostLiked");
  const limit     = searchParams.get("limit");

  try {
    if (id) {
      const post = await getPostById(Number(id));
      if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      return NextResponse.json(post);
    }

    if (authorId) {
      const posts = await getPostsByUser(Number(authorId));
      return NextResponse.json(posts);
    }

    if (mostLiked) {
      const posts = await getMostLikedPosts(limit ? Number(limit) : 10);
      return NextResponse.json(posts);
    }

    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/posts
// Body: { content, authorId }
export async function POST(request) {
  try {
    const body = await request.json();
    const { content, authorId } = body;

    if (!content || !authorId) {
      return NextResponse.json(
        { error: "content and authorId are required" },
        { status: 400 }
      );
    }

    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/posts?id=1
// Body: { content }
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  try {
    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }

    const post = await updatePost(Number(id), content);
    return NextResponse.json(post);
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/posts?id=1
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  try {
    await deletePost(Number(id));
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
