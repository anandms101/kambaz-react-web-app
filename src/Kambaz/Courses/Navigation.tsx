import { Link, useParams, useLocation } from "react-router-dom";

export default function CourseNavigation() {
  const { cid } = useParams();
  const location = useLocation();

  const links = [
    "Home",
    "Modules",
    "Piazza",
    "Zoom",
    "Assignments",
    "Quizzes",
    "Grades",
    "People",
  ];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const path =
          link === "People"
            ? `/Kambaz/Courses/${cid}/People`
            : `/Kambaz/Courses/${cid}/${link}`;
        const isActive = location.pathname === path;
        return (
          <Link
            key={link}
            to={path}
            className={`list-group-item border border-0 ${isActive ? "active" : "text-danger"
              }`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}