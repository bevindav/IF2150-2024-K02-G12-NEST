"use client";
import { useState } from "react";

interface CreateProjectModalProps {
  onClose: () => void; // Callback to close the modal
  onProjectCreated: (newProject: any) => void; // Callback to handle project creation
}

export default function CreateProjectModal({
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errors, setErrors] = useState<{
    title: string;
    description: string;
    deadline: string;
    form?: string; // Added form as an optional property
  }>({
    title: "",
    description: "",
    deadline: "",
  });

  const validateForm = () => {
    const newErrors = {
      title: title.trim() ? "" : "Title is required.",
      description: description.trim() ? "" : "Description is required.",
      deadline:
        new Date(deadline) > new Date()
          ? ""
          : "Deadline must be a future date and time.",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          deadline,
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        console.log("Project created successfully:", newProject); // Debug: log created project
        onProjectCreated(newProject);
        onClose(); // Close the modal
      } else {
        console.error("Failed to create project");
        setErrors((prev) => ({
          ...prev,
          form: "Failed to create project. Please try again.",
        }));
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setErrors((prev) => ({
        ...prev,
        form: "An error occurred while creating the project.",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create a Project</h2>
        <form className="space-y-4">
          <div>
            <label className="block mb-2">Project's Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`border p-3 w-full rounded-md ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`border p-3 w-full rounded-md ${
                errors.description ? "border-red-500" : ""
              }`}
              placeholder="Enter project description"
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
              className={`border p-3 w-full rounded-md ${
                errors.deadline ? "border-red-500" : ""
              }`}
            />
            {errors.deadline && (
              <p className="text-red-500 text-sm mt-2">{errors.deadline}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-[#F4F4F7] text-[#888DA7] py-3 px-4 rounded-md w-[30%] hover:text-white hover:bg-gray-700 duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="text-white py-2 px-4 rounded-md font-semibold w-[70%] bg-[#FFA048] hover:bg-[#ba7535] duration-300"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
          {errors.form && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {errors.form}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
