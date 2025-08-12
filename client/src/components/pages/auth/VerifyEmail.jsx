import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:4545/api/auth/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 3000); // Redirect after 3 seconds
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      {status === "loading" && <p>Verifying your email, please wait...</p>}
      {status === "success" && (
        <>
          <h2>Success!</h2>
          <p>{message}</p>
          <p>Redirecting to login page...</p>
        </>
      )}
      {status === "error" && (
        <>
          <h2>Verification Failed</h2>
          <p>{message}</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </>
      )}
    </div>
  );
}
