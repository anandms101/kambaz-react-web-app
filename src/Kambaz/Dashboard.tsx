import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
      <Row xs={1} md={5} className="g-4">
        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
              <Link to="/Kambaz/Courses/1234/Home">
                <Card.Img variant="top" src="/images/Course1.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
            </div>
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Link to="/Kambaz/Courses/1234/Home" className="text-decoration-none text-dark">
                <Card.Title className="wd-dashboard-course-title">CS 5010 Programming Design Paradigm</Card.Title>
                <Card.Text className="wd-dashboard-course-description">Modern program design paradigms</Card.Text>
              </Link>
              <Link to="/Kambaz/Courses/1234/Home" className="btn btn-primary mt-auto w-100">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
              <Link to="/Kambaz/Courses/1235/Home">
                <Card.Img variant="top" src="/images/Course2.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
            </div>
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Link to="/Kambaz/Courses/1235/Home" className="text-decoration-none text-dark">
                <Card.Title className="wd-dashboard-course-title">CS 5800 Algorithms</Card.Title>
                <Card.Text className="wd-dashboard-course-description">Algorithmic design paradigms</Card.Text>
              </Link>
              <Link to="/Kambaz/Courses/1235/Home" className="btn btn-primary mt-auto w-100">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
              <Link to="/Kambaz/Courses/1236/Home">
                <Card.Img variant="top" src="/images/Course3.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
            </div>
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Link to="/Kambaz/Courses/1236/Home" className="text-decoration-none text-dark">
                <Card.Title className="wd-dashboard-course-title">CS 5400 Principles of Programming Language</Card.Title>
                <Card.Text className="wd-dashboard-course-description">Principles of Programming Language</Card.Text>
              </Link>
              <Link to="/Kambaz/Courses/1236/Home" className="btn btn-primary mt-auto w-100">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
              <Link to="/Kambaz/Courses/1237/Home">
                <Card.Img variant="top" src="/images/Course4.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
            </div>
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Link to="/Kambaz/Courses/1237/Home" className="text-decoration-none text-dark">
                <Card.Title className="wd-dashboard-course-title">CS 5520 Mobile Application Development</Card.Title>
                <Card.Text className="wd-dashboard-course-description">Memory management & user interface building</Card.Text>
              </Link>
              <Link to="/Kambaz/Courses/1237/Home" className="btn btn-primary mt-auto w-100">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
              <Link to="/Kambaz/Courses/1237/Home">
                <Card.Img variant="top" src="/images/Course5.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
            </div>
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Link to="/Kambaz/Courses/1237/Home" className="text-decoration-none text-dark">
                <Card.Title className="wd-dashboard-course-title">CS 6510 Advanced Software Development</Card.Title>
                <Card.Text className="wd-dashboard-course-description">Advanced software development paradigms</Card.Text>
              </Link>
              <Link to="/Kambaz/Courses/1237/Home" className="btn btn-primary mt-auto w-100">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
              <Link to="/Kambaz/Courses/1237/Home">
                <Card.Img variant="top" src="/images/Course6.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
            </div>
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Link to="/Kambaz/Courses/1237/Home" className="text-decoration-none text-dark">
                <Card.Title className="wd-dashboard-course-title">CS 6710 Wireless Network</Card.Title>
                <Card.Text className="wd-dashboard-course-description">Wireless network paradigms</Card.Text>
              </Link>
              <Link to="/Kambaz/Courses/1237/Home" className="btn btn-primary mt-auto w-100">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col className="wd-dashboard-course" style={{ width: "300px" }}>
          <Card style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: 200, overflow: "hidden" }}>
              <Link to="/Kambaz/Courses/1237/Home">
                <Card.Img variant="top" src="/images/Course7.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Link>
            </div>
            <Card.Body className="d-flex flex-column flex-grow-1">
              <Link to="/Kambaz/Courses/1237/Home" className="text-decoration-none text-dark">
                <Card.Title className="wd-dashboard-course-title">CS 6650 Building Scalable Distributed Systems</Card.Title>
                <Card.Text className="wd-dashboard-course-description">Building scalable distributed systems</Card.Text>
              </Link>
              <Link to="/Kambaz/Courses/1237/Home" className="btn btn-primary mt-auto w-100">Go</Link>
            </Card.Body>
          </Card>
        </Col>
        </Row>
      </div>
    </div>
);}
