import { Button, FormControl, Form, Card } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setEnrollments } from "../reducer";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const errors: any = {};
    
    if (!credentials.username?.trim()) {
      errors.username = "Username is required";
    }
    
    if (!credentials.password?.trim()) {
      errors.password = "Password is required";
    } else if (credentials.password.length < 3) {
      errors.password = "Password must be at least 3 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const signin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials({ ...credentials, [field]: value });
    setError(""); // Clear error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" });
    }
  };

  const TeamInformation = () => (
    <Card className="mb-4 shadow-sm mt-4" style={{ maxWidth: 600, width: "100%" }}>
      <Card.Header className="bg-primary text-white text-center">
        <h5 className="mb-0">
          <i className="fas fa-users me-2"></i>
          Project Team Information
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="row mb-3">
          <div className="col-12">
            <h6 className="text-muted mb-3">Team Members:</h6>
            <div className="list-group list-group-flush">
              <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                <div>
                  <strong>Anand Mohan Singh</strong>
                  <div className="small text-muted">CS5610 60924 Web Development SEC 01 Summer 2 2025</div>
                </div>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                <div>
                  <strong>Rahul Chinya Jagadeesha</strong>
                  <div className="small text-muted">CS5610 60924 Web Development SEC 01 Summer 2 2025</div>
                </div>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0 border-0">
                <div>
                  <strong>Nalini Singh</strong>
                  <div className="small text-muted">CS5610 60924 Web Development SEC 01 Summer 2 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-2">
            <h6 className="text-muted mb-2">Frontend Repository:</h6>
            <a 
              href="https://github.com/anandms101/kambaz-react-web-app/tree/quizes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm w-100"
            >
              <i className="fab fa-github me-2"></i>
              React Web App
            </a>
          </div>
          <div className="col-md-6 mb-2">
            <h6 className="text-muted mb-2">Backend Repository:</h6>
            <a 
              href="https://github.com/anandms101/kambaz-node-server-app-main/tree/quizes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-success btn-sm w-100"
            >
              <i className="fab fa-github me-2"></i>
              Node Server App
            </a>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh", padding: "2rem 0" }}>
      <div id="wd-signin-screen" style={{ maxWidth: 400, width: "100%" }}>
        <h1 className="text-center mb-4">
          <i className="fas fa-sign-in-alt me-2"></i>
          Sign in
        </h1>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="wd-username">
              <i className="fas fa-user me-2"></i>
              Username
            </Form.Label>
            <FormControl 
              value={credentials.username || ""}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`mb-1 ${validationErrors.username ? 'is-invalid' : ''}`}
              placeholder="Enter your username" 
              id="wd-username" 
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
            <FormControl 
              value={credentials.password || ""}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`mb-1 ${validationErrors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password" 
              type="password" 
              id="wd-password" 
            />
            {validationErrors.password && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {validationErrors.password}
              </div>
            )}
          </Form.Group>

          <Button 
            onClick={signin} 
            id="wd-signin-btn" 
            className="w-100 mb-3"
            disabled={isLoading}
            variant="primary"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Sign in
              </>
            )}
          </Button>
        </Form>
        
        <div className="text-center">
          <Link id="wd-signup-link" to="/Kambaz/Account/Signup" className="text-decoration-none">
            <i className="fas fa-user-plus me-1"></i>
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
      <TeamInformation />
    </div>
  );
}
