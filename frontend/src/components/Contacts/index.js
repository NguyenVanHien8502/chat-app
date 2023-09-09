import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.svg";
import "./styles.css";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await JSON.parse(localStorage.getItem("user"));
      setCurrentUserName(currentUser.username);
      setCurrentUserAvatar(currentUser.avatar);
    };
    fetchCurrentUser();
  }, []);

  const changeCurrentChat = (index, chat) => {
    setCurrentSelected(index);
    changeChat(chat);
  }

  return (
    <>
      {currentUserName && currentUserAvatar && (
        <div className="container-contacts">
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>

          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact ${
                  index === currentSelected ? "selected" : ""
                  }`}
                onClick={()=>changeCurrentChat(index,contact)}
              >
                <div className="avatar">
                  <img src={contact.avatar} alt="avatar" />
                </div>
                <div className="username">
                  <h4>{contact.username}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="current-user">
            <div className="avatar">
              <img src={currentUserAvatar} alt="avatar" />
            </div>
            <div className="username">
              <h4>{currentUserName}</h4>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
