import axios from "axios";
import "./LoginPage.css";

function LoginPage({ setRerender }) {
  return (
    <div className="login-container">
      <div className="login-info-container">
        <h1
          style={{
            marginBottom: "1.5vh",
          }}
        >
          Login
        </h1>
        <form
          style={{ width: "100%" }}
          onSubmit={async (event) => {
            event.preventDefault();
            localStorage.setItem("username", event.target.username.value);
            const user = await axios.post("http://localhost:5001/login", {
              username: event.target.username.value,
            });
            if (user) {
              setRerender((render) => !render);
            }
          }}
        >
          <input
            type="text"
            placeholder="Username"
            name="username"
            style={{
              padding: "2vh",
              fontSize: "large",
              width: "100%",
            }}
          />
          <button
            style={{
              padding: "2vh 0vw",
              fontSize: "large",
              margin: "2vh 0",
              width: "100%",
            }}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
