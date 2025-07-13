import { Link } from "react-router-dom";
import { useLocation } from "react-router";
export default function AccountNavigation() {
  const { pathname } = useLocation();
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      <Link to="/Kambaz/Account/Signin" id="wd-account-signin-link"
        className={`list-group-item border border-0 ${pathname.includes("Signin") ? "active" : "text-danger"}`}> Sign In </Link>
      <Link to="/Kambaz/Account/Profile" id="wd-account-profile-link"
        className={`list-group-item border border-0 ${pathname.includes("Profile") ? "active" : "text-danger"}`}> Profile </Link>
      <Link to="/Kambaz/Account/Signup" id="wd-account-signup-link"
        className={`list-group-item border border-0 ${pathname.includes("Signup") ? "active" : "text-danger"}`}> Sign Up </Link>
    </div>
  );
}