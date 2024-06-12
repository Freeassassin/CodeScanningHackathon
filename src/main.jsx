import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import AssignmentPage from "./pages/AssignmentPage/AssignmentPage";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage";
import Navbar from "./components/Navbar/Navbar";

import "./index.css";
const HeaderLayout = () => (
  <>
    <header>
      <Navbar />
    </header>
    <Outlet />
  </>
);
const router = createBrowserRouter([
  {
    element: <HeaderLayout />,
    children: [
      {
        path: "/",
        element: (
          <div
            className="content-container"
            style={{
              position: "absolute",
              right: 0,
              left: 0,
              bottom: 0,
              top: 0,
            }}
          >
            <div style={{ minHeight: "90vh" }}>
              <HomePage />
            </div>
          </div>
        ),
      },
      {
        path: "/admin",
        element: (
          <div
            className="content-container"
            style={{
              position: "absolute",
              right: 0,
              left: 0,
              bottom: 0,
              top: 0,
            }}
          >
            <div style={{ minHeight: "100vh" }}>
              <AdminPage />
            </div>
          </div>
        ),
      },
      {
        path: "/assignment",
        element: (
          <div
            className="content-container"
            style={{
              position: "absolute",
              right: 0,
              left: 0,
              bottom: 0,
              top: 0,
            }}
          >
            <div style={{ minHeight: "100vh" }}>
              <AssignmentPage />
            </div>
          </div>
        ),
      },
      {
        path: "/leaderboard",
        element: (
          <div
            className="content-container"
            style={{
              position: "absolute",
              right: 0,
              left: 0,
              bottom: 0,
              top: 0,
            }}
          >
            <div style={{ minHeight: "100vh" }}>
              <LeaderboardPage />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <div
        className="content-container"
        style={{
          position: "absolute",
          right: 0,
          left: 0,
          bottom: 0,
          top: 0,
        }}
      >
        <div style={{ minHeight: "100vh" }}>
          <LoginPage />
        </div>
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
