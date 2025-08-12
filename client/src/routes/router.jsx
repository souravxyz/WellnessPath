import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../components/pages/auth/Register";
import Login from "../components/pages/auth/Login";
import Dashboard from "../components/pages/session/Dashboard";
import MySessions from "../components/pages/session/MySessions";
import SessionEditor from "../components/pages/session/SessionEditor";
import PublicSessions from "../components/pages/session/PublicSessions";
import PublicSessionDetail from "../components/pages/session/PublicSessionDetail";
import EditProfile from "../components/pages/auth/EditProfile";
import ChangePassword from "../components/pages/auth/ChangePassword";
import ForgotPassword from "../components/pages/auth/ForgotPassword";
import ResetPassword from "../components/pages/auth/ResetPassword";
import VerifyEmail from "../components/pages/auth/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/verify/:token", element: <VerifyEmail /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/my-sessions", element: <MySessions /> },
      { path: "/", element: <PublicSessions /> },
      { path: "/my-sessions/new", element: <SessionEditor /> },
      { path: "/my-sessions/:id", element: <SessionEditor /> },
      { path: "/sessions/:id", element: <PublicSessionDetail /> },
      { path: "profile", element: <EditProfile /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token", element: <ResetPassword /> },

    ],
  },
]);

export default router;
