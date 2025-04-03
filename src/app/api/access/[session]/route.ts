import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
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
      user: true,
    },
  });

  if (!session) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // si l'utilisateur est membre de playsorbonne.fr, il est admin
  if (
    session?.user.email &&
    session.user.emailVerified &&
    session.user.email.endsWith("@playsorbonne.fr")
  ) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isAdmin: true,
      },
    });
    session.user.isAdmin = true;
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
