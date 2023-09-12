import React, { useState } from "react";
import "./styles.css";
import { MdSend } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="chat-input-container">
      <div className="emoji-container">
        <div className="emoji">
          <BsEmojiSmile className="icon" onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div className="abc">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <div className="text-input">
          <input
            type="text"
            placeholder="Type your message here..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>
        <div className="send-button">
          <button type="submit">
            <MdSend className="icon" />
          </button>
        </div>
      </form>
    </div>
  );
}
