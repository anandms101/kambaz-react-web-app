import { Routes, Route, useParams, useLocation, Navigate } from "react-router";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./People/Table";
import Quizzes from "../Quizzes";
import QuizDetails from "../Quizzes/QuizDetails";
import QuizEditor from "../Quizzes/QuizEditor";
import QuizPreview from "../Quizzes/QuizPreview";
import TakeQuiz from "../Quizzes/TakeQuiz";
import QuizResults from "../Quizzes/QuizResults";
import QuestionsEditor from "../Quizzes/QuestionsEditor";

export default function Courses(
  { courses }: { courses: any[]; }
) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name}  &gt; {pathname.split("/")[4]} </h2> <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Piazza" element={<h2>Piazza</h2>} />
            <Route path="Zoom" element={<h2>Zoom</h2>} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/Editor" element={<AssignmentEditor />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="Quizzes" element={<Quizzes />} />
            <Route path="Quizzes/:quizId" element={<QuizDetails />} />
            <Route path="Quizzes/:quizId/Edit" element={<QuizEditor />} />
            <Route path="Quizzes/:quizId/Preview" element={<QuizPreview />} />
            <Route path="Quizzes/:quizId/Take" element={<TakeQuiz />} />
            <Route path="Quizzes/:quizId/Results" element={<QuizResults />} />
        <Route path="Quizzes/:quizId/Questions" element={<QuestionsEditor />} />
            <Route path="Grades" element={<h2>Grades</h2>} />
            <Route path="People" element={<PeopleTable />} />
          </Routes>
        </div></div>
    </div>

  );
}


