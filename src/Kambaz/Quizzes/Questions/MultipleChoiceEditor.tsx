
import { Button, Form, Card, Badge, Alert } from "react-bootstrap";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";

interface MultipleChoiceEditorProps {
  data: any;
  onChange: (data: any) => void;
}

export default function MultipleChoiceEditor({ data, onChange }: MultipleChoiceEditorProps) {
  const options = data.options || [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ];

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange({ ...data, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newOptions = options.map((option: any, i: number) => ({
      ...option,
      isCorrect: i === index
    }));
    onChange({ ...data, options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...options, { text: "", isCorrect: false }];
    onChange({ ...data, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Keep at least 2 options
    
    const newOptions = options.filter((_: any, i: number) => i !== index);
    
    // If we removed the correct answer, make the first option correct
    if (options[index].isCorrect && newOptions.length > 0) {
      newOptions[0].isCorrect = true;
    }
    
    onChange({ ...data, options: newOptions });
  };

  const getCorrectAnswerCount = () => {
    return options.filter((option: any) => option.isCorrect).length;
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>Multiple Choice Options</h6>
          <div className="d-flex gap-2">
            <Badge bg={getCorrectAnswerCount() === 1 ? "success" : "warning"}>
              {getCorrectAnswerCount()} correct answer{getCorrectAnswerCount() !== 1 ? 's' : ''}
            </Badge>
            <Button variant="outline-primary" size="sm" onClick={addOption}>
              <FaPlus className="me-1" />
              Add Option
            </Button>
          </div>
        </div>

        {options.map((option: any, index: number) => (
          <div key={index} className={`border rounded p-3 mb-3 ${option.isCorrect ? 'border-success bg-light' : ''}`}>
            <div className="d-flex align-items-start gap-3">
              <div className="flex-shrink-0" style={{ marginTop: '8px' }}>
                <Form.Check
                  type="radio"
                  name="correctAnswer"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectAnswerChange(index)}
                  title="Select as correct answer"
                />
              </div>
              
              <div className="flex-grow-1">
                <Form.Group className="mb-0">
                  <Form.Label className="d-flex align-items-center gap-2">
                    Option {index + 1}
                    {option.isCorrect && (
                      <Badge bg="success">
                        <FaCheck className="me-1" />
                        Correct
                      </Badge>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, "text", e.target.value)}
                    placeholder={`Enter option ${index + 1}`}
                    className={option.isCorrect ? 'border-success' : ''}
                  />
                </Form.Group>
              </div>
              
              <div className="flex-shrink-0 d-flex flex-column gap-2">
                {options.length > 2 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeOption(index)}
                    title="Remove Option"
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {getCorrectAnswerCount() === 0 && (
          <Alert variant="warning" className="mt-3">
            Please select at least one correct answer.
          </Alert>
        )}

        {getCorrectAnswerCount() > 1 && (
          <Alert variant="info" className="mt-3">
            Multiple correct answers selected. Students can choose any of the correct options.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}
