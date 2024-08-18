import prisma from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.id) {
    return res.status(400).json({ error: "Missing id" });
  }

  const [user, ..._] = await prisma.user.findMany({
    where: {
      id: req.query.id as string,
    },
  });

  res.status(200).json({
    id: req.query.id,
    isAdmin: user.isAdmin,
  });
}
