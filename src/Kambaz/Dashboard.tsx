import { Button, Card, Col, Row, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleEnrollment, toggleShowAllEnrollments } from "./reducer";
import { useState } from "react";

export default function Dashboard(
  {
    courses,
    course,
    setCourse,
    addNewCourse,
    deleteCourse,
    updateCourse,
  }: {
    courses: any[];
    course: any;
    setCourse: (course: any) => void;
    addNewCourse: () => void;
    deleteCourse: (course: any) => void;
    updateCourse: () => void;
  }
) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments, showAllEnrollments } = useSelector((state: any) => state.enrollmentReducer);
  const isFaculty = currentUser.role === "FACULTY";
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newlyAddedCourse, setNewlyAddedCourse] = useState<any>(null);
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      {isFaculty &&
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={() => {
                const newCourse = addNewCourse();
                setNewlyAddedCourse(newCourse);
                setShowSuccessModal(true);
              }}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <input
            value={course.name}
            className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <textarea
            value={course.description}
            className="form-control"
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      }
      <div className="d-flex justify-content-between align-items-center">
        <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
        <Button 
          variant={showAllEnrollments ? "primary" : "outline-primary"}
          onClick={() => dispatch(toggleShowAllEnrollments())}
          className="d-flex align-items-center gap-2"
        >
          <i className={`fas fa-${showAllEnrollments ? 'eye' : 'eye-slash'}`}></i>
          {showAllEnrollments ? "Show Enrolled Only" : "Show All Courses"}
        </Button>
      </div>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={2} lg={4} xl={5} className="gap-4">
          {courses
            .filter((course) =>
              showAllEnrollments ||
              enrollments.some(
                (enrollment: any) =>
                  enrollment.user === currentUser._id &&
                  enrollment.course === course._id
              )
            )
            .map((course) => {
              const isEnrolled = enrollments.some(
                (enrollment: any) =>
                  enrollment.user === currentUser._id &&
                  enrollment.course === course._id
              );
              return (
                <Col
                  key={course._id}
                  className="wd-dashboard-course"
                  style={{ width: "350px" }}
                >
                  <Card
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      cursor: "pointer",
                      border: selectedCourseId === course._id ? "2px solid #ffc107" : "1px solid rgba(0,0,0,.125)",
                      backgroundColor: selectedCourseId === course._id ? "#fff3cd" : "white",
                      boxShadow: selectedCourseId === course._id ? "0 4px 8px rgba(255, 193, 7, 0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      setCourse(course);
                      setSelectedCourseId(course._id);
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={course.image}
                      height={200}
                      onError={(e) => {
                        // Fallback to React logo if the course image fails to load
                        e.currentTarget.src = "/images/reactjs.jpg";
                      }}
                    />
                    <Card.Body style={{ flexGrow: 1 }}>
                      <Card.Title className="wd-dashboard-course-title">
                        {course.name}
                      </Card.Title>
                      <Card.Text
                        className="wd-dashboard-course-description overflow-y-hidden"
                        style={{ maxHeight: 100 }}
                      >
                        {course.description}
                      </Card.Text>
                      <Link to={`/Kambaz/Courses/${course._id}/Home`}>
                        <Button variant="primary">Go</Button>
                      </Link>
                      {isFaculty && <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </>}
                      <Button
                        variant={isEnrolled ? "danger" : "success"}
                        className="float-end me-2"
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(toggleEnrollment({ userId: currentUser._id, courseId: course._id }))
                        }}>
                        {isEnrolled ? "Unenroll" : "Enroll"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
        </Row>
      </div>

      {/* Course Added Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Course Added Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-check-circle text-success" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">{newlyAddedCourse?.name}</h4>
            <p className="text-muted">{newlyAddedCourse?.description}</p>
            <div className="row text-start">
              <div className="col-6">
                <strong>Course Number:</strong> {newlyAddedCourse?.number}
              </div>
              <div className="col-6">
                <strong>Start Date:</strong> {newlyAddedCourse?.startDate}
              </div>
              <div className="col-6">
                <strong>End Date:</strong> {newlyAddedCourse?.endDate}
              </div>
              <div className="col-6">
                <strong>Course ID:</strong> {newlyAddedCourse?._id}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowSuccessModal(false);
              // Navigate to the new course using React Router
              navigate(`/Kambaz/Courses/${newlyAddedCourse?._id}/Home`);
            }}
          >
            Go to Course
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

