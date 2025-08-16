
import { Button, Form, Card, Badge } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";

interface FillBlankEditorProps {
  data: any;
  onChange: (data: any) => void;
}

interface Blank {
  id: string;
  answers: string[];
}

export default function FillBlankEditor({ data, onChange }: FillBlankEditorProps) {
  // Initialize with existing data or default structure
  const blanks: Blank[] = data.blanks || [{ id: "blank-1", answers: [""] }];

  const handleBlankAnswersChange = (blankId: string, answers: string[]) => {
    const newBlanks = blanks.map(blank => 
      blank.id === blankId ? { ...blank, answers } : blank
    );
    onChange({ ...data, blanks: newBlanks });
  };

  const addBlank = () => {
    const newBlankId = `blank-${Date.now()}`;
    const newBlanks = [...blanks, { id: newBlankId, answers: [""] }];
    onChange({ ...data, blanks: newBlanks });
  };

  const removeBlank = (blankId: string) => {
    if (blanks.length <= 1) return; // Keep at least 1 blank
    
    const newBlanks = blanks.filter(blank => blank.id !== blankId);
    onChange({ ...data, blanks: newBlanks });
  };

  const handleAnswerChange = (blankId: string, answerIndex: number, value: string) => {
    const blank = blanks.find(b => b.id === blankId);
    if (!blank) return;

    const newAnswers = [...blank.answers];
    newAnswers[answerIndex] = value;
    handleBlankAnswersChange(blankId, newAnswers);
  };

  const addAnswer = (blankId: string) => {
    const blank = blanks.find(b => b.id === blankId);
    if (!blank) return;

    const newAnswers = [...blank.answers, ""];
    handleBlankAnswersChange(blankId, newAnswers);
  };

  const removeAnswer = (blankId: string, answerIndex: number) => {
    const blank = blanks.find(b => b.id === blankId);
    if (!blank || blank.answers.length <= 1) return; // Keep at least 1 answer per blank
    
    const newAnswers = blank.answers.filter((_: string, i: number) => i !== answerIndex);
    handleBlankAnswersChange(blankId, newAnswers);
  };

  return (
    <div className="fill-blank-editor">
      <div className="mb-3">
        <p className="text-muted">
          <strong>Instructions:</strong> Add blanks to your question text using <code>[BLANK]</code> placeholders. 
          For example: "The capital of France is [BLANK] and the capital of Germany is [BLANK]."
          Then define the correct answers for each blank below.
        </p>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h6>Blanks and Answers:</h6>
          <Button variant="outline-primary" size="sm" onClick={addBlank}>
            <FaPlus className="me-2" />
            Add Blank
          </Button>
        </div>
      </div>

      {blanks.map((blank, blankIndex) => (
        <Card key={blank.id} className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Badge bg="primary">Blank {blankIndex + 1}</Badge>
              <small className="text-muted">
                {blank.answers.filter(a => a.trim()).length} answer(s)
              </small>
            </div>
            {blanks.length > 1 && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeBlank(blank.id)}
                title="Remove Blank"
              >
                <FaTrash />
              </Button>
            )}
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <h6>Correct Answers for Blank {blankIndex + 1}:</h6>
              <small className="text-muted">
                Add all possible correct answers for this blank. Students can enter any of these answers.
              </small>
            </div>

            {blank.answers.map((answer, answerIndex) => (
              <div key={answerIndex} className="mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="flex-grow-1">
                    <Form.Control
                      type="text"
                      value={answer}
                      onChange={(e) => handleAnswerChange(blank.id, answerIndex, e.target.value)}
                      placeholder={`Correct answer ${answerIndex + 1} for blank ${blankIndex + 1}`}
                      size="sm"
                    />
                  </div>
                  {blank.answers.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeAnswer(blank.id, answerIndex)}
                      title="Remove Answer"
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-2">
              <Button variant="outline-secondary" size="sm" onClick={() => addAnswer(blank.id)}>
                <FaPlus className="me-2" />
                Add Another Answer
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}

      <div className="alert alert-info">
        <strong>Question Text Format:</strong> Use <code>[BLANK]</code> in your question text to indicate where blanks should appear. 
        For example: "The [BLANK] is the largest planet in our solar system, and [BLANK] is the closest planet to the sun."
      </div>
    </div>
  );
}
