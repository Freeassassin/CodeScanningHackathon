import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import AdminPage from './pages/AdminPage/AdminPage';
import AssignmentPage from './pages/AssignmentPage/AssignmentPage';
import LeaderboardPage from './pages/LeaderboardPage/LeaderboardPage';
import LoginPage from './pages/LoginPage/LoginPage';

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: <AdminPage />
  },
  {
    path: '/assignment',
    element: <AssignmentPage />
  },
  {
    path: '/leaderboard',
    element: <LeaderboardPage />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
