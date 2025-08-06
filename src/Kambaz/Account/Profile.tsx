import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl, Button, Form } from "react-bootstrap";
import * as client from "./client";
import { setEnrollments } from "../reducer";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!profile.username?.trim()) {
      errors.username = "Username is required";
    } else if (profile.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    if (!profile.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!profile.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!profile.email?.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(profile.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!profile.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const dob = new Date(profile.dob);
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 13 || age > 120) {
        errors.dob = "Please enter a valid date of birth (age 13-120)";
      }
    }
    
    if (!profile.role) {
      errors.role = "Role is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const updateProfile = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const updatedProfile = await client.updateUser(profile);
      dispatch(setCurrentUser(updatedProfile));
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
      setSuccess("");
    }
  };

  const fetchProfile = () => {
    if (!currentUser) return navigate("/Kambaz/Account/Signin");
    setProfile(currentUser);
  };

  const signout = async () => {
    try {
      await client.signout();
      dispatch(setCurrentUser(null));
      dispatch(setEnrollments(null));
      navigate("/Kambaz/Account/Signin");
    } catch (err: any) {
      console.error("Signout error:", err);
      dispatch(setCurrentUser(null));
      dispatch(setEnrollments(null));
      navigate("/Kambaz/Account/Signin");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
    setError(""); // Clear error when user starts typing
    setSuccess(""); // Clear success message when user starts typing
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div id="wd-profile-screen" style={{ maxWidth: 500, width: "100%" }}>
        <h3 className="text-center mb-4">
          <i className="fas fa-user-edit me-2"></i>
          Profile
        </h3>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success mb-3" role="alert">
            <i className="fas fa-check-circle me-2"></i>
            {success}
          </div>
        )}
        {profile && (
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="wd-firstname">
                    <i className="fas fa-user me-2"></i>
                    First Name
                  </Form.Label>
                  <FormControl 
                    value={profile.firstName || ""} 
                    id="wd-firstname" 
                    className={`mb-1 ${validationErrors.firstName ? 'is-invalid' : ''}`}
                    placeholder="Enter your first name"
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
                  <FormControl 
                    value={profile.lastName || ""} 
                    id="wd-lastname" 
                    className={`mb-1 ${validationErrors.lastName ? 'is-invalid' : ''}`}
                    placeholder="Enter your last name"
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
              <FormControl 
                value={profile.username || ""} 
                id="wd-username" 
                className={`mb-1 ${validationErrors.username ? 'is-invalid' : ''}`}
                placeholder="Enter your username"
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
              <Form.Label htmlFor="wd-email">
                <i className="fas fa-envelope me-2"></i>
                Email
              </Form.Label>
              <FormControl 
                value={profile.email || ""} 
                id="wd-email" 
                type="email"
                className={`mb-1 ${validationErrors.email ? 'is-invalid' : ''}`}
                placeholder="Enter your email address"
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
                  <FormControl 
                    value={profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : ""} 
                    id="wd-dob" 
                    type="date"
                    className={`mb-1 ${validationErrors.dob ? 'is-invalid' : ''}`}
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
                    value={profile.role || ""} 
                    id="wd-role" 
                    className={`mb-1 ${validationErrors.role ? 'is-invalid' : ''}`}
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

            <div className="d-grid gap-2">
              <Button onClick={updateProfile} className="mb-2" variant="primary">
                <i className="fas fa-save me-2"></i>
                Update Profile
              </Button>
              <Button
                onClick={signout}
                className="mb-2"
                id="wd-signout-btn"
                variant="danger"
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Sign out
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
