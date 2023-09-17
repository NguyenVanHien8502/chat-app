import "./styles.css";
import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Messages({ currentChat, currentUser, messages }) {
  const scrollRef = useRef();

  //cái này dùng để nó tự cuộn đến đoạn tin nhắn cuối cùng
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-container">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div ref={scrollRef} key={uuidv4()}>
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
