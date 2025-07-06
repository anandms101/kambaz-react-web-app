import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1234/Home"
            className="wd-dashboard-course-link" >
            <img src="/images/Course1.png" width={200} />
            <div>
              <h5> CS 5010 Programming Design Paradigm </h5>
              <p className="wd-dashboard-course-title">
                Modern program design paradigms  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1235/Home"
            className="wd-dashboard-course-link" >
            <img src="/images/Course2.png" width={200} />
            <div>
              <h5> CS 5800 Algorithms </h5>
              <p className="wd-dashboard-course-title">
                Algorithmic design paradigms  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1236/Home"
            className="wd-dashboard-course-link" >
            <img src="/images/Course3.png" width={200} />
            <div>
              <h5> CS 5400 Principles of Programming Language </h5>
              <p className="wd-dashboard-course-title">
                Principles of Programming Language  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1237/Home"
            className="wd-dashboard-course-link" >
            <img src="/images/Course4.png" width={200} />
            <div>
              <h5> CS 5520 Mobile Application Development </h5>
              <p className="wd-dashboard-course-title">
                Memory management & user interface building  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1237/Home"
            className="wd-dashboard-course-link" >
            <img src="/images/Course5.png" width={200} />
            <div>
              <h5> CS 6510
                Advanced Software Development  </h5>
              <p className="wd-dashboard-course-title">
                Advanced software development paradigms  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1237/Home"
            className="wd-dashboard-course-link" >
            <img src="/images/Course6.png" width={200} />
            <div>
              <h5> CS 6710 Wireless Network </h5>
              <p className="wd-dashboard-course-title">
                Wireless network paradigms  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course">
          <Link to="/Kambaz/Courses/1237/Home"
            className="wd-dashboard-course-link" >
            <img src="/images/Course7.png" width={200} />
            <div>
              <h5> CS 6650
                Building Scalable Distributed Systems  </h5>
              <p className="wd-dashboard-course-title">
                Building scalable distributed systems  </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
