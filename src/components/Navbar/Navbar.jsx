import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  let { pathname } = useLocation();

  return (
    <div className="navbar-container">
      <Link
        to={pathname === "/" ? {} : "/"}
        key={"/"}
        style={pathname === "/" ? { pointerEvents: "none" } : {}}
      >
        <div className="navbar-sub-container" key={"/"}>
          <div className="navbar-link"> {"Home"} </div>
          {pathname === "/" ? (
            <div className="underline-page-selected"></div>
          ) : (
            <div className="navbar-underline"></div>
          )}
        </div>
      </Link>
      <Link
        to={pathname === "/assignment" ? {} : "/assignment"}
        key={"/assignment"}
        style={pathname === "/assignment" ? { pointerEvents: "none" } : {}}
      >
        <div className="navbar-sub-container" key={"/assignment"}>
          <div className="navbar-link"> {"Assignment"} </div>
          {pathname === "/assignment" ? (
            <div className="underline-page-selected"></div>
          ) : (
            <div className="navbar-underline"></div>
          )}
        </div>
      </Link>
      <Link
        to={pathname === "/leaderboard" ? {} : "/leaderboard"}
        key={"/leaderboard"}
        style={pathname === "/leaderboard" ? { pointerEvents: "none" } : {}}
      >
        <div className="navbar-sub-container" key={"/leaderboard"}>
          <div className="navbar-link"> {"Leaderboard"} </div>
          {pathname === "/leaderboard" ? (
            <div className="underline-page-selected"></div>
          ) : (
            <div className="navbar-underline"></div>
          )}
        </div>
      </Link>
      <Link
        to={pathname === "/admin" ? {} : "/admin"}
        key={"/admin"}
        style={pathname === "/admin" ? { pointerEvents: "none" } : {}}
      >
        <div className="navbar-sub-container" key={"/admin"}>
          <div className="navbar-link"> {"Upload"} </div>
          {pathname === "/admin" ? (
            <div className="underline-page-selected"></div>
          ) : (
            <div className="navbar-underline"></div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default Navbar;
