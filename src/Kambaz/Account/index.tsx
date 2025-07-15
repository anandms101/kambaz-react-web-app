import Profile from "./Profile";
import Signin from "./Signin";
import Signup from "./Signup";
import { Routes, Route, Navigate } from "react-router";
import AccountNavigation from "./Navigation";
export default function Account() {
  return (
    <div id="wd-account-screen" className="d-flex">
      <div className="me-4">
        <AccountNavigation />
      </div>
      <div className="flex-fill">
        <Routes>
          <Route path="/"        element={<Navigate to="/Kambaz/Account/Signin" />} />
          <Route path="/Signin"  element={<Signin />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Signup"  element={<Signup />} />
        </Routes>
      </div>
    </div>
);}

