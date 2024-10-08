import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { adduser } from "../redux/userSlice";
import { Link } from "react-router-dom";
const Dashboard = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState();
  const [genderedUsers, setGenderedUsers] = useState();
  const [lastDirection, setLastDirection] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gendered-users", {
        params: { gender: user?.gender_interest },
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user != null) {
      dispatch(adduser(user));
    }
  }, [user, dispatch]);
  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  );

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <Link to={"/community"} className="commnunity-headline">
              Community
            </Link>
            <div className="card-container">
              {filteredGenderedUsers &&
                filteredGenderedUsers.map((genderedUser) => (
                  <TinderCard
                    className="swipe"
                    key={genderedUser.user_id}
                    onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                    onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                  >
                    <div
                      style={{
                        backgroundImage: "url(" + genderedUser.url + ")",
                      }}
                      className="card"
                    >
                      <h3>{genderedUser.first_name}</h3>
                    </div>
                  </TinderCard>
                ))}
              <div className="swipe-info">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard;
