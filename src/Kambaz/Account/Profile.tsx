import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl, Button } from "react-bootstrap";
import * as client from "./client";
import { setEnrollments } from "../reducer";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const updateProfile = async () => {
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
      // Even if signout fails, clear local state
      dispatch(setCurrentUser(null));
      dispatch(setEnrollments(null));
      navigate("/Kambaz/Account/Signin");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div id="wd-profile-screen" style={{ maxWidth: 400, width: "100%" }}>
        <h3>Profile</h3>
        {error && (
          <div className="alert alert-danger mb-2" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success mb-2" role="alert">
            {success}
          </div>
        )}
        {profile && (
          <div>
            <FormControl 
              defaultValue={profile.username} 
              id="wd-username" 
              className="mb-2"
              onChange={(e) => {
                setProfile({ ...profile, username: e.target.value });
                setError(""); // Clear error when user starts typing
              }}
            />
            <FormControl 
              defaultValue={profile.password} 
              id="wd-password" 
              className="mb-2"
              onChange={(e) => {
                setProfile({ ...profile, password: e.target.value });
                setError(""); // Clear error when user starts typing
              }}
            />
            <FormControl 
              defaultValue={profile.firstName} 
              id="wd-firstname" 
              className="mb-2"
              onChange={(e) => {
                setProfile({ ...profile, firstName: e.target.value });
                setError(""); // Clear error when user starts typing
              }}
            />
            <FormControl 
              defaultValue={profile.lastName} 
              id="wd-lastname" 
              className="mb-2"
              onChange={(e) => {
                setProfile({ ...profile, lastName: e.target.value });
                setError(""); // Clear error when user starts typing
              }}
            />
            <FormControl 
              defaultValue={profile.dob} 
              id="wd-dob" 
              className="mb-2"
              onChange={(e) => {
                setProfile({ ...profile, dob: e.target.value });
                setError(""); // Clear error when user starts typing
              }}
              type="date"
            />
            <FormControl 
              defaultValue={profile.email} 
              id="wd-email" 
              className="mb-2"
              onChange={(e) => {
                setProfile({ ...profile, email: e.target.value });
                setError(""); // Clear error when user starts typing
              }}
            />
            <select 
              onChange={(e) => {
                setProfile({ ...profile, role: e.target.value });
                setError(""); // Clear error when user starts typing
              }}
              className="form-control mb-2" 
              id="wd-role"
              defaultValue={profile.role}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
            </select>
            <div>
              <Button onClick={updateProfile} className="w-100 mb-2">
                Update
              </Button>
              <Button
                onClick={signout}
                className="w-100 mb-2"
                id="wd-signout-btn"
                variant="danger"
              >
                Sign out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
