import { getAllUsersExcept } from "@/repositories/followRepository";

export async function GET() {
  const users = await getAllUsersExcept(1);
  return Response.json(users);
}