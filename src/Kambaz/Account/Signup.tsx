import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

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
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!credentials.username.trim()) {
      errors.username = "Username is required";
    } else if (credentials.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    if (!credentials.password.trim()) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    if (!credentials.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!credentials.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!credentials.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(credentials.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!credentials.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const dob = new Date(credentials.dob);
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 13 || age > 120) {
        errors.dob = "Please enter a valid date of birth (age 13-120)";
      }
    }
    
    if (!credentials.role) {
      errors.role = "Role is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const signup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newUser = await client.signup(credentials);
      dispatch(setCurrentUser(newUser));
      navigate("/Kambaz/Dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials({ ...credentials, [field]: value });
    setError(""); // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div id="wd-signin-screen" style={{ maxWidth: 500, width: "100%" }}>
        <h1 className="text-center mb-4">
          <i className="fas fa-user-plus me-2"></i>
          Sign up
        </h1>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label htmlFor="wd-firstname">
                  <i className="fas fa-user me-2"></i>
                  First Name
                </Form.Label>
                <Form.Control 
                  id="wd-firstname"
                  placeholder="Enter your first name"
                  className={`mb-1 ${validationErrors.firstName ? 'is-invalid' : ''}`}
                  value={credentials.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
                {validationErrors.firstName && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-times-circle me-1"></i>
                    {validationErrors.firstName}
                  </div>
                )}
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label htmlFor="wd-lastname">
                  <i className="fas fa-user me-2"></i>
                  Last Name
                </Form.Label>
                <Form.Control 
                  id="wd-lastname"
                  placeholder="Enter your last name"
                  className={`mb-1 ${validationErrors.lastName ? 'is-invalid' : ''}`}
                  value={credentials.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
                {validationErrors.lastName && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-times-circle me-1"></i>
                    {validationErrors.lastName}
                  </div>
                )}
              </Form.Group>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="wd-username">
              <i className="fas fa-at me-2"></i>
              Username
            </Form.Label>
            <Form.Control 
              id="wd-username"
              placeholder="Choose a username"
              className={`mb-1 ${validationErrors.username ? 'is-invalid' : ''}`}
              value={credentials.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
            {validationErrors.username && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {validationErrors.username}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="wd-password">
              <i className="fas fa-lock me-2"></i>
              Password
            </Form.Label>
            <Form.Control 
              id="wd-password"
              placeholder="Choose a password" 
              type="password"
              className={`mb-1 ${validationErrors.password ? 'is-invalid' : ''}`}
              value={credentials.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            {validationErrors.password && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {validationErrors.password}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="wd-email">
              <i className="fas fa-envelope me-2"></i>
              Email
            </Form.Label>
            <Form.Control 
              id="wd-email"
              placeholder="Enter your email address"
              type="email"
              className={`mb-1 ${validationErrors.email ? 'is-invalid' : ''}`}
              value={credentials.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            {validationErrors.email && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {validationErrors.email}
              </div>
            )}
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label htmlFor="wd-dob">
                  <i className="fas fa-calendar me-2"></i>
                  Date of Birth
                </Form.Label>
                <Form.Control 
                  id="wd-dob"
                  placeholder="Select your date of birth"
                  type="date"
                  className={`mb-1 ${validationErrors.dob ? 'is-invalid' : ''}`}
                  value={credentials.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
                {validationErrors.dob && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-times-circle me-1"></i>
                    {validationErrors.dob}
                  </div>
                )}
              </Form.Group>
            </div>
            
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label htmlFor="wd-role">
                  <i className="fas fa-user-tag me-2"></i>
                  Role
                </Form.Label>
                <Form.Select 
                  id="wd-role"
                  className={`mb-1 ${validationErrors.role ? 'is-invalid' : ''}`}
                  value={credentials.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value="">Select your role</option>
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                </Form.Select>
                {validationErrors.role && (
                  <div className="invalid-feedback d-block">
                    <i className="fas fa-times-circle me-1"></i>
                    {validationErrors.role}
                  </div>
                )}
              </Form.Group>
            </div>
          </div>

          <Button 
            id="wd-signin-btn"
            onClick={signup}
            className="btn btn-primary w-100 mb-3"
            variant="primary"
          >
            <i className="fas fa-user-plus me-2"></i>
            Sign up 
          </Button>
        </Form>
        
        <div className="text-center">
          <Link id="wd-signup-link" to="/Kambaz/Account/Signin" className="text-decoration-none">
            <i className="fas fa-sign-in-alt me-1"></i>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>);
}
