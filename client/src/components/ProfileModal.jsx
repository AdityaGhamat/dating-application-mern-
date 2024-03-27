import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import axios from "axios";
const ProfileModal = () => {
  const [user, setUser] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const userId = cookies.UserId;
  const getUser = async () => {
    try {
      const response = await axios.get(
        "https://dating-application-mern.onrender.com/user",
        {
          params: { userId },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  console.log(user);
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="img-container">
          <img src={user.url} alt={"photo of " + user.first_name} />
        </div>
        <h3>{user.first_name}</h3>
      </div>
      <div className="profile-details">
        <p>
          <strong>ID:</strong> {user._id}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>About:</strong> {user.about}
        </p>
        <p>
          <strong>Date of Birth:</strong> {user.dob_month}/{user.dob_day}/
          {user.dob_year}
        </p>
        <p>
          <strong>Gender Identity:</strong> {user.gender_identity}
        </p>
        <p>
          <strong>Gender Interest:</strong> {user.gender_interest}
        </p>
      </div>
    </div>
  );
};

export default ProfileModal;
