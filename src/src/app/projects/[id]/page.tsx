"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import CreateTaskModal from "@/components/CreateTaskModal";
import TaskCard from "@/components/TaskCard";
import AddIcon from "../../../../public/add-icon.svg";
import Image from "next/image";

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string; // ISO string
  completed: boolean;
  comments: any[];
}

export default function ProjectTasks() {
  const { id } = useParams(); // Get project ID from URL
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch project and tasks
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const projectResponse = await fetch(`/api/projects/${id}`);
        const taskResponse = await fetch(`/api/tasks?projectId=${id}`);

        if (projectResponse.ok && taskResponse.ok) {
          const projectData = await projectResponse.json();
          const taskData = await taskResponse.json();
          setProject(projectData);
          setTasks(taskData);
        } else {
          console.error("Failed to fetch project or tasks");
        }
      } catch (error) {
        console.error("Error fetching project or tasks:", error);
      }
    };

    fetchProjectAndTasks();
  }, [id]);

  // Handle creating a new task
  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
    setIsModalOpen(false); // Close the modal
  };

  // Handle updating a task
  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // Handle deleting a task
  const handleTaskDeleted = (deletedTaskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== deletedTaskId));
  };

  if (!project) return <p>Loading...</p>;

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks
    ? (completedTasks / totalTasks) * 100
    : 0;

  return (
    <div className="px-10 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        &gt; {project.title}
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="border-b-2 border-black pb-3 font-semibold"
          onClick={() => router.back()}
        >
          {" "}
          &lt; {project.title}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 flex justify-between">
          <span>
            {completedTasks}/{totalTasks} Tasks Completed
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-[#FFA048] h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="border-2 border-dashed border-black/20 rounded-2xl w-full mt-10 p-7 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
        <button
          className="py-2 px-4 rounded-xl w-full border-2 border-[#d2d2d2] font-semibold flex gap-3 items-center justify-center h-auto hover:bg-[#FFA048] hover:border-[#FFA048] hover:text-white duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          <Image src={AddIcon} alt="Icon" />
          Add New Task
        </button>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskUpdated={handleTaskUpdated} // Pass update handler
            onTaskDeleted={handleTaskDeleted} // Pass delete handler
          />
        ))}
      </div>
      {isModalOpen && (
        <CreateTaskModal
          projectId={project.id}
          projectDeadline={project.deadline}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}
