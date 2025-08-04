import { Button, FormControl } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setEnrollments } from "../reducer";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const signin = async () => {
    if (!credentials.username?.trim() || !credentials.password?.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const user = await client.signin(credentials);
      if (!user) {
        setError("Invalid username or password. Please try again.");
        return;
      }
      
      setError(""); // Clear any previous errors
      dispatch(setCurrentUser(user));

      const enrollments = await client.getEnrollments();
      dispatch(setEnrollments(enrollments));
      navigate("/Kambaz/Dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signin failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div id="wd-signin-screen" style={{ maxWidth: 400, width: "100%" }}>
        <h1>Sign in</h1>
        {error && (
          <div className="alert alert-danger mb-2" role="alert">
            {error}
          </div>
        )}
        <FormControl 
          value={credentials.username || ""}
          onChange={(e) => {
            setCredentials({ ...credentials, username: e.target.value });
            setError(""); // Clear error when user starts typing
          }}
          className="mb-2" 
          placeholder="Username" 
          id="wd-username" 
        />
        <FormControl 
          value={credentials.password || ""}
          onChange={(e) => {
            setCredentials({ ...credentials, password: e.target.value });
            setError(""); // Clear error when user starts typing
          }}
          className="mb-2" 
          placeholder="Password" 
          type="password" 
          id="wd-password" 
        />
        <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-2">
          Sign in
        </Button>
        <Link id="wd-signup-link" to="/Kambaz/Account/Signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
