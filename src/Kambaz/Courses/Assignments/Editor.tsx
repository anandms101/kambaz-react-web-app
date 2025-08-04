import { Button, Form } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAssignment, addAssignment } from "./reducer";
import * as assignmentsClient from "./Client";

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

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignmentName = assignment?.title || "";
  const description = assignment?.description || "";
  const points = assignment?.points || 100;
  const dueDate = assignment?.due || "";
  const availableDate = assignment?.from || "";
  const untilDate = assignment?.until || "";

  const validateForm = () => {
    const newErrors: any = {};

    if (!assignment.title?.trim()) {
      newErrors.title = "Assignment name is required";
    }

    if (!assignment.description?.trim()) {
      newErrors.description = "Assignment description is required";
    }

    if (!assignment.points || assignment.points <= 0) {
      newErrors.points = "Points must be greater than 0";
    }

    if (!assignment.due) {
      newErrors.due = "Due date is required";
    }

    if (!assignment.from) {
      newErrors.from = "Available from date is required";
    }

    if (!assignment.until) {
      newErrors.until = "Until date is required";
    }

    // Check if dates are in logical order
    if (assignment.from && assignment.until && new Date(assignment.from) >= new Date(assignment.until)) {
      newErrors.until = "Until date must be after Available from date";
    }

    if (assignment.due && assignment.until && new Date(assignment.due) <= new Date(assignment.until)) {
      newErrors.due = "Due date must be after Until date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentAssignment) {
        // Update existing assignment
        const updatedAssignment = await assignmentsClient.updateAssignment({ 
          ...assignment, 
          course: cid,
          available: assignment.from,
          until: assignment.until
        });
        dispatch(updateAssignment(updatedAssignment));
      } else {
        // Create new assignment
        const newAssignment = await assignmentsClient.createAssignment({ 
          ...assignment, 
          course: cid,
          available: assignment.from,
          until: assignment.until
        });
        dispatch(addAssignment(newAssignment));
      }
      navigate(`/Kambaz/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setAssignment((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <h3>{aid ? "Edit Assignment" : "Add New Assignment"}</h3>
      <Form>
        {/* Assignment Name */}
        <Form.Group className="row mb-3" controlId="wd-name">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Name *</Form.Label>
          <div className="col-md-9">
            <Form.Control
              type="text"
              value={assignmentName}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="New Assignment"
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        {/* Assignment Description */}
        <Form.Group className="row mb-3" controlId="wd-description">
          <Form.Label className="col-md-3 col-form-label text-md-end">New Assignment Description *</Form.Label>
          <div className="col-md-9">
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter assignment description"
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        {/* Points */}
        <Form.Group className="row mb-3" controlId="wd-points">
          <Form.Label className="col-md-3 col-form-label text-md-end">Points *</Form.Label>
          <div className="col-md-9">
            <Form.Control
              type="number"
              value={points}
              onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
              placeholder="100"
              min="1"
              isInvalid={!!errors.points}
            />
            <Form.Control.Feedback type="invalid">
              {errors.points}
            </Form.Control.Feedback>
          </div>
        </Form.Group>

        {/* Assignment Group */}
        <Form.Group className="row mb-3" controlId="wd-assign-group">
          <Form.Label className="col-md-3 col-form-label text-md-end">Assignment Group</Form.Label>
          <div className="col-md-9">
            <Form.Select
              value={assignment?.assignment_group || "ASSIGNMENTS"}
              onChange={(e) => handleInputChange('assignment_group', e.target.value)}
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
              onChange={(e) => handleInputChange('display_grade_as', e.target.value)}
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
              onChange={(e) => handleInputChange('submission_type', e.target.value)}
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
                handleInputChange('online_entry_option', newOptions);
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
                handleInputChange('online_entry_option', newOptions);
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
                onChange={(e) => handleInputChange('assign_to', e.target.value)}
                id="wd-assign-to"
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fw-bold">Due *</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => handleInputChange('due', e.target.value)}
                  className="me-2"
                  isInvalid={!!errors.due}
                />
                <i className="fas fa-calendar"></i>
                <i className="fas fa-clock ms-2"></i>
              </div>
              {errors.due && (
                <div className="text-danger small mt-1">{errors.due}</div>
              )}
            </div>
            <div className="d-flex gap-3">
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Available from *</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="datetime-local"
                    value={availableDate}
                    onChange={(e) => handleInputChange('from', e.target.value)}
                    className="me-2"
                    isInvalid={!!errors.from}
                  />
                  <i className="fas fa-calendar"></i>
                  <i className="fas fa-clock ms-2"></i>
                </div>
                {errors.from && (
                  <div className="text-danger small mt-1">{errors.from}</div>
                )}
              </div>
              <div className="mb-3 flex-fill">
                <Form.Label className="fw-bold">Until *</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="datetime-local"
                    value={untilDate}
                    onChange={(e) => handleInputChange('until', e.target.value)}
                    className="me-2"
                    isInvalid={!!errors.until}
                  />
                  <i className="fas fa-calendar"></i>
                  <i className="fas fa-clock ms-2"></i>
                </div>
                {errors.until && (
                  <div className="text-danger small mt-1">{errors.until}</div>
                )}
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
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

