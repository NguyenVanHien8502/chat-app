import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logout from "../../assets/logout.png";
import "./styles.css";

export default function Logout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await localStorage.removeItem("user");
    await Cookies.remove("refreshToken");
    navigate("/login");
  };
  return (
    <div className="logout">
      <button className="logout-button" onClick={handleLogout}>
        <img src={logout} alt="Logout" />
      </button>
    </div>
  );
}
