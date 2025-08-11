import { ListGroup, Modal, Button } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButton";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  setModules,
  addModule,
  editModule,
  updateModule,
  deleteModule,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as modulesClient from "./Client";
import * as courseClient from "../client";

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const dispatch = useDispatch();

  const fetchModulesForCourse = async () => {
    try {
      const modules = await courseClient.findModulesForCourse(cid!);
      dispatch(setModules(modules));
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const addModuleHandler = async () => {
    if (!moduleName.trim()) return;
    
    try {
      const newModule = await courseClient.createModuleForCourse(cid!, {
        name: moduleName,
        description: "New module description"
      });
      dispatch(addModule(newModule));
      setModuleName("");
      // Refresh the modules list to ensure we have the latest data
      await fetchModulesForCourse();
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const handleDeleteClick = (module: any) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (moduleToDelete) {
      try {
        await modulesClient.deleteModule(moduleToDelete._id);
        dispatch(deleteModule(moduleToDelete._id));
        setShowDeleteModal(false);
        setModuleToDelete(null);
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setModuleToDelete(null);
  };

  const updateModuleHandler = async (module: any) => {
    try {
      await modulesClient.updateModule(module);
      dispatch(updateModule(module));
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  useEffect(() => {
    if (cid) {
      fetchModulesForCourse();
    }
  }, [cid]);

  const isFaculty = currentUser.role === "FACULTY";

  return (
    <div>
      {isFaculty && (
        <>
          <ModulesControls
            setModuleName={setModuleName}
            moduleName={moduleName}
            addModule={addModuleHandler}
          />
          <br />
          <br />
          <br />
          <br />
        </>
      )}
      <ListGroup className="list-group rounded-0" id="wd-modules">
        {modules.map((module: any) => (
          <ListGroup.Item
            className="wd-module p-0 mb-5 fs-5 border-gray"
            key={module._id}
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />{" "}
              {!module.editing && module.name}
              {module.editing && (
                <input
                  className="form-control w-50 d-inline-block"
                  onChange={(e) =>
                    updateModuleHandler({ ...module, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateModuleHandler({ ...module, editing: false });
                    }
                  }}
                  onBlur={() => {
                    updateModuleHandler({ ...module, editing: false });
                  }}
                  value={module.name}
                />
              )}
              {isFaculty && (
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={() => handleDeleteClick(module)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />
              )}
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroup.Item
                    className="wd-lesson p-3 ps-1"
                    key={module._id + lesson._id}
                  >
                    <BsGripVertical className="me-2 fs-3" />
                    {lesson.name} <LessonControlButtons />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3">Are you sure?</h4>
            <p className="text-muted">
              You are about to delete the module: <strong>{moduleToDelete?.name}</strong>
            </p>
            <p className="text-danger">
              <i className="fas fa-info-circle me-2"></i>
              This action cannot be undone. All module data and lessons will be permanently deleted.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <i className="fas fa-trash me-2"></i>
            Delete Module
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
