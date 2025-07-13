import { Button, Form } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <Form>
        {/* Assignment Name */}
        <Form.Group className="row mb-2" controlId="wd-name">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Name</Form.Label>
          <div className="col-md-9">
            <Form.Control type="text" defaultValue="A1" />
          </div>
        </Form.Group>

        {/* Assignment Description */}
        <Form.Group className="row mb-3" controlId="wd-description">
          <Form.Label className="col-md-3 col-form-label text-md-end">Description</Form.Label>
          <div className="col-md-9">
            <Form.Control
              as="textarea"
              rows={8}
              defaultValue={`The assignment is available online.\nSubmit a link to the landing page of your Web application running on Netlify.\nThe landing page should include the following:\n- Your full name and section\n- Links to each of the lab assignments\n- Link to the Kanbas application\n- Links to all relevant source code repositories.\nThe Kanbas application should include a link to navigate back to the landing page.`}
            />
          </div>
        </Form.Group>

        {/* Points */}
        <Form.Group className="row mb-2" controlId="wd-points">
          <Form.Label className="col-md-3 col-form-label text-md-end">Points</Form.Label>
          <div className="col-md-9">
            <Form.Control type="number" defaultValue={100} />
          </div>
        </Form.Group>

        {/* Assignment Group */}
        <Form.Group className="row mb-2" controlId="wd-assign-group">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Group</Form.Label>
          <div className="col-md-9">
            <Form.Select defaultValue="ASSIGNMENT1">
              <option value="ASSIGNMENT1">Assignment 1</option>
              <option value="ASSIGNMENT2">Assignment 2</option>
              <option value="ASSIGNMENT3">Assignment 3</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Display Grade As */}
        <Form.Group className="row mb-2" controlId="wd-display-grade-as">
          <Form.Label className="col-md-3 col-form-label text-md-end">Display Grade As</Form.Label>
          <div className="col-md-9">
            <Form.Select defaultValue="PERCENTAGE">
              <option value="PERCENTAGE">Percentage</option>
              <option value="DECIMAL">Decimal</option>
              <option value="LETTERS">Letters</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Submission Type */}
        <Form.Group className="row mb-2" controlId="wd-submission-type">
          <Form.Label className="col-md-3 col-form-label text-md-end">Submission Type</Form.Label>
          <div className="col-md-9">
            <Form.Select defaultValue="ONLINE">
              <option value="ONLINE">Online</option>
              <option value="INPERSON">In Person</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Online Entry Options */}
        <Form.Group className="row mb-3">
          <Form.Label className="col-md-3 col-form-label text-md-end"></Form.Label>
          <div className="col-md-9 border p-3 rounded">
            <div className="mb-2 fw-bold">Online Entry Options</div>
            <Form.Check type="checkbox" id="checkbox1" label="Text Entry" defaultChecked={true} className="mb-2" />
            <Form.Check type="checkbox" id="checkbox2" label="Website URL" defaultChecked={true} className="mb-2" />
            <Form.Check type="checkbox" id="checkbox3" label="Media Recordings" className="mb-2" />
            <Form.Check type="checkbox" id="checkbox4" label="Student Annotation" className="mb-2" />
            <Form.Check type="checkbox" id="checkbox5" label="File Uploads" className="mb-2" />
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
              <Form.Control type="date" id="wd-date-due" defaultValue="2025-07-08" className="mb-2" />
            </div>
            <div className="d-flex gap-3">
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Available from</Form.Label>
                <Form.Control type="date" id="wd-date-available" defaultValue="2025-07-04" className="mb-2" />
              </div>
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Until</Form.Label>
                <Form.Control type="date" id="wd-date-until" defaultValue="2025-07-22" className="mb-2" />
              </div>
            </div>
          </div>
        </Form.Group>

        {/* Action Buttons */}
        <div className="row">
          <div className="col text-end">
            <Button variant="secondary" size="lg" className="me-2">Cancel</Button>
            <Button variant="danger" size="lg">Save</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

