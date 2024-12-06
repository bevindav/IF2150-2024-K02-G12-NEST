import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { taskId, text } = await request.json();

    if (!taskId || !text.trim()) {
      return NextResponse.json(
        { error: "Task ID and comment text are required" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        taskId: parseInt(taskId, 10),
        text,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
