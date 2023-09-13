import React from "react";
import "./styles.css";
import Logout from "../Logout";
import ChatInput from "../ChatInput";
import Messages from "../Messages";

export default function ChatContainer({ currentChat }) {
  const handleSendMsg = (msg) => {
    alert(msg);
  };
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-detail">
          <img src={currentChat.avatar} alt="Avatar" />
          <h4>{currentChat.username}</h4>
        </div>
        <Logout />
      </div>
      <Messages />
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
