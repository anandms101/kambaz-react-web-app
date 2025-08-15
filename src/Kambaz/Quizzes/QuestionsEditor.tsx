import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchQuizWithQuestionsAsync, 
  deleteQuestionAsync
} from "./reducer";

import { 
  Card, 
  Button, 
  Alert, 
  Spinner,
  Badge,
  Modal
} from "react-bootstrap";
import { 
  FaArrowLeft, 
  FaPlus, 
  FaEdit, 
  FaTrash
} from "react-icons/fa";
import QuestionEditor from "./Questions/QuestionEditor";

export default function QuestionsEditor() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, questions, loading, error } = useSelector((state: any) => state.quizReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<any>(null);

  useEffect(() => {
    if (quizId) {
      (dispatch as any)(fetchQuizWithQuestionsAsync(quizId as any));
    }
  }, [dispatch, quizId]);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isCreator = currentQuiz?.createdBy === currentUser?._id;

  if (!isFaculty || !isCreator) {
    return (
      <Alert variant="danger">
        You don't have permission to edit questions for this quiz.
      </Alert>
    );
  }

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionEditor(true);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question);
    setShowQuestionEditor(true);
  };

  const handleDeleteQuestion = (question: any) => {
    setQuestionToDelete(question);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!questionToDelete) return;
    
    try {
      await (dispatch as any)(deleteQuestionAsync(questionToDelete._id as any)).unwrap();
      // Refresh questions
      (dispatch as any)(fetchQuizWithQuestionsAsync(quizId! as any));
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setQuestionToDelete(null);
  };

  const handleQuestionSaved = () => {
    // Refresh questions
    (dispatch as any)(fetchQuizWithQuestionsAsync(quizId! as any));
  };

  const getQuestionTypeIcon = (questionType: string) => {
    switch (questionType) {
      case 'multiple-choice':
        return <Badge bg="primary">Multiple Choice</Badge>;
      case 'true-false':
        return <Badge bg="success">True/False</Badge>;
      case 'fill-blank':
        return <Badge bg="warning">Fill in Blank</Badge>;
      default:
        return <Badge bg="secondary">{questionType}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading quiz: {error}
      </Alert>
    );
  }

  if (!currentQuiz) {
    return (
      <Alert variant="warning">
        Quiz not found
      </Alert>
    );
  }

  const totalPoints = questions.reduce((sum: number, q: any) => sum + q.points, 0);

  return (
    <div className="questions-editor-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Questions Editor: {currentQuiz.title}</h2>
          <p className="text-muted">Total Points: {totalPoints}</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="primary" 
            onClick={handleAddQuestion}
            className="d-flex align-items-center gap-2"
          >
            <FaPlus /> New Question
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Edit`)}
          >
            <FaArrowLeft className="me-2" />
            Back to Quiz Editor
          </Button>
        </div>
      </div>

      {questions.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h4>No Questions Added Yet</h4>
            <p className="text-muted mb-4">
              This quiz doesn't have any questions yet. Click "New Question" to add your first question.
            </p>
            <Button variant="primary" size="lg" onClick={handleAddQuestion}>
              <FaPlus className="me-2" />
              Add Your First Question
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div>
          {questions.map((question: any, index: number) => (
            <Card key={question._id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <h5>Question {index + 1}: {question.title}</h5>
                      {getQuestionTypeIcon(question.questionType)}
                      <Badge bg="info">{question.points} points</Badge>
                    </div>
                    <p className="text-muted mb-2">{question.questionText}</p>
                    
                    {/* Show question-specific details */}
                    {question.questionType === 'multiple-choice' && question.options && (
                      <div className="ms-3">
                        <small className="text-muted">Options:</small>
                        <ul className="list-unstyled ms-3">
                          {question.options.map((option: any, optIndex: number) => (
                            <li key={optIndex} className={option.isCorrect ? "text-success fw-bold" : ""}>
                              {option.isCorrect ? "✓ " : "○ "}{option.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {question.questionType === 'true-false' && (
                      <div className="ms-3">
                        <small className="text-muted">
                          Correct Answer: <span className="fw-bold">{question.correctAnswer ? "True" : "False"}</span>
                        </small>
                      </div>
                    )}
                    
                    {question.questionType === 'fill-blank' && question.correctAnswers && (
                      <div className="ms-3">
                        <small className="text-muted">
                          Correct Answers: <span className="fw-bold">{question.correctAnswers.join(", ")}</span>
                        </small>
                      </div>
                    )}
                  </div>
                  
                  <div className="d-flex gap-1">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleEditQuestion(question)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteQuestion(question)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Question Editor Modal */}
      <QuestionEditor
        show={showQuestionEditor}
        onHide={() => setShowQuestionEditor(false)}
        quizId={quizId!}
        question={editingQuestion}
        onQuestionSaved={handleQuestionSaved}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this question?</p>
          {questionToDelete && (
            <div className="bg-light p-3 rounded">
              <strong>{questionToDelete.title}</strong>
              <br />
              <small className="text-muted">{questionToDelete.questionText}</small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
