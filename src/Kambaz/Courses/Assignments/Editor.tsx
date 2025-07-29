import { Button, Form } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAssignment, addAssignment } from "./reducer";

export default function AssignmentEditor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { aid, cid } = useParams();

  const { assignments } = useSelector((state: any) => state.assignmentReducer);
  const currentAssignment = assignments.find((assignment: any) => assignment._id === aid);

  // Get today's date and time at 11:11 PM
  const getDefaultDateTime = () => {
    const today = new Date();
    today.setHours(23, 11, 0, 0); // 11:11 PM
    return today.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  // Initialize assignment state properly for new vs existing assignments
  const [assignment, setAssignment] = useState<any>(
    currentAssignment || {
      title: "",
      description: "",
      points: 100,
      due: getDefaultDateTime(),
      from: getDefaultDateTime(),
      until: getDefaultDateTime(),
      course: cid
    }
  );

  const assignmentName = assignment?.title || "";
  const description = assignment?.description || "";
  const points = assignment?.points || 100;
  const dueDate = assignment?.due || "";
  const availableDate = assignment?.from || "";
  const untilDate = assignment?.until || "";

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <h3>{aid ? "Edit Assignment" : "Add New Assignment"}</h3>
      <Form>
        {/* Assignment Name */}
        <Form.Group className="row mb-3" controlId="wd-name">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Name</Form.Label>
          <div className="col-md-9">
            <Form.Control
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignment((prev: any) => ({ ...prev, title: e.target.value }))}
              placeholder="New Assignment"
            />
          </div>
        </Form.Group>

        {/* Assignment Description */}
        <Form.Group className="row mb-3" controlId="wd-description">
          <Form.Label className="col-md-3 col-form-label text-md-end">New Assignment Description</Form.Label>
          <div className="col-md-9">
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setAssignment((prev: any) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter assignment description"
            />
          </div>
        </Form.Group>

        {/* Points */}
        <Form.Group className="row mb-3" controlId="wd-points">
          <Form.Label className="col-md-3 col-form-label text-md-end">Points</Form.Label>
          <div className="col-md-9">
            <Form.Control
              type="number"
              value={points}
              onChange={(e) => setAssignment((prev: any) => ({ ...prev, points: e.target.value }))}
              placeholder="100"
            />
          </div>
        </Form.Group>

        {/* Assignment Group */}
        <Form.Group className="row mb-3" controlId="wd-assign-group">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Group</Form.Label>
          <div className="col-md-9">
            <Form.Select
              value={assignment?.assignment_group || "ASSIGNMENTS"}
              onChange={(e) => setAssignment((prev: any) => ({ ...prev, assignment_group: e.target.value }))}
            >
              <option value="ASSIGNMENTS">Assignments</option>
              <option value="PROJECT">Project</option>
              <option value="QUIZ">Quiz</option>
              <option value="EXAM">Exam</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Display Grade As */}
        <Form.Group className="row mb-3" controlId="wd-display-grade-as">
          <Form.Label className="col-md-3 col-form-label text-md-end">Display Grade As</Form.Label>
          <div className="col-md-9">
            <Form.Select
              value={assignment?.display_grade_as || "Percentage"}
              onChange={(e) => setAssignment((prev: any) => ({ ...prev, display_grade_as: e.target.value }))}
            >
              <option value="Percentage">Percentage</option>
              <option value="Decimal">Decimal</option>
              <option value="Letters">Letters</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Submission Type */}
        <Form.Group className="row mb-3" controlId="wd-submission-type">
          <Form.Label className="col-md-3 col-form-label text-md-end">Submission Type</Form.Label>
          <div className="col-md-9">
            <Form.Select
              value={assignment?.submission_type || "Online"}
              onChange={(e) => setAssignment((prev: any) => ({ ...prev, submission_type: e.target.value }))}
            >
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
            <Form.Check
              type="checkbox"
              id="checkbox1"
              label="Website URL"
              checked={assignment?.online_entry_option?.includes('Website URL') || false}
              onChange={(e) => {
                const currentOptions = assignment?.online_entry_option || [];
                const newOptions = e.target.checked
                  ? [...currentOptions, 'Website URL']
                  : currentOptions.filter((opt: string) => opt !== 'Website URL');
                setAssignment((prev: any) => ({ ...prev, online_entry_option: newOptions }));
              }}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="checkbox2"
              label="File Uploads"
              checked={assignment?.online_entry_option?.includes('File Uploads') || false}
              onChange={(e) => {
                const currentOptions = assignment?.online_entry_option || [];
                const newOptions = e.target.checked
                  ? [...currentOptions, 'File Uploads']
                  : currentOptions.filter((opt: string) => opt !== 'File Uploads');
                setAssignment((prev: any) => ({ ...prev, online_entry_option: newOptions }));
              }}
              className="mb-2"
            />
          </div>
        </Form.Group>

        {/* Assign Section */}
        <Form.Group className="row mb-4">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assign</Form.Label>
          <div className="col-md-9 border p-3 rounded">
            <div className="mb-3">
              <Form.Label className="fw-bold">Assign to</Form.Label>
              <Form.Control
                type="text"
                value={assignment?.assign_to || "Everyone"}
                onChange={(e) => setAssignment((prev: any) => ({ ...prev, assign_to: e.target.value }))}
                id="wd-assign-to"
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fw-bold">Due</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setAssignment((prev: any) => ({ ...prev, due: e.target.value }))}
                  className="me-2"
                />
                <i className="fas fa-calendar"></i>
                <i className="fas fa-clock ms-2"></i>
              </div>
            </div>
            <div className="d-flex gap-3">
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Available from</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="datetime-local"
                    value={availableDate}
                    onChange={(e) => setAssignment((prev: any) => ({ ...prev, from: e.target.value }))}
                    className="me-2"
                  />
                  <i className="fas fa-calendar"></i>
                  <i className="fas fa-clock ms-2"></i>
                </div>
              </div>
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Until</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="datetime-local"
                    value={untilDate}
                    onChange={(e) => setAssignment((prev: any) => ({ ...prev, until: e.target.value }))}
                    className="me-2"
                  />
                  <i className="fas fa-calendar"></i>
                  <i className="fas fa-clock ms-2"></i>
                </div>
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
            <Button
              variant="danger"
              size="lg"
              onClick={() => {
                if (currentAssignment) {
                  dispatch(updateAssignment({ ...assignment, course: cid }));
                } else {
                  dispatch(addAssignment({ ...assignment, course: cid }));
                }
                navigate(`/Kambaz/Courses/${cid}/Assignments`);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

