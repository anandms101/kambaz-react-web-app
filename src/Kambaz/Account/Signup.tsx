import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as db from "../Database";

export default function Signup() {
  const [credentials, setCredentials] = useState({ 
    username: "", 
    password: "", 
    firstName: "", 
    lastName: "", 
    email: "", 
    dob: "",
    role: "FACULTY"
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signup = () => {
    if (!credentials.username.trim() || !credentials.password.trim() || 
        !credentials.firstName.trim() || !credentials.lastName.trim() || 
        !credentials.email.trim() || !credentials.dob || !credentials.role) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if username already exists
    const existingUser = db.users.find((u: any) => u.username === credentials.username);
    if (existingUser) {
      alert("Username already exists. Please choose a different username.");
      return;
    }

    // Create new user
    const newUser = {
      _id: Date.now().toString(), // Simple ID generation
      username: credentials.username,
      password: credentials.password,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      dob: credentials.dob,
      role: credentials.role,
      loginId: "",
      section: "",
      lastActivity: new Date().toISOString().split('T')[0],
      totalActivity: "00:00:00"
    };

    // Add to database (in a real app, this would be an API call)
    db.users.push(newUser);
    
    // Set current user and navigate to profile
    dispatch(setCurrentUser(newUser));
    navigate("/Kambaz/Dashboard");
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div id="wd-signin-screen" style={{ maxWidth: 400, width: "100%" }}>
        <h1>Sign up</h1>
        <Form.Control 
          id="wd-username"
          placeholder="Username"
          className="mb-2"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <Form.Control 
          id="wd-password"
          placeholder="Password" 
          type="password"
          className="mb-2"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <Form.Control 
          id="wd-firstname"
          placeholder="First Name"
          className="mb-2"
          value={credentials.firstName}
          onChange={(e) => setCredentials({ ...credentials, firstName: e.target.value })}
        />
        <Form.Control 
          id="wd-lastname"
          placeholder="Last Name"
          className="mb-2"
          value={credentials.lastName}
          onChange={(e) => setCredentials({ ...credentials, lastName: e.target.value })}
        />
        <Form.Control 
          id="wd-email"
          placeholder="Email"
          type="email"
          className="mb-2"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        />
        <Form.Control 
          id="wd-dob"
          placeholder="Date of Birth"
          type="date"
          className="mb-2"
          value={credentials.dob}
          onChange={(e) => setCredentials({ ...credentials, dob: e.target.value })}
        />
        <Form.Select 
          id="wd-role"
          className="mb-2"
          value={credentials.role}
          onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
        >
          <option value="STUDENT">Student</option>
          <option value="FACULTY">Faculty</option>
        </Form.Select>
        <Button 
          id="wd-signin-btn"
          onClick={signup}
          className="btn btn-primary w-100 mb-2">
          Sign up 
        </Button>
        <Link id="wd-signup-link" to="/Kambaz/Account/Signin">Sign in</Link>
      </div>
    </div>);
}
