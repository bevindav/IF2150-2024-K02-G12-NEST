"use client";

import { useState } from "react";

export default function EditTaskModal({ task, onClose, onTaskUpdated }: any) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(
    new Date(task.deadline).toISOString().slice(0, 16) // Convert to datetime-local format
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: task.id,
      title,
      description,
      deadline,
    };

    const response = await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      console.log("onTaskUpdated:", onTaskUpdated);
      onTaskUpdated(updatedTask);
      onClose();
    } else {
      alert("Failed to update task.");
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
          </div>
          <div>
            <label className="block mb-2">Task's Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 w-full rounded-md"
              required
            ></textarea>
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
