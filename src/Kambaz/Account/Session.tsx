import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import { setEnrollments } from "../reducer";

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
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

  // If we have a currentUser in Redux but session check failed, 
  // it might be a timing issue after signup - retry multiple times
  useEffect(() => {
    if (!pending && !currentUser && retryCount < 2) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setPending(true);
        fetchProfile();
      }, 3000); // Wait 3 seconds before retry
      
      return () => clearTimeout(timer);
    }
  }, [pending, currentUser, retryCount]);

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
        {retryCount > 0 && (
          <p className="mt-1 text-muted small">Retrying session check...</p>
        )}
      </div>
    </div>
  );
}
