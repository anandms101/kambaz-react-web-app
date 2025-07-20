import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router";
import * as db from "./Database";
export default function Dashboard() {
  const courses = db.courses;
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((course) => (
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
                <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
                  <Link to={`/Kambaz/Courses/${course._id}/Home`}>
                    <Card.Img variant="top" src={course.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Link>
                </div>
                <Card.Body className="d-flex flex-column flex-grow-1">
                  <Link to={`/Kambaz/Courses/${course._id}/Home`} className="text-decoration-none text-dark">
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden"> {course.name} </Card.Title>
                    <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }} >{course.description}</Card.Text>
                  </Link>
                  <Link to={`/Kambaz/Courses/${course._id}/Home`} className="btn btn-primary mt-auto w-100">Go</Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
