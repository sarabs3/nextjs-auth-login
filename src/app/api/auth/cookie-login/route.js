import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && bcrypt.compareSync(password, user.password)) {
    const cookie = serialize("auth_token", "sample-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return new Response(JSON.stringify({ message: "Logged in" }), {
      status: 200,
      headers: { "Set-Cookie": cookie },
    });
  }

  return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
}
