import React from "react";
import "./styles.css";
import Logout from "../Logout";

export default function ChatContainer({ currentChat }) {
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-detail">
          <img src={currentChat.avatar} alt="Avatar" />
          <h4>{currentChat.username}</h4>
        </div>
        <Logout />
      </div>
      <div className="chat-messages"></div>
      <div className="chat-input"></div>
    </div>
  );
}
