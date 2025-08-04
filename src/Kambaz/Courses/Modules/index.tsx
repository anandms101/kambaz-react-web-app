import { ListGroup } from "react-bootstrap";
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

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const dispatch = useDispatch();

  const fetchModulesForCourse = async () => {
    try {
      const modules = await modulesClient.findModulesForCourse(cid!);
      dispatch(setModules(modules));
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  const addModuleHandler = async () => {
    if (!moduleName.trim()) return;
    
    try {
      const newModule = await modulesClient.createModule({
        name: moduleName,
        course: cid,
        description: "New module description"
      });
      dispatch(addModule(newModule));
      setModuleName("");
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const deleteModuleHandler = async (moduleId: string) => {
    try {
      await modulesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
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
                  deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
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
    </div>
  );
}
