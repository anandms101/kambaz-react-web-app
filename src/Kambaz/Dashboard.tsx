import { Button, Card, Col, Row, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Dashboard(
  {
    courses,
    course,
    setCourse,
    addCourse,
    deleteCourse,
    updateCourse,
    updateEnrollment,
    enrolling,
    setEnrolling,
  }: {
    courses: any[];
    course: any;
    setCourse: (course: any) => void;
    addCourse: () => void;
    deleteCourse: (course: any) => void;
    updateCourse: () => void;
    updateEnrollment: (courseId: string, enrolled: boolean) => void;
    enrolling: boolean;
    setEnrolling: (enrolling: boolean) => void;
  }
) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentReducer);
  const isFaculty = currentUser.role === "FACULTY";
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newlyAddedCourse, setNewlyAddedCourse] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedCourse, setUpdatedCourse] = useState<any>(null);

  const handleAddCourse = async () => {
    try {
      const newCourse = await addCourse();
      setNewlyAddedCourse(newCourse);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleDeleteClick = (course: any) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete._id);
        setShowDeleteModal(false);
        setCourseToDelete(null);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleUpdateCourse = async () => {
    try {
      await updateCourse();
      setUpdatedCourse(course);
      setShowUpdateModal(true);
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleEditClick = (course: any) => {
    setCourse(course);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      {isFaculty && (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-plus-circle me-2"></i>
                New Course
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-book me-2"></i>
                      Course Name
                    </label>
                    <input
                      value={course.name}
                      className="form-control"
                      onChange={(e) => setCourse({ ...course, name: e.target.value })}
                      placeholder="Enter course name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-align-left me-2"></i>
                      Course Description
                    </label>
                    <textarea
                      value={course.description}
                      className="form-control"
                      rows={3}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      placeholder="Enter course description"
                    />
                  </div>
                </div>
                <div className="col-md-4 d-flex flex-column justify-content-end">
                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={handleAddCourse}
                      id="wd-add-new-course-click"
                      className="mb-2"
                    >
                      <i className="fas fa-plus me-2"></i>
                      Add Course
                    </Button>
                    <Button
                      variant="warning"
                      onClick={handleUpdateCourse}
                      id="wd-update-course-click"
                    >
                      <i className="fas fa-edit me-2"></i>
                      Update Course
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="d-flex justify-content-between align-items-center">
        <h2 id="wd-dashboard-published">
          {enrolling ? "All Courses" : "My Courses"} ({courses.length})
        </h2>
        <Button 
          variant="primary"
          onClick={() => setEnrolling(!enrolling)}
          className="d-flex align-items-center gap-2"
        >
          {enrolling ? "My Courses" : "All Courses"}
        </Button>
      </div>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={2} lg={4} xl={5} className="gap-4">
          {courses.map((course) => {
            const isEnrolled = course.enrolled || (enrollments && enrollments.some(
              (enrollment: any) =>
                enrollment.user === currentUser._id &&
                enrollment.course === course._id
            ));
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
                      src={course.image || "/images/reactjs.jpg"}
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
                      {isFaculty && (
                        <>
                          <button
                            onClick={(event) => {
                              event.preventDefault();
                              handleDeleteClick(course);
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
                              handleEditClick(course);
                            }}
                            className="btn btn-warning me-2 float-end"
                          >
                            Edit
                          </button>
                        </>
                      )}
                      {enrolling && (
                        <Button
                          variant={isEnrolled ? "danger" : "success"}
                          className="float-end me-2"
                          onClick={(e) => {
                            e.preventDefault();
                            updateEnrollment(course._id, !isEnrolled);
                          }}
                        >
                          {isEnrolled ? "Unenroll" : "Enroll"}
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
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
            <h4 className="mt-3">{newlyAddedCourse?.name || "New Course"}</h4>
            <p className="text-muted">{newlyAddedCourse?.description || "Course description"}</p>
            <div className="row text-start">
              <div className="col-6">
                <strong>Course Number:</strong> {newlyAddedCourse?.number || "N/A"}
              </div>
              <div className="col-6">
                <strong>Start Date:</strong> {newlyAddedCourse?.startDate || "N/A"}
              </div>
              <div className="col-6">
                <strong>End Date:</strong> {newlyAddedCourse?.endDate || "N/A"}
              </div>
              <div className="col-6">
                <strong>Course ID:</strong> {newlyAddedCourse?._id || "N/A"}
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
              if (newlyAddedCourse?._id) {
                navigate(`/Kambaz/Courses/${newlyAddedCourse._id}/Home`);
              }
            }}
          >
            Go to Course
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">Are you sure?</h4>
            <p className="text-muted">
              You are about to delete the course: <strong>{courseToDelete?.name}</strong>
            </p>
            <p className="text-danger">
              <i className="fas fa-info-circle me-2"></i>
              This action cannot be undone. All course data, modules, and assignments will be permanently deleted.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <i className="fas fa-trash me-2"></i>
            Delete Course
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Course Updated Success Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Course Updated Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-check-circle text-success" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">{updatedCourse?.name || "Course"}</h4>
            <p className="text-muted">{updatedCourse?.description || "Course description"}</p>
            <div className="row text-start">
              <div className="col-6">
                <strong>Course Number:</strong> {updatedCourse?.number || "N/A"}
              </div>
              <div className="col-6">
                <strong>Start Date:</strong> {updatedCourse?.startDate || "N/A"}
              </div>
              <div className="col-6">
                <strong>End Date:</strong> {updatedCourse?.endDate || "N/A"}
              </div>
              <div className="col-6">
                <strong>Course ID:</strong> {updatedCourse?._id || "N/A"}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowUpdateModal(false);
              // Navigate to the updated course using React Router
              if (updatedCourse?._id) {
                navigate(`/Kambaz/Courses/${updatedCourse._id}/Home`);
              }
            }}
          >
            Go to Course
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
