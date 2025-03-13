import React, { useState } from "react";

const CreateCommunityModal = ({ onClose, onCreate }) => {
  const [communityName, setCommunityName] = useState("");
  const [communityTheme, setCommunityTheme] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");

  const handleDone = () => {
    if (!communityName || !communityTheme || !communityDescription) {
      alert("All fields are required!");
      return;
    }

    // Return the entered details
    onCreate({
      name: communityName,
      theme: communityTheme,
      description: communityDescription,
    });

    // Reset fields
    setCommunityName("");
    setCommunityTheme("");
    setCommunityDescription("");
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D8F3DC] via-[#B7E4C7] via-[#A3D9C6] via-[#BFDCE5] to-[#D6E6F2] opacity-95"></div>
      
      {/* Modal Content */}
      <div className="relative bg-white w-[40%] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create a New Community</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Community Name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Community Theme"
            value={communityTheme}
            onChange={(e) => setCommunityTheme(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Description"
            value={communityDescription}
            onChange={(e) => setCommunityDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
            required
          />
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityModal;