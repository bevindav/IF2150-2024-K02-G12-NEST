"use client";

import { useState } from "react";

interface EditTaskModalProps {
  task: any;
  projectDeadline: string; // Pass the project's deadline as a prop
  onClose: () => void;
  onTaskUpdated: (task: any) => void;
}

export default function EditTaskModal({
  task,
  projectDeadline,
  onClose,
  onTaskUpdated,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(
    new Date(task.deadline).toISOString().slice(0, 16) // Convert to datetime-local format
  );
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      deadline: "",
    };

    if (!title.trim()) {
      newErrors.title = "Task title is required.";
    }

    if (!description.trim()) {
      newErrors.description = "Task description is required.";
    }

    const taskDeadline = new Date(deadline);
    const projectDeadlineDate = new Date(
      new Date(projectDeadline).getTime() - 7 * 60 * 60 * 1000
    );

    if (!deadline) {
      newErrors.deadline = "Deadline is required.";
    } else if (taskDeadline <= new Date()) {
      newErrors.deadline = "Deadline must be a future date and time.";
    } else if (taskDeadline > projectDeadlineDate) {
      newErrors.deadline = `Deadline cannot surpass the project's deadline (${projectDeadlineDate}).`;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      id: task.id,
      title,
      description,
      deadline,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        onTaskUpdated(updatedTask); // Notify parent component
        onClose(); // Close the modal
        // Refresh page after successful task edit
        window.location.reload();
      } else {
        setErrors((prev) => ({
          ...prev,
          deadline: "Failed to update task. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setErrors((prev) => ({
        ...prev,
        deadline: "An error occurred while updating the task.",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Task's Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full rounded-md"
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Task's Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 w-full rounded-md"
              required
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border p-3 w-full rounded-md"
              required
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-2">{errors.deadline}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#F4F4F7] text-[#888DA7] py-3 px-4 rounded-md w-[30%] hover:text-white hover:bg-gray-700 duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white py-2 px-4 rounded-md font-semibold w-[70%] bg-[#FFA048] hover:bg-[#ba7535] duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
