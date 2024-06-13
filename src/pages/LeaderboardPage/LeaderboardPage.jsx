import axios from "axios";
import { useEffect, useState } from "react";
import "./LeaderboardPage.css";

function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/leaderboard`, {
        headers: {
          "Access-Control-Allow-Credentials": true,
          withCredentials: true,
        },
      })
      .then((res) => {
        console.log(res);
        setUsers(res.data.users);
      });
  }, []);

  return (
    <>
      <div className="leaderboard-container">
        <h2>Leaderboard</h2>
        {users.map((user, index) => (
          <div className="user" key={user._id}>
            <p
              style={{
                width: "3ch",
              }}
            >
              {index + 1}
            </p>
            <p>{user.username}</p>
            <p>{user.score}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default LeaderboardPage;
