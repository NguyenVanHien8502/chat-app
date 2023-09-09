import React, { useEffect, useState } from "react";
import Robot from "../../assets/robot.gif";
import "./styles.css";

export default function Welcome() {
  const [currentUsername, setCurrentUsername] = useState(undefined);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await JSON.parse(localStorage.getItem("user"));
      setCurrentUsername(currentUser.username);
    };
    fetchCurrentUser();
  }, []);
  return (
    <div className="container-welcome">
      <div className="header-welcome">
        <img src={Robot} alt="Robot" className="robot" />
        <h1>
          Welcome, <span>{currentUsername}</span>
        </h1>
      </div>
      <h2>Please select a chat to Start Messaging!</h2>
    </div>
  );
}
