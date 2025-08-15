import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createQuestionAsync, updateQuestionAsync, type Question } from "../reducer";

import { 
  Modal, 
  Button, 
  Form, 
  Row, 
  Col, 
  Alert
} from "react-bootstrap";
import { 
  FaSave, 
  FaTimes,
  FaUsers,
  FaGraduationCap,
  FaEdit as FaEditIcon
} from "react-icons/fa";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillBlankEditor from "./FillBlankEditor";

interface QuestionEditorProps {
  show: boolean;
  onHide: () => void;
  quizId: string;
  question?: any; // For editing existing question
  onQuestionSaved: () => void;
}

export default function QuestionEditor({ 
  show, 
  onHide, 
  quizId, 
  question, 
  onQuestionSaved 
}: QuestionEditorProps) {
  const dispatch = useDispatch();
  const [questionType, setQuestionType] = useState(question?.questionType || "multiple-choice");
  const [title, setTitle] = useState(question?.title || "");
  const [questionText, setQuestionText] = useState(question?.questionText || "");
  const [points, setPoints] = useState(question?.points || 1);
  const [order, setOrder] = useState(question?.order || 1);
  const [questionData, setQuestionData] = useState<any>(question || {});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!question;

  // Update state when question prop changes (for editing)
  useEffect(() => {
    if (question) {
      setQuestionType(question.questionType || "multiple-choice");
      setTitle(question.title || "");
      setQuestionText(question.questionText || "");
      setPoints(question.points || 1);
      setOrder(question.order || 1);
      setQuestionData(question || {});
    } else {
      // Reset form for new question
      setQuestionType("multiple-choice");
      setTitle("");
      setQuestionText("");
      setPoints(1);
      setOrder(1);
      setQuestionData({});
    }
  }, [question]);

  const handleSave = async () => {
    if (!title.trim() || !questionText.trim()) {
      setError("Title and question text are required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const questionPayload: Partial<Question> = {
        _id: question?._id,
        quizId,
        title: title.trim(),
        questionText: questionText.trim(),
        questionType,
        points: parseInt(points.toString()) || 1,
        order: parseInt(order.toString()) || 1,
        options: questionData.options || [],
        correctAnswer: questionData.correctAnswer,
        correctAnswers: questionData.correctAnswers
      };

      if (isEditing) {
        await dispatch(updateQuestionAsync(questionPayload as Question) as any).unwrap();
      } else {
        await dispatch(createQuestionAsync({ quizId, question: questionPayload }) as any).unwrap();
      }

      onQuestionSaved();
      handleClose();
    } catch (error) {
      setError("Failed to save question. Please try again.");
      console.error("Error saving question:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setTitle("");
    setQuestionText("");
    setPoints(1);
    setOrder(1);
    setQuestionData({});
    setQuestionType("multiple-choice");
    setError("");
    onHide();
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return <FaUsers />;
      case 'true-false':
        return <FaGraduationCap />;
      case 'fill-blank':
        return <FaEditIcon />;
      default:
        return <FaEditIcon />;
    }
  };

  const renderQuestionTypeEditor = () => {
    switch (questionType) {
      case 'multiple-choice':
        return (
          <MultipleChoiceEditor
            data={questionData}
            onChange={setQuestionData}
          />
        );
      case 'true-false':
        return (
          <TrueFalseEditor
            data={questionData}
            onChange={setQuestionData}
          />
        );
      case 'fill-blank':
        return (
          <FillBlankEditor
            data={questionData}
            onChange={setQuestionData}
          />
        );
      default:
        return <p>Select a question type</p>;
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Edit Question" : "Add New Question"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Question Type</Form.Label>
                            <Form.Select 
                value={questionType} 
                onChange={(e) => setQuestionType(e.target.value)}
                disabled={isEditing} // Don't allow changing type when editing
              >
                <option value="multiple-choice">
                  Multiple Choice
                </option>
                <option value="true-false">
                  True/False
                </option>
                <option value="fill-blank">
                  Fill in the Blank
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                min="1"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Question Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter question title (e.g., Question 1)"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Question Text</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter the question text"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Question Order</Form.Label>
          <Form.Control
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
            min="1"
          />
        </Form.Group>

        <div className="mb-3">
          <h6>
            {getQuestionTypeIcon(questionType)} {questionType.charAt(0).toUpperCase() + questionType.slice(1)} Question Settings
          </h6>
          {renderQuestionTypeEditor()}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <FaTimes className="me-2" />
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={isSaving}
        >
          <FaSave className="me-2" />
          {isSaving ? "Saving..." : (isEditing ? "Update Question" : "Add Question")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
