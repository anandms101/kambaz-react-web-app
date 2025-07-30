import Account from "./Account";
import { Routes, Route, Navigate } from "react-router";
import KambazNavigation from "./Navigation";
import Dashboard from "./Dashboard";
import Courses from "./Courses";
import "./styles.css";
import * as db from "./Database";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ProtectedRoute from "./Account/protectedRoute";

export default function Kambaz() {
    const [courses, setCourses] = useState<any[]>(db.courses);
    const [course, setCourse] = useState<any>({
        _id: "1234", name: "New Course", number: "New Number",
        startDate: "2023-09-10", endDate: "2023-12-15", description: "New Description",
        image: "/images/reactjs.jpg",
    });
    const addNewCourse = () => {
        const newCourse = { ...course, _id: uuidv4() };
        setCourses([...courses, newCourse]);
        setCourse({
            _id: "1234", name: "New Course", number: "New Number",
            startDate: "2023-09-10", endDate: "2023-12-15", description: "New Description",
            image: "/images/reactjs.jpg",
        });
        return newCourse;
    };
    const deleteCourse = (courseId: any) => {
        setCourses(courses.filter((course) => course._id !== courseId));
    };
    const updateCourse = () => {
        setCourses(
            courses.map((c) => {
                if (c._id === course._id) {
                    return course;
                } else {
                    return c;
                }
            })
        );
    };


    return (
        <div id="wd-kambaz">
            <KambazNavigation />
            <div className="wd-main-content-offset p-3">
                <Routes>
                    <Route path="/" element={<Navigate to="Account" />} />
                    <Route path="/Account/*" element={<Account />} />
                    <Route path="Dashboard" element={<ProtectedRoute>
                        <Dashboard
                            courses={courses}
                            course={course}
                            setCourse={setCourse}
                            addNewCourse={addNewCourse}
                            deleteCourse={deleteCourse}
                            updateCourse={updateCourse} />
                    </ProtectedRoute>} />
                    <Route path="Courses/:cid/*" element={<ProtectedRoute> <Courses courses={courses} /></ProtectedRoute>} />
                    <Route path="/Calendar" element={<h1>Calendar</h1>} />
                    <Route path="/Inbox" element={<h1>Inbox</h1>} />
                </Routes>
            </div>
        </div>
    );
}

