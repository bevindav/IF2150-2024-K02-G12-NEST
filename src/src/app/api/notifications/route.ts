import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Get notifications
export async function GET(req: Request) {
  const url = new URL(req.url);
  const unread = url.searchParams.get("unread");

  try {
    const notifications = await prisma.notification.findMany({
      where: unread === "true" ? { read: false } : {},
      orderBy: { createdAt: "desc" },
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

// Create a notification
export async function POST(req: Request) {
  try {
    const { type, message, projectId, taskId, timeLeft } = await req.json();

    if (!type || !message || !timeLeft) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newNotification = await prisma.notification.create({
      data: {
        type,
        message,
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

// Mark all unread notifications as read
export async function PATCH(req: Request) {
  try {
    const updatedNotifications = await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });

    console.log(`${updatedNotifications.count} notifications marked as read.`);
    return NextResponse.json(
      { message: "All unread notifications marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
