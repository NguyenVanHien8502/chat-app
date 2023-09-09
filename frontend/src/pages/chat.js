import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getAllUsers } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  useEffect(() => {
    const checkAlreadyUser = async () => {
      if (!localStorage.getItem("user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("user")));
      }
    };
    checkAlreadyUser();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (currentUser) {
        const { data } = await axios.get(`${getAllUsers}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        setContacts(data);
      }
    };
    fetchAllUsers();
  }, [currentUser]);

  const handleChangeChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChangeChat} />
          {currentChat ? <div>hello</div> : <Welcome />}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;