import React, { useState, useEffect } from "react";
import ChatComponent from "../components/GlobalChat";
import axios from "axios";
import { useCookies } from "react-cookie";
const Community = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [user, setUser] = useState();
  const userId = cookies.UserId;
  console.log(user);
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
  return (
    <div className="App">
      <ChatComponent name={user?.first_name} />
    </div>
  );
};

export default Community;
