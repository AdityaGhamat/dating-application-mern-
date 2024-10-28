import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000/");

const GlobalChat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");

  const joinRoom = () => {
    if (room.trim()) {
      socket.emit("join-room", room);
      setChatActive(true);
    } else {
      alert("Please enter a room name");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessages.trim() && room) {
      const messageData = { room, message: newMessages };
      socket.emit("send-message", messageData);
      setNewMessages(""); // Clear input after sending
    } else {
      alert("Message cannot be empty or room not set");
    }
  };

  useEffect(() => {
    const handleMessageReceive = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("received-message", handleMessageReceive);

    return () => {
      socket.off("received-message", handleMessageReceive); // Cleanup listener on unmount
    };
  }, []);

  return (
    <div className="global-chat-container">
      {!chatActive ? (
        <div className="join-room-container">
          <input
            type="text"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <>
          <div className="message-container">
            {messages.map((message, index) => (
              <div className="message" key={index}>
                <h3>{message}</h3>
              </div>
            ))}
          </div>
          <div className="input-container">
            <form onSubmit={handleSubmit}>
              <input
                className="message-input"
                type="text"
                value={newMessages}
                placeholder="Type your message"
                onChange={(e) => setNewMessages(e.target.value)}
              />
              <button className="send-button" type="submit">
                Send
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalChat;
