import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

// Helper function to format dates nicely
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

export default function UsersTable({ users = [] }: { users?: any[] }) {
  return (
    <div id="wd-users-table" className="w-100">
      <table className="table table-striped w-100">
        <thead>
          <tr>
            <th className="w-20">Name</th>
            <th className="w-12">Login ID</th>
            <th className="w-8">Section</th>
            <th className="w-10">Role</th>
            <th className="w-25">Last Activity</th>
            <th className="w-25">Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name">
                <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none d-flex align-items-center">
                  <FaUserCircle className="me-2 fs-1 text-secondary flex-shrink-0" />
                  <span className="text-nowrap">
                    <span className="wd-first-name">{user.firstName}</span>{" "}
                    <span className="wd-last-name">{user.lastName}</span>
                  </span>
                </Link>
              </td>
              <td className="wd-login-id text-nowrap">{user.loginId}</td>
              <td className="wd-section text-nowrap">{user.section}</td>
              <td className="wd-role">
                <span className={`badge bg-${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="wd-last-activity text-nowrap">{formatDate(user.lastActivity)}</td>
              <td className="wd-total-activity text-nowrap">{user.totalActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Helper function to get badge colors for roles
const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN': return 'danger';
    case 'FACULTY': return 'primary';
    case 'TA': return 'warning';
    case 'STUDENT': return 'success';
    default: return 'secondary';
  }
}; 