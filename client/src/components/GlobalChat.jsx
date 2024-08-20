import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000/");

const GlobalChat = ({ name }) => {
  const [username, setUsername] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: newMessages,
    };
    !newMessages == ""
      ? socket.emit("send-message", messageData)
      : alert("message cannot be empty");
  };

  useEffect(() => {
    socket.on("received-message", (message) => {
      setMessages([...messages, message]);
    });
    console.log(messages);
  }, [socket, messages]);

  return (
    <div className="global-chat-container">
      <div className="message-container">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <h3>{message.message}</h3>
          </div>
        ))}
      </div>
      <div className="input-container">
        {chatActive ? (
          <form onSubmit={handleSubmit}>
            <input
              className="message-input"
              type="text"
              placeholder="Type your message"
              onChange={(e) => setNewMessages(e.target.value)}
            />
            <button className="send-button" type="submit">
              Send
            </button>
          </form>
        ) : (
          <button className="start-button" onClick={() => setChatActive(true)}>
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default GlobalChat;
