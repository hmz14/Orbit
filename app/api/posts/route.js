import {
  getAllPosts,
  createPost,
  deletePost,
} from "@/repositories/postRepository";

export async function GET() {
  const posts = await getAllPosts();
  return Response.json(posts);
}

export async function POST(req) {
  const body = await req.json();

  const post = await createPost(body.content, body.authorId, body.images);
  return Response.json(post);
}

export async function DELETE(req) {
  const body = await req.json();

  await deletePost(body.postId);

  return Response.json({ success: true });
}
