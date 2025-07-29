import Profile from "./Profile";
import Signin from "./Signin";
import Signup from "./Signup";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router";
import AccountNavigation from "./Navigation";
export default function Account() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  return (
    <div id="wd-account-screen" className="d-flex">
      <div className="me-4">
        <AccountNavigation />
      </div>
      <div className="flex-fill d-flex justify-content-center align-items-center">
        <div className="w-50">
          <Routes>
            <Route path="/" element={<Navigate to={currentUser ? "/Kambaz/Account/Profile" : "/Kambaz/Account/Signin"} />} />
            <Route path="/Signin" element={<Signin />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

