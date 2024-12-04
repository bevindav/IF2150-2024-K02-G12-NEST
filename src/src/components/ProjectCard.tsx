"use client";
import { useState, useRef, useEffect } from "react";
import EditProjectModal from "./EditProjectModal";
import MoreIcon from "../../public/more-icon.svg";
import Image from "next/image";
import ProgressIcon from "../../public/progress-icon.svg";
import EditIcon from "../../public/edit-icon.svg";
import DeleteIIcon from "../../public/delete-icon.svg";
import Link from "next/link";

export default function ProjectCard({
  project,
  onProjectUpdated,
  onProjectDeleted,
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    const response = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project.id }),
    });

    if (response.ok) {
      onProjectDeleted(project.id);
      setIsDeleteModalOpen(false); // Close the delete confirmation modal
    } else {
      alert("Failed to delete project.");
    }
  };

  // Close the dropdown if clicked outside
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

  const tasks = project.tasks || []; // Safely handle undefined tasks

  return (
    <div className="border-2 border-[#E9E9E9] p-4 rounded-xl relative">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <Link
            href={`/projects/${project.id}`}
            className="font-bold hover:underline"
          >
            {project.title}
          </Link>
          <p className="text-[#8D8D90]">{project.description}</p>
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
      <div>
        <div className="text-sm pt-3 text-[#8D8D90] font-semibold flex justify-between items-center pb-2">
          <div className="flex gap-2">
            <Image src={ProgressIcon} alt="Icon" className="w-4" />
            <p> Progress </p>
          </div>
          <div>
            {tasks.filter((t: any) => t.completed).length}/{tasks.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-[#FFA048] h-2.5 rounded-full"
            style={{
              width: `${
                (tasks.filter((t: any) => t.completed).length / tasks.length) *
                  100 || 0
              }%`,
            }}
          ></div>
        </div>
      </div>
      <p className="mt-4">
        <span
          className={
            new Date(project.deadline) < new Date()
              ? "text-[#FF7979] bg-[#FFF2F2] px-3 py-1 rounded-full"
              : "text-[#888DA7] bg-[#F4F4F7] px-3 py-1 rounded-full "
          }
        >
          {new Date(project.deadline).toLocaleString()}
        </span>
      </p>
      <div className="flex justify-between items-center">
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
              <Image src={DeleteIIcon} alt="Icon" />
              Delete
            </button>
          </div>
        )}
      </div>
      {isEditing && (
        <EditProjectModal
          project={project}
          onClose={() => setIsEditing(false)}
          onProjectUpdated={onProjectUpdated}
        />
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Delete Project</h2>
            <p className="mb-4">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-[#F4F4F7] text-[#888DA7] py-2 px-4 rounded-md hover:text-white hover:bg-gray-700 duration-300"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 duration-300"
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
