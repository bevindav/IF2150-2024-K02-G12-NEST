"use client"
import React, { useState } from "react";
import CreateTaskForm from "../app/component/createTaskForm"; // Import CreateTaskForm
import EditTaskForm from "../app/component/editTaskForm";     // Import EditTaskForm

const Page = () => {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Handlers for Create Task Form
  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  // Handlers for Edit Task Form
  const handleOpenEditForm = () => {
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Button to Open Create Task Form */}
      <button
        onClick={handleOpenCreateForm}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Task
      </button>

      {/* Button to Open Edit Task Form */}
      <button
        onClick={handleOpenEditForm}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Edit Task
      </button>

      {/* Conditional Rendering for Create Task Form */}
      {isCreateFormOpen && <CreateTaskForm onClose={handleCloseCreateForm} />}

      {/* Conditional Rendering for Edit Task Form */}
      {isEditFormOpen && (
        <EditTaskForm
          onClose={handleCloseEditForm}
          initialData={{ title: "Sample Task", date: "2024-01-01" }} // Provide initial data
        />
      )}
    </div>
  );
};

export default Page;
