"use client";
import { useState } from "react";

export default function EditProjectModal({
  project,
  onClose,
  onProjectUpdated,
}: any) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [deadline, setDeadline] = useState(
    new Date(project.deadline).toISOString().slice(0, 16) // Convert to datetime-local format
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: project.id,
      title,
      description,
      deadline,
    };

    console.log("Payload being sent:", payload); // Debug: log payload

    const response = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedProject = await response.json();
      console.log("Updated project received:", updatedProject); // Debug: log response
      onProjectUpdated(updatedProject); // Notify parent component
      onClose(); // Close the modal
    } else {
      console.error("Failed to update project:", await response.json()); // Debug server response
      alert("Failed to update project.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
              required
            ></textarea>
          </div>
          <div>
            <label>Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
