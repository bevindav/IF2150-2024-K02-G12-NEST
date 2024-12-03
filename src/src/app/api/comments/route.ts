import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      include: { task: true },
    });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { text, taskId } = await req.json();

    if (!text || !taskId) {
      return NextResponse.json(
        { error: "Text and Task ID are required" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        taskId,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, text } = await req.json();

    if (!id || !text) {
      return NextResponse.json(
        { error: "Comment ID and text are required" },
        { status: 400 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { text },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    await prisma.comment.delete({ where: { id } });
    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
