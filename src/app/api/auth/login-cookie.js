import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && bcrypt.compareSync(password, user.password)) {
      const cookie = serialize("auth_token", "sample-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      res.setHeader("Set-Cookie", cookie);
      res.status(200).json({ message: "Logged in with cookies" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
