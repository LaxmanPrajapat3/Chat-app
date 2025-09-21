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
    <div>
      <h3>Chat with {selectedUser?.name}</h3>
      <div style={{ height: "200px", overflowY: "scroll", border: "1px solid gray" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === user._id ? "right" : "left" }}>
            {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
