import axios from "axios";
import "./styles.css";
import React, { useEffect, useState } from "react";
import { getAllMsgRoute } from "../../utils/APIRoutes";

export default function Messages({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await axios.post(
        `${getAllMsgRoute}`,
        {
          opponent: currentChat?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );
      setMessages(data);
    };
    fetchMessages();
  }, [currentChat]);
  return (
    <div className="message-container">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === currentUser._id ? "sender" : "receiver"
            }`}
          >
            <div
              className={`content ${
                message.sender === currentUser._id
                  ? "msg-sender"
                  : "msg-receiver"
              }`}
            >
              <img
                src={
                  message.sender === currentUser._id
                    ? `${currentUser.avatar}`
                    : `${currentChat.avatar}`
                }
                alt=""
                className="img-msg"
              />
              <p>{message.message}</p>
            </div>
          </div>
        ))
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "white" }}>No messages available, let's start</h1>
        </div>
      )}
    </div>
  );
}
