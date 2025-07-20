import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
  const { aid, cid } = useParams();
  const assignments = db.assignments;

  type Assignment = {
    _id: string;
    title: string;
    course: string;
    not_available_until: string;
    due: string;
    points: number;
    description: string;
    assignment_group: string;
    display_grade_as: string;
    submission_type: string;
    online_entry_option: string[];
  };

  const assignment = (assignments as Assignment[]).find(a => a._id === aid);

  if (!assignment) {
    return <div>Assignment not found.</div>;
  }

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <Form>
        {/* Assignment Name */}
        <Form.Group className="row mb-2" controlId="wd-name">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Name</Form.Label>
          <div className="col-md-9">
            <Form.Control type="text" defaultValue={assignment.title} />
          </div>
        </Form.Group>

        {/* Assignment Description */}
        <Form.Group className="row mb-3" controlId="wd-description">
          <Form.Label className="col-md-3 col-form-label text-md-end">Description</Form.Label>
          <div className="col-md-9">
            <Form.Control
              as="textarea"
              rows={8}
              defaultValue={assignment.description}
            />
          </div>
        </Form.Group>

        {/* Points */}
        <Form.Group className="row mb-2" controlId="wd-points">
          <Form.Label className="col-md-3 col-form-label text-md-end">Points</Form.Label>
          <div className="col-md-9">
            <Form.Control type="number" defaultValue={assignment.points} />
          </div>
        </Form.Group>

        {/* Assignment Group */}
        <Form.Group className="row mb-2" controlId="wd-assign-group">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Group</Form.Label>
          <div className="col-md-9">
            <Form.Select defaultValue={assignment.assignment_group}>
              <option value="ASSIGNMENTS">Assignments</option>
              <option value="PROJECT">Project</option>
              <option value="QUIZ">Quiz</option>
              <option value="EXAM">Exam</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Display Grade As */}
        <Form.Group className="row mb-2" controlId="wd-display-grade-as">
          <Form.Label className="col-md-3 col-form-label text-md-end">Display Grade As</Form.Label>
          <div className="col-md-9">
            <Form.Select defaultValue={assignment.display_grade_as}>
              <option value="Percentage">Percentage</option>
              <option value="Decimal">Decimal</option>
              <option value="Letters">Letters</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Submission Type */}
        <Form.Group className="row mb-2" controlId="wd-submission-type">
          <Form.Label className="col-md-3 col-form-label text-md-end">Submission Type</Form.Label>
          <div className="col-md-9">
            <Form.Select defaultValue={assignment.submission_type}>
              <option value="Online">Online</option>
              <option value="In Person">In Person</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Online Entry Options */}
        <Form.Group className="row mb-3">
          <Form.Label className="col-md-3 col-form-label text-md-end"></Form.Label>
          <div className="col-md-9 border p-3 rounded">
            <div className="mb-2 fw-bold">Online Entry Options</div>
            <Form.Check type="checkbox" id="checkbox1" label="Website URL" defaultChecked={assignment.online_entry_option.includes('Website URL')} className="mb-2" />
            <Form.Check type="checkbox" id="checkbox2" label="File Uploads" defaultChecked={assignment.online_entry_option.includes('File Uploads')} className="mb-2" />
          </div>
        </Form.Group>

        {/* Assign To, Due Date, and Availability */}
        <Form.Group className="row mb-4">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assign</Form.Label>
          <div className="col-md-9 border p-3 rounded">
            <div className="mb-3">
              <Form.Label className="fw-bold">Assign to</Form.Label>
              <Form.Control type="text" defaultValue="Everyone" id="wd-assign-to" />
            </div>
            <div className="mb-3">
              <Form.Label className="fw-bold">Due</Form.Label>
              <Form.Control type="date" id="wd-date-due" defaultValue={assignment.due} className="mb-2" />
            </div>
            <div className="d-flex gap-3">
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Available from</Form.Label>
                <Form.Control type="date" id="wd-date-available" defaultValue={assignment.not_available_until} className="mb-2" />
              </div>
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Until</Form.Label>
                <Form.Control type="date" id="wd-date-until" defaultValue={assignment.due} className="mb-2" />
              </div>
            </div>
          </div>
        </Form.Group>

        {/* Action Buttons */}
        <div className="row">
          <div className="col text-end">
            <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="me-2">
              <Button variant="secondary" size="lg">Cancel</Button>
            </Link>
            <Button variant="danger" size="lg">Save</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

