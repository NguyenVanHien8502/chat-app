import React, { useEffect, useState } from "react";
import "./styles.css";
import axios from "axios";
import { getAllUsers } from "../../utils/APIRoutes";

export default function Chat() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);

  //fetch all users
  const fetchAllUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const { data } = await axios.get(`${getAllUsers}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUsers(data);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <>
      <div className="container">
        <div className="main">
          <div className="contacts">
            <h1>SNAPPY</h1>
            <div className="contacts-2">
              {users.map((user) => (
                <div className="contacts-21" key={user._id}>
                  <div className="avatar">
                    <img src={user.avatar} alt="avatar" />
                  </div>
                  <div className="username">
                    <p>{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="contacts-3">
              <div className="avatar">
                <img src={currentUser.avatar} alt="avatar" />
              </div>
              <div className="username">
                <p>{currentUser.username}</p>
              </div>
            </div>
          </div>
          <div className="main-chat"></div>
        </div>
      </div>
    </>
  );
}
