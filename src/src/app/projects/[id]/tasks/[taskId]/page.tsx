"use client";
import { useParams } from "next/navigation";

export default function TaskDetails() {
  const { taskId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Task Details</h1>
      <p>Task ID: {taskId}</p>
      {/* Fetch and display task details here */}
    </div>
  );
}
