import React from "react";
import "./styles.css";
import Logout from "../Logout";
import ChatInput from "../ChatInput";
import Messages from "../Messages";
import axios from "axios";
import { addMsgRoute } from "../../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser }) {
  const handleSendMsg = async (msg) => {
    await axios.post(
      `${addMsgRoute}`,
      {
        message: msg,
        receiver: currentChat._id,
      },
      {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      }
    );
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
      <Messages currentChat={currentChat} currentUser={currentUser} />
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
