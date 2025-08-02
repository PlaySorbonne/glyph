import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ session: string }> }
) {
  const sessionId = (await params).session;

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  const session = await prisma.session.findUnique({
    where: {
      sessionToken: sessionId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          isAdmin: true,
          welcomed: true,
          fraternityId: true,
        },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: session.user.id,
    name: session.user.name,
    session: session,
    isAdmin: session.user.isAdmin,
    welcomed: session.user.welcomed,
    fraternityId: session.user.fraternityId,
  });
}
