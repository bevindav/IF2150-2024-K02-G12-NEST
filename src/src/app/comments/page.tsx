"use client";

import React, { useState } from "react";
import moment from "moment";
import { timeStamp } from "console";

const Page = () => {
  const [comments, setComments] = useState<{ text: string; timestamp: Date }[]>(
    []
  );
  const [newComment, setNewComment] = useState("");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const timestamp = new Date();
      setComments([...comments, { text: newComment, timestamp }]);
      setNewComment("");
      setActiveMenu(null);
      setEditingComment(null);
    }
  };

  const handleDeleteComment = (index: number) => {
    setComments(comments.filter((_, i) => i !== index));
    setActiveMenu(null);
  };

  const handleEditComment = (index: number) => {
    setEditingComment(index);
    setEditText(comments[index].text);
    setActiveMenu(null);
  };

  const handleSaveEdit = (index: number) => {
    if (editText.trim() === "") {
      setComments(comments.filter((_, i) => i != index));
    } else {
      const updatedComments = [...comments];
      updatedComments[index].text = editText;
      setComments(updatedComments);
    }
    setEditingComment(null);
  };

  const handleDeleteClick = (index: number) => {
    setCommentToDelete(index);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (commentToDelete !== null) {
      setComments(comments.filter((_, i) => i !== commentToDelete));
      setEditingComment(null);
    }
    setShowConfirm(false);
    setCommentToDelete(null);
    setActiveMenu(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setCommentToDelete(null);
    setActiveMenu(null);
  };

  const formatTime = (timestamp: Date) => {
    return moment(timestamp).fromNow();
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex items-center gap-2 px-1 py-3 border-b-2 border-b-black w-fit">
        <button className="text-gray-500">
          <img src="/backIcon.svg" />
        </button>
        <div className="font-bold text-lg text-gray-800">Task's Title</div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mt-4">
        {/* Comments Section */}
        <div className="p-6 overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow bg-white"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      added comment {formatTime(comment.timestamp)}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === index ? null : index)
                        }
                        className="text-gray-400 hover:text-gray-600 text-lg"
                      >
                        <img src="optionsIcon.svg" className="w-4 h-4" />
                      </button>
                      {activeMenu === index && (
                        <div className="absolute right-0 bg-white border border-gray-300 rounded-lg shadow-md z-10">
                          <button
                            onClick={() => handleEditComment(index)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <img
                              src="/editIcon.svg"
                              alt="Edit Icon"
                              className="w-3 h-3 mr-2"
                            />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(index)}
                            className="flex items-center px-4 py-2 mr-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                          >
                            <img
                              src="deleteIcon.svg"
                              alt="Delete Icon"
                              className="w-3 h-3 mr-2"
                            />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingComment === index ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(index);
                          }
                        }}
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
                          onClick={() => handleSaveEdit(index)}
                          className="text-sm px-3 py-2 rounded-lg bg-[#FFA048] text-white hover:bg-orange-600"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No comments yet. Add a comment below.
              </div>
            )}
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="fixed bottom-5 left-0 w-full p-4">
          <div className="w-full max-w-2xl mx-auto flex items-center gap-3 border border-gray-300 rounded-xl p-2 bg-white shadow-lg">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
              placeholder="Type your comment here"
              className="flex-1 p-2 text-sm focus:outline-none"
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

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg pt-5 shadow-lg w-80">
            <p className="text-gray-800 text-center border-b-2 pb-3">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={confirmDelete}
                className=" text-red-500 px-4 pt-4 pb-5 hover:bg-gray-100 hover:rounded-bl-lg flex-1 text-center border-r-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="text-gray-700 px-4 pt-4 pb-5 hover:bg-gray-100 hover:rounded-br-lg flex-1 text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
