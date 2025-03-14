import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/generate`, {
        prompt: input,
      });

      const botMessage = { text: response.data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "⚠️ Error: Unable to fetch response", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      {/* Chat Container */}
      <div className="w-full max-w-4xl flex flex-col h-[80vh] border border-gray-700 bg-gray-800 rounded-lg shadow-lg">
        {/* Header */}
        <div className="p-4 bg-gray-700 text-lg font-semibold flex items-center justify-between border-b border-gray-600 rounded-t-lg">
          <span>Chatbot</span>
          <Bot className="w-6 h-6 text-white" />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 max-w-xs sm:max-w-md rounded-lg shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-700 text-white self-start"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="inline w-4 h-4 mr-2" />
                ) : (
                  <Bot className="inline w-4 h-4 mr-2" />
                )}
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex items-center space-x-2"
            >
              <Loader className="w-5 h-5 text-gray-400 animate-spin" />
              <span className="text-gray-400">Chatbot is typing...</span>
            </motion.div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Section */}
        <div className="p-3 flex items-center border-t border-gray-700 bg-gray-800 rounded-b-lg">
          <input
            type="text"
            className="flex-1 p-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
