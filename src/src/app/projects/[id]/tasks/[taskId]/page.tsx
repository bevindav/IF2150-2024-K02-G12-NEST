"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function TaskDetailsPage() {
  const { taskId } = useParams(); // Extract taskId from route
  const [task, setTask] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (response.ok) {
          const data = await response.json();
          setTask(data);
          setComments(data.comments || []);
        } else {
          console.error("Failed to fetch task details");
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Validate input
    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, text: newComment }),
      });

      if (response.ok) {
        const createdComment = await response.json();
        setComments((prev) => [...prev, createdComment]);
        setNewComment("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editText.trim()) return; // Validate input
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });

      if (response.ok) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { ...comment, text: editText } : comment
          )
        );
        setEditingComment(null);
      } else {
        console.error("Failed to edit comment");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
    setShowConfirm(false);
    setCommentToDelete(null);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="px-10 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link href={`/projects/${task.project.id}`} className="hover:underline">
          {task.project.title}
        </Link>{" "}
        &gt; {task.title}
      </nav>

      {/* Task Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="border-b-2 border-black pb-3 font-semibold"
          onClick={() => router.back()}
        >
          {" "}
          &lt; {task.title}
        </button>
      </div>

      {/* Comments Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border rounded-lg p-4 shadow bg-white mb-4"
            >
              {editingComment === comment.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  ></textarea>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setEditingComment(null)}
                      className="text-sm px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="text-sm px-3 py-2 rounded-lg bg-[#FFA048] text-white hover:bg-orange-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === comment.id ? null : comment.id
                        )
                      }
                      className="text-gray-400 hover:text-gray-600 text-2xl mb-1"
                    >
                      ...
                    </button>
                    {activeMenu === comment.id && (
                      <div
                        className="absolute right-0 bg-white border border-gray-300 rounded-lg shadow-md z-10 w-36"
                        onBlur={closeMenu}
                        tabIndex={0}
                      >
                        <button
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditText(comment.text);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setCommentToDelete(comment.id);
                            setShowConfirm(true);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No comments yet. Add one below!
          </p>
        )}

        {/* Add Comment Section */}
        <div className="fixed bottom-10 left-0 w-full p-4">
          <div className="flex gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-2 text-sm border border-gray-300 rounded-md"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleAddComment}
              className="bg-[#FFA048] text-white text-sm px-3 py-2 rounded-lg shadow hover:bg-orange-600"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-56">
            <p className="text-gray-800 text-center mb-4">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-sm px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(commentToDelete!)}
                className="text-sm px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
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
