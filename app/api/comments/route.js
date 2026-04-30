import { NextResponse } from "next/server";
import {
  getCommentsByPost,
  getCommentsByUser,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/repositories/commentRepository";

// GET /api/comments?postId=1
// GET /api/comments?userId=3
// GET /api/comments?id=7
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id     = searchParams.get("id");
  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");

  try {
    if (id) {
      const comment = await getCommentById(Number(id));
      if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      return NextResponse.json(comment);
    }

    if (postId) {
      const comments = await getCommentsByPost(Number(postId));
      return NextResponse.json(comments);
    }

    if (userId) {
      const comments = await getCommentsByUser(Number(userId));
      return NextResponse.json(comments);
    }

    return NextResponse.json(
      { error: "Provide id, postId, or userId as a query param" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/comments
// Body: { content, authorId, postId }
export async function POST(request) {
  try {
    const body = await request.json();
    const { content, authorId, postId } = body;

    if (!content || !authorId || !postId) {
      return NextResponse.json(
        { error: "content, authorId, and postId are required" },
        { status: 400 }
      );
    }

    const comment = await createComment(body);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/comments?id=7
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

    const comment = await updateComment(Number(id), content);
    return NextResponse.json(comment);
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/comments?id=7
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  try {
    await deleteComment(Number(id));
    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
