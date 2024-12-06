"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import EditTaskModal from "./EditTaskModal";
import MoreIcon from "../../public/more-icon.svg";
import Image from "next/image";
import CommentIcon from "../../public/comment-icon.svg";
import EditIcon from "../../public/edit-icon.svg";
import DeleteIcon from "../../public/delete-icon.svg";
import { DateTime } from "luxon";

export default function TaskCard({ task, onTaskUpdated, onTaskDeleted }: any) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(task.completed); // Track the checkbox state
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id }),
    });
    if (response.ok) {
      onTaskDeleted(task.id);
      setIsDeleteModalOpen(false);
    } else {
      alert("Failed to delete task.");
    }
  };

  const handleCompletionToggle = async () => {
    setIsChecked(!isChecked); // Toggle the checkbox state

    // Update task completion status in the backend
    const response = await fetch(`/api/tasks/${task.id}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      onTaskUpdated(updatedTask);
    } else {
      alert("Failed to update task status.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border-2 border-[#E9E9E9] p-4 rounded-xl relative">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h2 className={`font-bold ${task.completed ? "line-through" : ""}`}>
            {task.title}
          </h2>
          <p className="text-[#8D8D90]">{task.description}</p>
        </div>
        <div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="border-2 border-[#E9E9E9] rounded-full flex items-center justify-center  px-1 py-2"
          >
            <Image src={MoreIcon} alt="Icon" className="w-3" />
          </button>
        </div>
      </div>

      {/* Deadline */}
      <p className="pt-3">
        <span
          className={
            new Date(new Date(task.deadline).getTime() - 7 * 60 * 60 * 1000) <
              new Date() && !isChecked
              ? "text-[#FF7979] bg-[#FFF2F2] px-3 py-1 rounded-full"
              : "text-[#888DA7] bg-[#F4F4F7] px-3 py-1 rounded-full "
          }
        >
          {DateTime.fromISO(task.deadline, { zone: "utc" }).toFormat(
            "yyyy-MM-dd HH:mm"
          )}
        </span>
      </p>

      <div className="pt-5 flex justify-between">
        {/* Comments Link */}
        <Link
          href={`/projects/${task.projectId}/tasks/${task.id}`}
          className="text-[#1C1D22] hover:scale-105 flex items-center justify-center gap-2 duration-300"
        >
          <Image src={CommentIcon} alt="Icon" />{" "}
          <p className="pb-1">{task.comments?.length || 0}</p>
        </Link>

        {/* Checkbox to mark as completed */}
        <div className="flex gap-2 items-center justify-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCompletionToggle}
              className="hidden"
            />
            {/* Custom checkbox */}
            <div
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                isChecked
                  ? "bg-[#FFA048] border-[#FFA048]"
                  : "bg-gray-200 border-gray-300"
              }`}
            >
              {isChecked && (
                <div className="w-full h-full flex justify-center items-center text-white text-xs">
                  ✔
                </div>
              )}
            </div>
            <p
              className={`${
                isChecked ? "text-[#FFA048] font-semibold" : "text-[#888DA7]"
              }`}
            >
              Mark as Done
            </p>
          </label>
        </div>
      </div>

      {/* Dropdown menu for Edit and Delete */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-2 top-10 bg-white border shadow-lg rounded-xl p-2 z-50 text-sm"
        >
          <button
            onClick={() => {
              setIsEditing(true);
              setIsDropdownOpen(false);
            }}
            className="flex text-left w-full px-4 py-2 hover:bg-gray-100 text-[#8D8D90] items-center gap-2 rounded-lg"
          >
            <Image src={EditIcon} alt="Icon" />
            Edit
          </button>
          <button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setIsDropdownOpen(false);
            }}
            className="flex text-left w-full px-4 py-2 hover:bg-gray-100 text-[#FF7979] items-center gap-2 rounded-lg"
          >
            <Image src={DeleteIcon} alt="Icon" />
            Delete
          </button>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditing && (
        <EditTaskModal
          task={task}
          projectDeadline={task.project?.deadline || ""}
          onClose={() => setIsEditing(false)}
          onTaskUpdated={onTaskUpdated}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Task</h2>
            <p className="mb-4">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-[#F4F4F7] text-[#888DA7] py-2 px-4 rounded-md hover:text-white hover:bg-gray-700 duration-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-700 duration-300"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
