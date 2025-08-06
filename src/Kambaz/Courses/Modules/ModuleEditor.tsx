import { Modal, FormControl, Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function ModuleEditor({ show, handleClose, dialogTitle, moduleName, setModuleName, addModule, }: {
  show: boolean; handleClose: () => void; dialogTitle: string; moduleName: string; setModuleName: (name: string) => void;
  addModule: () => void;
}) {
  const [error, setError] = useState<string>("");

  const handleAddModule = () => {
    if (!moduleName.trim()) {
      setError("Module name is required");
      return;
    }
    setError("");
    addModule();
    handleClose();
  };

  const handleInputChange = (value: string) => {
    setModuleName(value);
    if (error) setError("");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-folder-plus me-2"></i>
          {dialogTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              <i className="fas fa-folder me-2"></i>
              Module Name
            </Form.Label>
            <FormControl 
              value={moduleName}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter module name"
              className={error ? 'is-invalid' : ''}
            />
            {error && (
              <div className="invalid-feedback d-block">
                <i className="fas fa-times-circle me-1"></i>
                {error}
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="fas fa-times me-2"></i>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddModule}>
          <i className="fas fa-plus me-2"></i>
          Add Module
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
