import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      include: { project: true, task: true },
    });
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { message, type, timeLeft, projectId, taskId } = await req.json();

    if (!message || !type || !timeLeft) {
      return NextResponse.json(
        { error: "Message, type, and timeLeft are required" },
        { status: 400 }
      );
    }

    const newNotification = await prisma.notification.create({
      data: {
        message,
        type,
        timeLeft,
        projectId,
        taskId,
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    await prisma.notification.delete({ where: { id } });
    return NextResponse.json(
      { message: "Notification dismissed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error dismissing notification:", error);
    return NextResponse.json(
      { error: "Failed to dismiss notification" },
      { status: 500 }
    );
  }
}
