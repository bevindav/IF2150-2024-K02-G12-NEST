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
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: project.id,
      title,
      description,
      deadline,
    };
    if (new Date(deadline) <= new Date()) {
      setError("Deadline must be a future date and time.");
      return;
    }
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
      window.location.reload();
    } else {
      console.error("Failed to update project:", await response.json()); // Debug server response
      alert("Failed to update project.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Project's Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full rounded-md"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Project's Description</label>
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
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
