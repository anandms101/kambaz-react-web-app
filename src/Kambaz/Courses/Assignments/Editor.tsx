import { Button, Form } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
    currentAssignment ? {
      ...currentAssignment,
      // Map database field 'not_available_until' to frontend field 'from'
      from: currentAssignment.not_available_until || currentAssignment.available || getDefaultDateTime(),
      // Map database field 'available' to frontend field 'from' if not_available_until doesn't exist
      available: currentAssignment.not_available_until || currentAssignment.available
    } : {
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
      <h3 className="mb-4">
        <i className={`fas fa-${aid ? 'edit' : 'plus'} me-2`}></i>
        {aid ? "Edit Assignment" : "Add New Assignment"}
      </h3>
      <Form>
        {/* Assignment Name */}
        <Form.Group className="row mb-3" controlId="wd-name">
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-file-alt me-2"></i>
            Assignment Name *
          </Form.Label>
          <div className="col-md-9">
            <Form.Control
              type="text"
              value={assignmentName}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter assignment name"
              isInvalid={!!errors.title}
              className={errors.title ? 'is-invalid' : ''}
            />
            {errors.title && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {errors.title}
              </div>
            )}
          </div>
        </Form.Group>

        {/* Assignment Description */}
        <Form.Group className="row mb-3" controlId="wd-description">
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-align-left me-2"></i>
            Assignment Description *
          </Form.Label>
          <div className="col-md-9">
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter detailed assignment description"
              isInvalid={!!errors.description}
              className={errors.description ? 'is-invalid' : ''}
            />
            {errors.description && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {errors.description}
              </div>
            )}
          </div>
        </Form.Group>

        {/* Points */}
        <Form.Group className="row mb-3" controlId="wd-points">
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-star me-2"></i>
            Points *
          </Form.Label>
          <div className="col-md-9">
            <Form.Control
              type="number"
              value={points}
              onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
              placeholder="100"
              min="1"
              isInvalid={!!errors.points}
              className={errors.points ? 'is-invalid' : ''}
            />
            {errors.points && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {errors.points}
              </div>
            )}
          </div>
        </Form.Group>

        {/* Assignment Group */}
        <Form.Group className="row mb-3" controlId="wd-assign-group">
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-folder me-2"></i>
            Assignment Group
          </Form.Label>
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
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-chart-bar me-2"></i>
            Display Grade As
          </Form.Label>
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
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-upload me-2"></i>
            Submission Type
          </Form.Label>
          <div className="col-md-9">
            <Form.Select
              value={assignment?.submission_type || "Online"}
              onChange={(e) => handleInputChange('submission_type', e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="File Upload">File Upload</option>
              <option value="Text Entry">Text Entry</option>
              <option value="Website URL">Website URL</option>
            </Form.Select>
          </div>
        </Form.Group>

        {/* Online Entry Options */}
        <Form.Group className="row mb-3">
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-cog me-2"></i>
            Entry Options
          </Form.Label>
          <div className="col-md-9 border p-3 rounded bg-light">
            <div className="mb-2 fw-bold">
              <i className="fas fa-list-check me-2"></i>
              Online Entry Options
            </div>
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
          <Form.Label className="col-md-3 col-form-label text-md-end">
            <i className="fas fa-users me-2"></i>
            Assign
          </Form.Label>
          <div className="col-md-9 border p-3 rounded bg-light">
            <div className="mb-3">
              <Form.Label className="fw-bold">
                <i className="fas fa-user-check me-2"></i>
                Assign to
              </Form.Label>
              <Form.Control
                type="text"
                value={assignment?.assign_to || "Everyone"}
                onChange={(e) => handleInputChange('assign_to', e.target.value)}
                id="wd-assign-to"
                placeholder="Everyone"
              />
            </div>
            <div className="mb-3">
              <Form.Label className="fw-bold">
                <i className="fas fa-calendar-times me-2"></i>
                Due *
              </Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => handleInputChange('due', e.target.value)}
                  id="wd-due-date"
                  isInvalid={!!errors.due}
                  className={errors.due ? 'is-invalid' : ''}
                />
                {errors.due && (
                  <div className="invalid-feedback d-block mt-1">
                    <i className="fas fa-times-circle me-1"></i>
                    {errors.due}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-3">
              <Form.Label className="fw-bold">
                <i className="fas fa-calendar-plus me-2"></i>
                Available from *
              </Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="datetime-local"
                  value={availableDate}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  id="wd-from-date"
                  isInvalid={!!errors.from}
                  className={errors.from ? 'is-invalid' : ''}
                />
                {errors.from && (
                  <div className="invalid-feedback d-block mt-1">
                    <i className="fas fa-times-circle me-1"></i>
                    {errors.from}
                  </div>
                )}
              </div>
            </div>
            <div className="mb-3">
              <Form.Label className="fw-bold">
                <i className="fas fa-calendar-minus me-2"></i>
                Until *
              </Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="datetime-local"
                  value={untilDate}
                  onChange={(e) => handleInputChange('until', e.target.value)}
                  id="wd-until-date"
                  isInvalid={!!errors.until}
                  className={errors.until ? 'is-invalid' : ''}
                />
                {errors.until && (
                  <div className="invalid-feedback d-block mt-1">
                    <i className="fas fa-times-circle me-1"></i>
                    {errors.until}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Form.Group>

        {/* Action Buttons */}
        <div className="row">
          <div className="col text-end">
            <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="me-2">
              <Button variant="secondary" size="lg">
                <i className="fas fa-times me-2"></i>
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Save Assignment
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

