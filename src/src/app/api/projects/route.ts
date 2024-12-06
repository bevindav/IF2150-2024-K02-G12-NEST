import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fetch all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { tasks: true },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// Create a new project
export async function POST(req: Request) {
  try {
    const { title, description, deadline } = await req.json();

    if (!title || !description || !deadline) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    // Parse the deadline as a Date object
    const rawDeadline = new Date(deadline);
    console.log("Parsed deadline before adjustment:", rawDeadline);

    // Manually add 7 hours to the deadline
    const adjustedDeadline = new Date(
      rawDeadline.getTime() + 7 * 60 * 60 * 1000
    );
    console.log("Adjusted deadline (local time):", adjustedDeadline);

    if (new Date(deadline) <= new Date()) {
      return NextResponse.json(
        { error: "Deadline must be in the future" },
        { status: 400 }
      );
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        deadline: adjustedDeadline,
        // new Date(deadline),
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// Update a project
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log("Payload received:", body); // Debug: log incoming payload

    const { id, title, description, deadline } = body;

    if (!id || !title || !description || !deadline) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { title, description, deadline: new Date(deadline) },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error); // Debug: log error
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// Delete a project
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
