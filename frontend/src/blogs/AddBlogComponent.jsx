import { useState } from "react";
import { FiImage, FiSend } from "react-icons/fi";

export default function BlogForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="flex justify-center gap-6 p-6 w-full h-screen bg-gray-100">
      <div className="w-1/6 bg-gray-500 p-4 rounded-lg shadow-xl flex flex-col justify-center items-center text-white">
        <h3 className="text-lg font-bold">Advertisement</h3>
        <p className="mt-2 text-center text-sm">Your ad content here.</p>
      </div>
      <div className="p-6 w-3/5 bg-white shadow-2xl rounded-xl border border-gray-300 flex flex-col h-full relative">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900 text-center">Create a Blog</h2>
        <div className="mb-3">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Blog Title</label>
          <input
            type="text"
            placeholder="Enter Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-lg text-lg focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-md bg-gray-50"
          />
        </div>
        <div className="mb-3 flex-grow h-full">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Blog Content</label>
          <textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-lg h-[350px] text-lg focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-md bg-gray-50"
          ></textarea>
        </div>
        <div className="flex items-center justify-between p-3 bg-indigo-200 rounded-lg w-full shadow-lg mt-3 border border-indigo-400">
          <label className="flex items-center cursor-pointer text-indigo-700 text-md hover:text-indigo-900">
            <FiImage className="text-2xl mr-2" />
            <span>Add Image</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <button className="flex items-center bg-indigo-700 text-white px-5 py-2 rounded-lg text-md hover:bg-indigo-800 shadow-lg">
            <FiSend className="text-2xl mr-2" /> Post
          </button>
        </div>
      </div>
      <div className="w-1/6 bg-gray-500 p-4 rounded-lg shadow-xl flex flex-col justify-center items-center text-white">
        <h3 className="text-lg font-bold">Advertisement</h3>
        <p className="mt-2 text-center text-sm">Your ad content here.</p>
      </div>
    </div>
  );
}