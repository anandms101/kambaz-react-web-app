import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
export default function AssignmentsControls() {
  const { cid } = useParams();
  return (
    <div id="wd-modules-controls" className="d-flex align-items-center justify-content-between mb-3" style={{ gap: 16 }}>
      <InputGroup style={{ maxWidth: 400 }}>
        <InputGroup.Text id="search-icon">
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Search for Assignments"
          aria-label="Search for Assignments"
          aria-describedby="search-icon"
        />
      </InputGroup>
      <div>
        <Button variant="light" size="lg" className="me-2" id="wd-add-module-btn">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group
        </Button>
        <Link to={`/Kambaz/Courses/${cid}/Assignments/Editor`}>
          <Button variant="danger" size="lg" id="wd-add-module-btn">
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Assignment
          </Button>
        </Link>
      </div>
    </div>
  );
}