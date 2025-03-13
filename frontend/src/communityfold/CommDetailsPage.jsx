import React, { useEffect, useState } from "react";
//import { useParams, useNavigate } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CommDetailsPage = () => {
  const {communityId} = useParams();
  const [community, setCommunity] = useState(null);
  useEffect(() => {
    if(communityId){
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/getCommunity/${communityId}`)
      .then((res) => {
        setCommunity(res.data);
      })
      .catch((err) => {
        console.log(err);
        window.alert("Something went wrong. Please try again.");
      });
    }
  },[communityId]);
  // const { id } = useParams(); // Get the community ID from the URL
  // const navigate = useNavigate(); // For navigation
  
  const navigate = useNavigate(); // For navigation
  const isAdmin = true; // Set this based on the user's role (e.g., from authentication context)

  // Sample data for posts in the community
  const [posts, setPosts] = useState([
    { id: 1, sender: "Admin", message: "Hello everyone! Let's discuss eco-friendly practices.", timestamp: "10:00 AM" },
    { id: 2, sender: "Admin", message: "Check out this photo of a solar panel installation!", timestamp: "10:05 AM", photo: "https://via.placeholder.com/150" },
    { id: 3, sender: "Admin", message: "Does anyone know good recycling centers in the area?", timestamp: "10:10 AM" },
  ]);

  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker
  const fileInputRef = React.useRef(null); // Ref for file input

  // Function to handle sending a new post/message
  const handleSendMessage = () => {
    if (isAdmin && newMessage.trim()) {
      const newPost = {
        id: posts.length + 1,
        sender: "Admin",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setPosts([...posts, newPost]);
      setNewMessage(""); // Clear the input field
    }
  };

  // Function to handle file upload (photos)
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const newPost = {
        id: posts.length + 1,
        sender: "Admin",
        message: "Photo",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        photo: URL.createObjectURL(uploadedFile),
      };
      setPosts([...posts, newPost]);
    }
  };

  // Function to handle leaving the community
  const handleLeaveCommunity = () => {
    
    axios
    .post(`${import.meta.env.VITE_BACKEND_URL}/exitCommunity/${communityId}`,
       {},{ withCredentials: true })
    .then((res) => {
      console.log(res.data);
      navigate("/communities");
      alert("User left community @ "+ community.name +" successfully");
    })
    .catch((err) => {
      console.log(err);
      window.alert("Something went wrong. Please try again.");
    });

  };

  // Function to add an emoji to the message
  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
    setShowEmojiPicker(false); // Hide the emoji picker after selecting an emoji
  };

  return (
    community && (<div className="p-6 bg-gradient-to-r from-[#D8F3DC] via-[#B7E4C7] via-[#A3D9C6] via-[#BFDCE5] to-[#D6E6F2] min-h-screen overflow-hidden relative">
      {/* Doodle Patterns */}
      <div className="absolute inset-0 bg-doodle-pattern opacity-10 z-0"></div>

      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-float"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Floating Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#4A6B5F] p-4 flex justify-between items-center shadow-md z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/communities")} // Navigate back to the communities list
          className="text-white hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        {/* Community Name */}
        <h1 className="text-xl font-bold text-white">{community.name}</h1>
        {/* Leave Button */}
        <button
          onClick={handleLeaveCommunity}
          className="text-white hover:text-gray-300"
        >
          Leave
        </button>
      </div>

      {/* Posts Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-16 mb-24">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-col items-start">
            <div className="max-w-[70%] p-3 rounded-lg bg-white text-gray-800 shadow-sm">
              {post.photo ? (
                <img src={post.photo} alt="Uploaded" className="rounded-lg mb-2" />
              ) : (
                <p className="text-sm">{post.message}</p>
              )}
              <span className="text-xs text-gray-500 block mt-1">
                {post.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      {isAdmin && (
        <div className="bg-white p-4 border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
          <div className="flex items-center space-x-2">
            {/* Attachment Icon */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="text-gray-500 hover:text-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            {/* Emoji Icon */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 bg-white border border-gray-200 rounded-lg p-2 shadow-lg">
                <div className="grid grid-cols-6 gap-2">
                  {["😀", "😍", "😂", "😎", "👍", "👏"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Message Input */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            {/* File Input (Hidden) */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />
            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
    )
  );
};

export default CommDetailsPage;