import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, body: true, createdAt: true },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const { postId, name, body } = await req.json();

  if (!postId || !name?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "postId, name, and body are required" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({ where: { id: postId, isPublished: true } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: { postId, name: name.trim(), body: body.trim() },
    select: { id: true, name: true, body: true, createdAt: true },
  });

  return NextResponse.json(comment, { status: 201 });
}
