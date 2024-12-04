import React from "react";

interface CreateTaskFormProps {
  onClose: () => void;
}

const CreateTaskForm = ({ onClose }: CreateTaskFormProps) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="relative p-10 bg-white shadow-lg rounded-2xl w-1/3">
        {/* Close button on top-right */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-700 hover:text-black"
        >
          X
        </button>

        <h2 className="text-2xl font-semibold mb-8">Create a Task</h2>
        <form>
          {/* Task Title Input */}
          <div className="relative mb-4">
            <input 
              type="text" 
              id="task-title" 
              placeholder=" " 
              className="p-2 pl-4 pt-6 border-2 border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:border-[#5570F1] peer"
            />
            <label 
              htmlFor="task-title" 
              className="absolute pl-2 left-2 top-2 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#5570F1]"
            >
              Task's Title
            </label>
          </div>

          {/* Task Date Input */}
          <div className="relative mb-10">
            <input 
              type="date" 
              id="task-date" 
              placeholder=" " 
              className="p-2 pl-4 pt-6 border-2 border-gray-300 rounded-lg w-full text-sm focus:outline-none focus:border-[#5570F1] peer"
            />
            <label 
              htmlFor="task-date" 
              className="absolute pl-2 left-2 top-2 text-gray-400 text-xs transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#5570F1]"
            >
              Task's Date
            </label>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="px-4 py-[12px] bg-[#FFA048] font-semibold text-white text-lg rounded-lg w-full"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskForm;
