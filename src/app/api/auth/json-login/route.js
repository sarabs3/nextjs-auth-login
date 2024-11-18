import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET, {
      expiresIn: "1d",
    });
    return new Response(JSON.stringify({ token }), { status: 200 });
  }

  return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
}
