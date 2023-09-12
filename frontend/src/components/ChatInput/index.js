import React from "react";
import "./styles.css";
import { MdSend } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";

export default function ChatInput() {
  return (
    <div className="chat-input-container">
      <div className="emoij">
        <BsEmojiSmile className="icon"/>
      </div>
      <form className="input-container">
        <div className="text-input">
          <input type="text" placeholder="Type your message here..." />
        </div>
        <div className="send-button">
          <button>
            <MdSend className="icon"/>
          </button>
        </div>
      </form>
    </div>
  );
}
