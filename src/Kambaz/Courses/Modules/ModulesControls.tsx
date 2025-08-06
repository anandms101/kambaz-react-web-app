import { FaPlus, FaEye, FaCompress } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import { useState } from "react";

export default function ModulesControls({ moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div id="wd-modules-controls" className="d-flex justify-content-end gap-2 mb-3">
      <ButtonGroup>
        <Button variant="outline-secondary" size="lg">
          <FaEye className="me-2" />
          View Progress
        </Button>
        <Button variant="outline-secondary" size="lg">
          <FaCompress className="me-2" />
          Collapse All
        </Button>
      </ButtonGroup>

      <Dropdown>
        <Dropdown.Toggle variant="outline-primary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-all-modules-and-items">
            <FaXmark /> Unpublish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-modules-only">
            <FaXmark /> Unpublish modules only
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Button 
        variant="primary" 
        onClick={handleShow} 
        size="lg" 
        id="wd-add-module-btn"
        className="shadow-sm"
      >
        <FaPlus className="me-2" />
        Add Module
      </Button>

      <ModuleEditor 
        show={show} 
        handleClose={handleClose} 
        dialogTitle="Add Module"
        moduleName={moduleName} 
        setModuleName={setModuleName} 
        addModule={addModule} 
      />
    </div>
  );
}

