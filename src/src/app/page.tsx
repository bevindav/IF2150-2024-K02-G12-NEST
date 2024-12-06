"use client";
import { useState, useEffect } from "react";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectCard from "@/components/ProjectCard";
import Image from "next/image";
import AllProjectIcon from "../../public/all-project-icon.svg";
import AddIcon from "../../public/add-icon.svg";

interface Project {
  id: number;
  title: string;
  description: string;
  deadline: string; // ISO string
  tasks: any[];
}

export default function MainPage() {
  const [projects, setProjects] = useState<Project[]>([]); // State for storing projects
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched projects:", data); // Debug: log fetched projects
          setProjects(data); // Update the state with fetched projects
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    console.log("Project created:", newProject); // Debug: log created project
    setProjects((prev) => [...prev, newProject]);
    setIsModalOpen(false); // Close modal after creation
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const handleProjectDeleted = (deletedId: number) => {
    setProjects((prev) => prev.filter((project) => project.id !== deletedId));
  };

  return (
    <div className="px-10 pt-3">
      <div className="flex border-b-[3px] gap-3 pb-3 border-black w-fit">
        <Image src={AllProjectIcon} alt="Icon" />
        <h1 className="font-semibold"> All Projects </h1>
      </div>
      <div className="border-2 border-dashed border-black/20 rounded-2xl w-full mt-10 p-7 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <button
          className="py-2 px-4 rounded-xl w-full border-2 border-[#d2d2d2] font-semibold flex gap-3 items-center justify-center h-auto hover:bg-[#FFA048] hover:border-[#FFA048] hover:text-white duration-300"
          onClick={() => {
            console.log("Opening modal..."); // Debug: log modal open action
            setIsModalOpen(true);
          }}
        >
          <Image src={AddIcon} alt="Icon" />
          Add New Project
        </button>
        {isModalOpen && (
          <CreateProjectModal
            onClose={() => {
              console.log("Closing modal..."); // Debug: log modal close action
              setIsModalOpen(false);
            }}
            onProjectCreated={handleProjectCreated}
          />
        )}
        {/* Display projects */}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onProjectUpdated={handleProjectUpdated}
            onProjectDeleted={handleProjectDeleted}
          />
        ))}
      </div>
    </div>
  );
}
