import React, { useEffect, useState } from "react";
import "./styles.css";
import Logout from "../Logout";
import ChatInput from "../ChatInput";
import Messages from "../Messages";
import axios from "axios";
import { addMsgRoute, getAllMsgRoute } from "../../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.post(
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
      setMessages(response.data);
    };
    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

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
    socket.current.emit("send-msg", {
      message: msg,
      sender: currentUser._id,
      receiver: currentChat._id,
    });

    // dùng cái này để nó load được tin nhắn bên người gửi
    const msgs = [...messages];
    msgs.push({
      sender: currentUser._id,
      receiver: currentChat._id,
      message: msg,
    });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("receive-msg", (data) => {
        setArrivalMessage({
          message: data.message,
          sender: data.sender,
          receiver: data.receiver,
        });
      });
    }
  }, []);

  useEffect(() => {
    // dùng cái này để load được tin nhắn bên người nhận
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="user-detail">
          <img src={currentChat.avatar} alt="Avatar" />
          <h4>{currentChat.username}</h4>
        </div>
        <Logout />
      </div>
      <Messages
        currentChat={currentChat}
        currentUser={currentUser}
        socket={socket}
        messages={messages}
      />
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}
