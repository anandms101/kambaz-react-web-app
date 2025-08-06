import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport, BiSolidBarChartAlt2, BiSolidBell, BiSolidHome, BiSolidMegaphone } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { Button, Card } from "react-bootstrap";

export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-chart-line me-2"></i>
            Course Status
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex gap-2 mb-3">
            <Button variant="secondary" size="lg" className="flex-fill">
              <MdDoNotDisturbAlt className="me-2 fs-5" /> 
              Unpublish 
            </Button>
            <Button variant="success" size="lg" className="flex-fill">
              <FaCheckCircle className="me-2 fs-5" /> 
              Publish 
            </Button>
          </div>
          
          <div className="d-grid gap-2">
            <Button variant="outline-secondary" size="lg" className="text-start">
              <BiImport className="me-2 fs-5" /> 
              Import Existing Content 
            </Button>
            <Button variant="outline-secondary" size="lg" className="text-start">
              <LiaFileImportSolid className="me-2 fs-5" /> 
              Import From Commons 
            </Button>
            <Button variant="outline-secondary" size="lg" className="text-start">
              <BiSolidHome className="me-2 fs-5" /> 
              Choose Home Page 
            </Button>
            <Button variant="outline-secondary" size="lg" className="text-start">
              <BiSolidBarChartAlt2 className="me-2 fs-5" /> 
              View Course Screen 
            </Button>
            <Button variant="outline-secondary" size="lg" className="text-start">
              <BiSolidMegaphone className="me-2 fs-5" /> 
              New Announcement 
            </Button>
            <Button variant="outline-secondary" size="lg" className="text-start">
              <BiSolidBarChartAlt2 className="me-2 fs-5" /> 
              New Analytics 
            </Button>
            <Button variant="outline-secondary" size="lg" className="text-start">
              <BiSolidBell className="me-2 fs-5" /> 
              View Course Notifications 
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}