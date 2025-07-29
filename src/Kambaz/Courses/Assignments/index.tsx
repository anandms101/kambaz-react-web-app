// import { ListGroup } from "react-bootstrap";
// import { BsGripVertical } from "react-icons/bs";
// import LessonControlButton from "../Modules/LessonControlButton";
// import { LuNewspaper } from "react-icons/lu";
// import AssignmentsControlButtons from "./AssignmentsControlButton";
// import AssignmentsControls from "./AssignmentsControl";
// import { IoCaretDown } from "react-icons/io5";
// import { useParams } from "react-router";
// import * as db from "../../Database";
// import { Link } from "react-router-dom";

// export default function Assignments() {
//   const { cid } = useParams();
//   const assignments = db.assignments;

//   type Assignment = {
//     _id: string;
//     title: string;
//     course: string;
//     not_available_until: string;
//     due: string;
//     points: number;
//     description: string;
//     assignment_group: string;
//     display_grade_as: string;
//     submission_type: string;
//     online_entry_option: string[];
//   };

//   return (
//     <div>
//       <AssignmentsControls />

//       <div className="wd-title p-3 ps-2 bg-secondary">
//         <BsGripVertical className="me-2 fs-3" /> <IoCaretDown /> ASSIGNMENTS <AssignmentsControlButtons />
//       </div>

//       <ListGroup className="rounded-0" id="wd-modules">
//         {assignments
//           .filter((assignment: Assignment) => assignment.course === cid)
//           .map((assignment: Assignment) => (
//             <ListGroup.Item
//               key={assignment._id}
//               className="wd-module p-0 mb-0 fs-6"
//             >
//               <ListGroup className="wd-lessons rounded-0 mb-0">
//                 <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center mb-0">
//                   <BsGripVertical className="me-2 fs-3" /> <LuNewspaper className="me-2 fs-3" color="green" />
//                   <div className="wd-assignment-text ms-2">
//                     <Link
//                       to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
//                       className="wd-assignment-link d-block"
//                     >
//                       {assignment.title}
//                     </Link>
//                     <span className="d-block">
//                       <span style={{ color: '#DC3545' }}>Multiple Modules</span> | <b>Not available until </b> {assignment.not_available_until} |
//                     </span>
//                     <span className="d-block"> <b>Due </b> {assignment.due} | {assignment.points}pts</span>
//                   </div>
//                   <div className="ms-auto">
//                     <LessonControlButton />
//                   </div>
//                 </ListGroup.Item>
//               </ListGroup>
//             </ListGroup.Item>
//           ))}
//       </ListGroup>
//     </div>
//   );
// }

import { ListGroup, Modal, Button } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { LuNewspaper } from "react-icons/lu";
import { IoCaretDown } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import AssignmentsControls from "./AssignmentsControl";
import AssignmentsControlButtons from "./AssignmentsControlButton";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaEdit } from "react-icons/fa";
import { deleteAssignment } from "./reducer";
import { useState } from "react";

export default function Assignments() {
  const dispatch = useDispatch();
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { assignments } = useSelector((state: any) => state.assignmentReducer);
  const isFaculty = currentUser.role === "FACULTY";
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

  const handleDeleteClick = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (assignmentToDelete) {
      dispatch(deleteAssignment(assignmentToDelete));
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
  };

  return (
    <div>
      <AssignmentsControls />

      <div className="wd-title p-3 ps-2 bg-secondary">
        <BsGripVertical className="me-2 fs-3" /> <IoCaretDown /> ASSIGNMENTS <AssignmentsControlButtons />
      </div>

      <ListGroup className="rounded-0" id="wd-modules">
        {assignments
          .filter((assignment: any) => assignment.course === cid)
          .map((assignment: any) => (
            <ListGroup.Item key={assignment._id} className="wd-module p-0 mb-0 fs-6">
              <ListGroup className="wd-lessons rounded-0 mb-0">
                <ListGroup.Item className="wd-lesson p-3 ps-1 d-flex align-items-center mb-0">
                  <BsGripVertical className="me-2 fs-3" /> <LuNewspaper className="me-2 fs-3" color="green" />
                  <div className="wd-assignment-text ms-2 flex-grow-1">
                    {/* Assignment title - no longer a link since we have edit button */}
                    <strong className="d-block">{assignment.title}</strong>
                    <span className="d-block">
                      <span style={{ color: '#DC3545' }}>Multiple Modules</span> | <b>Available From </b> {assignment.available} | <b>Available Until </b> {assignment.until} 
                    </span>
                    <span className="d-block"> <b>Due </b> {assignment.due} | {assignment.points}pts</span>
                  </div>
                  {/* Action buttons for faculty */}
                  {isFaculty && (
                    <div className="d-flex align-items-center gap-3">
                      <Link to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}>
                        <FaEdit
                          className="text-primary"
                          style={{ cursor: "pointer", fontSize: "1.2rem" }}
                          title="Edit Assignment"
                        />
                      </Link>
                      <FaTrash
                        className="text-danger"
                        style={{ cursor: "pointer", fontSize: "1.2rem" }}
                        title="Delete Assignment"
                        onClick={() => handleDeleteClick(assignment._id)}
                      />
                    </div>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          ))}
      </ListGroup>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this assignment? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

