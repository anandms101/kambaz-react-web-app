import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import PeopleTable from "./Courses/People/Table";
import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "./Account/protectedRoute";
import { useSelector, useDispatch } from "react-redux";
import Dashboard from "./Dashboard";
import Session from "./Account/Session";
import * as courseClient from "./Courses/client";
import * as userClient from "./Account/client";
import { setEnrollments } from "./reducer";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchEnrollments = useCallback(async () => {
    try {
      const enrollments = await userClient.getEnrollments();
      dispatch(setEnrollments(enrollments));
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }, [dispatch]);

  const findCoursesForUser = useCallback(async () => {
    try {
      const userCourses = await userClient.findCoursesForUser(currentUser._id);
      setCourses(userCourses);
    } catch (error) {
      console.error("Error fetching user courses:", error);
    }
  }, [currentUser]);

  const fetchAllCourses = useCallback(async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(currentUser._id);
      
      // Mark courses as enrolled or not
      const coursesWithEnrollment = allCourses.map((course: any) => {
        const isEnrolled = enrolledCourses.some((enrolledCourse: any) => 
          enrolledCourse._id === course._id
        );
        return { ...course, enrolled: isEnrolled };
      });
      
      setCourses(coursesWithEnrollment);
    } catch (error) {
      console.error("Error fetching all courses:", error);
    }
  }, [currentUser]);

  const updateEnrollment = useCallback(async (courseId: string, enrolled: boolean) => {
    try {
      if (!currentUser) {
        console.error("No current user found");
        return;
      }
      
      if (enrolled) {
        await userClient.enrollIntoCourse(currentUser._id, courseId);
      } else {
        await userClient.unenrollFromCourse(currentUser._id, courseId);
      }

      await fetchEnrollments(); // Refresh enrollments after toggle

      setCourses(
        courses.map((course) => {
          if (course._id === courseId) {
            return { ...course, enrolled: enrolled };
          } else {
            return course;
          }
        })
      );
    } catch (error) {
      console.error("Error updating enrollment:", error);
    }
  }, [currentUser, courses, fetchEnrollments]);

  const [course, setCourse] = useState<any>({
    _id: "1234",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
  });

  const addCourse = async () => {
    const newCourse = await courseClient.addCourse(course);
    // Refresh the courses list to include the new course based on current view
    if (enrolling) {
      await fetchAllCourses();
    } else {
      await findCoursesForUser();
    }
    // Reset the course form after adding
    setCourse({
      _id: "1234",
      name: "New Course",
      number: "New Number",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      description: "New Description",
    });
    return newCourse; // Return the created course data
  };

  const deleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    // Refresh the courses list after deletion based on current view
    if (enrolling) {
      await fetchAllCourses();
    } else {
      await findCoursesForUser();
    }
  };

  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    // Refresh the courses list after update based on current view
    if (enrolling) {
      await fetchAllCourses();
    } else {
      await findCoursesForUser();
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchEnrollments();
      if (enrolling) {
        fetchAllCourses();
      } else {
        findCoursesForUser();
      }
    }
  }, [currentUser, enrolling, fetchEnrollments, findCoursesForUser, fetchAllCourses]);

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route
              path="/Dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard
                    courses={courses}
                    course={course}
                    setCourse={setCourse}
                    addCourse={addCourse}
                    deleteCourse={deleteCourse}
                    updateCourse={updateCourse}
                    updateEnrollment={updateEnrollment}
                    enrolling={enrolling}
                    setEnrolling={setEnrolling}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Courses/:cid/*"
              element={
                <ProtectedRoute>
                  <Courses courses={courses} />
                </ProtectedRoute>
              }
            />
            <Route path="/People" element={<PeopleTable />} />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}

