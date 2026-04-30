import { NextResponse } from "next/server";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
} from "@/lib/repositories/userRepository";

// GET /api/users
// GET /api/users?id=1
// GET /api/users?email=foo@bar.com
// GET /api/users?search=hamza
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id     = searchParams.get("id");
  const email  = searchParams.get("email");
  const search = searchParams.get("search");

  try {
    if (id) {
      const user = await getUserById(Number(id));
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(user);
    }

    if (email) {
      const user = await getUserByEmail(email);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json(user);
    }

    if (search) {
      const users = await searchUsers(search);
      return NextResponse.json(users);
    }

    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/users
// Body: { username, email, password, bio?, profilePicture? }
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email, and password are required" },
        { status: 400 }
      );
    }

    const user = await createUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/users?id=1
// Body: { username?, email?, password?, bio?, profilePicture? }
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const user = await updateUser(Number(id), body);
    return NextResponse.json(user);
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/users?id=1
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param is required" }, { status: 400 });
  }

  try {
    await deleteUser(Number(id));
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
