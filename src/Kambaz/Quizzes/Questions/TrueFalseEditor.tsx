
import { Form, Card, Badge } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

interface TrueFalseEditorProps {
  data: any;
  onChange: (data: any) => void;
}

export default function TrueFalseEditor({ data, onChange }: TrueFalseEditorProps) {
  const correctAnswer = data.correctAnswer !== undefined ? data.correctAnswer : true;

  const handleCorrectAnswerChange = (value: boolean) => {
    onChange({ ...data, correctAnswer: value });
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>True/False Settings</h6>
          <Badge bg="info">Single Correct Answer</Badge>
        </div>

        <Form.Group>
          <Form.Label>Correct Answer</Form.Label>
          <div className="d-flex gap-3">
            <Form.Check
              type="radio"
              id="true-answer"
              name="correctAnswer"
              label="True"
              checked={correctAnswer === true}
              onChange={() => handleCorrectAnswerChange(true)}
              className="border rounded p-3 flex-grow-1"
            />
            <Form.Check
              type="radio"
              id="false-answer"
              name="correctAnswer"
              label="False"
              checked={correctAnswer === false}
              onChange={() => handleCorrectAnswerChange(false)}
              className="border rounded p-3 flex-grow-1"
            />
          </div>
        </Form.Group>

        <div className="mt-3 p-3 bg-light rounded">
          <div className="d-flex align-items-center gap-2">
            <FaCheck className="text-success" />
            <strong>Correct Answer:</strong> {correctAnswer ? "True" : "False"}
          </div>
          <small className="text-muted">
            Students will see "True" and "False" as options and must select the correct one.
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}
