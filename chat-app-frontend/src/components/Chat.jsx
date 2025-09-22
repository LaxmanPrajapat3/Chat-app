

import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const socket = io("http://localhost:5000");

export default function Chat({ selectedUser }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    if (!user || !selectedUser) return;

    socket.emit("join", user._id);

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/messages?from=${user._id}&to=${selectedUser._id}`,
        { headers: { Authorization: token } }
      );
      setMessages(res.data);
    };
    fetchMessages();

    socket.on("receiveMessage", (msg) => {
      if (msg.from === selectedUser._id || msg.to === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user, selectedUser]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:5000/api/messages",
      { from: user._id, to: selectedUser._id, message: newMsg },
      { headers: { Authorization: token } }
    );

    socket.emit("sendMessage", res.data);
    setMessages((prev) => [...prev, res.data]);
    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 flex-1">
      {/* Chat Header */}
      <div className="bg-purple-600 text-white px-4 py-3 shadow-md">
        <h3 className="text-lg font-semibold">
          Chat with {selectedUser?.name || "User"}
        </h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                msg.from === user._id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center border-t border-gray-300 p-3 bg-white">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
