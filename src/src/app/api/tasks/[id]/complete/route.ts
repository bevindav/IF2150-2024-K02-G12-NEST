import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { completed } = await req.json();

    if (typeof completed !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { completed },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task completion:", error);
    return NextResponse.json(
      { error: "Failed to update task completion" },
      { status: 500 }
    );
  }
}
