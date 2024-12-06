import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: parseInt(projectId, 10) },
      include: { comments: true, project: true }, // Include comments
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, deadline, projectId } = await req.json();

    if (!title || !description || !deadline || !projectId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const rawDeadline = new Date(deadline);
    console.log("Parsed deadline before adjustment:", rawDeadline);

    // Manually add 7 hours to the deadline
    const adjustedDeadline = new Date(
      rawDeadline.getTime() + 7 * 60 * 60 * 1000
    );
    console.log("Adjusted deadline (local time):", adjustedDeadline);

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        deadline: adjustedDeadline,
        projectId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, deadline } = await req.json();

    if (!id || !title || !description || !deadline) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        deadline: new Date(deadline),
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a task
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, completed } = await req.json();

    if (!id || completed === undefined) {
      return NextResponse.json(
        { error: "Task ID and completed status are required" },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error marking task as done:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
