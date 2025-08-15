
import { Button, Form } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";

interface FillBlankEditorProps {
  data: any;
  onChange: (data: any) => void;
}

export default function FillBlankEditor({ data, onChange }: FillBlankEditorProps) {
  const correctAnswers = data.correctAnswers || [""];

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...correctAnswers];
    newAnswers[index] = value;
    onChange({ ...data, correctAnswers: newAnswers });
  };

  const addAnswer = () => {
    const newAnswers = [...correctAnswers, ""];
    onChange({ ...data, correctAnswers: newAnswers });
  };

  const removeAnswer = (index: number) => {
    if (correctAnswers.length <= 1) return; // Keep at least 1 answer
    
    const newAnswers = correctAnswers.filter((_: string, i: number) => i !== index);
    onChange({ ...data, correctAnswers: newAnswers });
  };



  return (
    <div className="fill-blank-editor">
      <div className="mb-3">
        <p className="text-muted">
          Enter your question text, then define all possible correct answers for the blank. 
          Students will see the question followed by a small text box to type their answer.
        </p>
      </div>

      <div className="mb-3">
        <h6>Answers:</h6>
      </div>

        {correctAnswers.map((answer: string, index: number) => (
          <div key={index} className="mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="flex-grow-1">
                <Form.Group>
                  <Form.Label>Possible Answer:</Form.Label>
                  <Form.Control
                    type="text"
                    value={answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Enter a possible correct answer"
                  />
                </Form.Group>
              </div>
              
              {correctAnswers.length > 1 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeAnswer(index)}
                  title="Remove Answer"
                >
                  <FaTrash />
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="mt-3">
          <Button variant="outline-primary" onClick={addAnswer}>
            <FaPlus className="me-2" />
            + Add Another Answer
          </Button>
        </div>
      </div>
  );
}
