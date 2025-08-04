import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import { setEnrollments } from "../reducer";

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  
  const fetchProfile = async () => {
    try {
      // Try to get the current user profile
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));

      // If we have a user, also fetch their enrollments
      if (currentUser) {
        try {
          const enrollments = await client.getEnrollments();
          dispatch(setEnrollments(enrollments));
        } catch (enrollmentErr: any) {
          // Suppress enrollment errors in console
          if (enrollmentErr.response?.status !== 401) {
            console.error("Error fetching enrollments:", enrollmentErr);
          }
          dispatch(setEnrollments([]));
        }
      }
    } catch (err: any) {
      // Suppress 401 errors in console since they're expected for new users
      if (err.response?.status !== 401) {
        console.error("Session error:", err);
      }
      dispatch(setCurrentUser(null));
      dispatch(setEnrollments([]));
    }
    setPending(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!pending) {
    return children;
  }
  
  // Show a loading state while checking session
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Checking session...</p>
      </div>
    </div>
  );
}
