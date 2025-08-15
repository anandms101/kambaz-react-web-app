import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchQuizWithQuestionsAsync, 
  updateQuizAsync,
  deleteQuestionAsync,
  type Quiz 
} from "./reducer";
import { 
  Button, 
  Form, 
  Alert, 
  Spinner,
  Nav,
  Tab,
  Row,
  Col,
  Modal
} from "react-bootstrap";
import QuestionEditor from "./Questions/QuestionEditor";
import { 
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

export default function QuizEditor() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, questions, loading, error } = useSelector((state: any) => state.quizReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState<Partial<Quiz>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<any>(null);

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizWithQuestionsAsync(quizId) as any);
    }
  }, [dispatch, quizId]);

  useEffect(() => {
    if (currentQuiz) {
      setFormData(currentQuiz);
    }
  }, [currentQuiz]);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isCreator = currentQuiz?.createdBy === currentUser?._id;

  if (!isFaculty || !isCreator) {
    return (
      <Alert variant="danger">
        You don't have permission to edit this quiz.
      </Alert>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    if (!currentQuiz) return;

    setIsSaving(true);
    try {
      const updatedQuiz = {
        ...currentQuiz,
        ...formData,
        published: publish ? true : currentQuiz.published
      };
      
      await dispatch(updateQuizAsync(updatedQuiz) as any).unwrap();
      
      if (publish) {
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } else {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionEditor(true);
  };



  const handleQuestionSaved = () => {
    (dispatch as any)(fetchQuizWithQuestionsAsync(quizId! as any));
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

  return (
    <div className="quiz-editor-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Edit Quiz: {currentQuiz.title}</h2>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="details">
                  <FaEdit className="me-2" />
                  Details
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="questions">
                  <FaPlus className="me-2" />
                  Questions ({questions.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="details">
                <div className="quiz-editor-content">
                  {/* Quiz Title */}
                  <Form.Group className="mb-4">
                    <Form.Label>Quiz Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter quiz title"
                      size="lg"
                    />
                  </Form.Group>

                  {/* Quiz Instructions - Rich Text Editor */}
                  <Form.Group className="mb-4">
                    <Form.Label>Quiz Instructions:</Form.Label>
                    <div className="rich-text-editor">
                      <div className="editor-toolbar">
                        <div className="toolbar-section">
                          <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">Insert</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">Format</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">Tools</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">Table</button>
                        </div>
                        <div className="toolbar-section">
                          <select className="form-select form-select-sm" style={{width: '80px'}}>
                            <option>12pt</option>
                          </select>
                          <select className="form-select form-select-sm" style={{width: '120px'}}>
                            <option>Paragraph</option>
                          </select>
                        </div>
                        <div className="toolbar-section">
                          <button type="button" className="btn btn-sm btn-outline-secondary"><strong>B</strong></button>
                          <button type="button" className="btn btn-sm btn-outline-secondary"><em>I</em></button>
                          <button type="button" className="btn btn-sm btn-outline-secondary"><u>U</u></button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">A</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">🖊️</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">T²</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">⋯</button>
                        </div>
                        <div className="toolbar-section">
                          <span className="text-muted">100%</span>
                        </div>
                      </div>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        value={formData.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Enter quiz instructions..."
                        className="editor-textarea"
                      />
                      <div className="editor-footer">
                        <span className="text-muted">📅 0 words</span>
                        <div>
                          <button type="button" className="btn btn-sm btn-outline-secondary">&lt;/&gt;</button>
                          <button type="button" className="btn btn-sm btn-outline-secondary">⛶</button>
                        </div>
                      </div>
                    </div>
                  </Form.Group>

                  {/* Quiz Settings */}
                  <div className="quiz-settings">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Quiz Type</Form.Label>
                          <Form.Select
                            value={formData.quizType || "Graded Quiz"}
                            onChange={(e) => handleInputChange("quizType", e.target.value)}
                          >
                            <option value="Graded Quiz">Graded Quiz</option>
                            <option value="Practice Quiz">Practice Quiz</option>
                            <option value="Graded Survey">Graded Survey</option>
                            <option value="Ungraded Survey">Ungraded Survey</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Assignment Group</Form.Label>
                          <Form.Select
                            value={formData.assignmentGroup || "ASSIGNMENTS"}
                            onChange={(e) => handleInputChange("assignmentGroup", e.target.value)}
                          >
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                            <option value="QUIZZES">QUIZZES</option>
                            <option value="EXAMS">EXAMS</option>
                            <option value="PROJECTS">PROJECTS</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Options Section */}
                  <div className="options-section mb-4">
                    <h6>Options</h6>
                    <Row>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          label="Shuffle Answers"
                          checked={formData.shuffleAnswers || false}
                          onChange={(e) => handleInputChange("shuffleAnswers", e.target.checked)}
                        />
                      </Col>
                      <Col md={4}>
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            label="Time Limit"
                            checked={formData.timeLimit ? true : false}
                            onChange={(e) => handleInputChange("timeLimit", e.target.checked ? 20 : 0)}
                            className="me-2"
                          />
                          {formData.timeLimit && (
                            <Form.Control
                              type="number"
                              value={formData.timeLimit || 20}
                              onChange={(e) => handleInputChange("timeLimit", parseInt(e.target.value) || 20)}
                              style={{width: '80px'}}
                              className="me-2"
                            />
                          )}
                          <span className="text-muted">Minutes</span>
                        </div>
                      </Col>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          label="Allow Multiple Attempts"
                          checked={formData.multipleAttempts || false}
                          onChange={(e) => handleInputChange("multipleAttempts", e.target.checked)}
                        />
                        {formData.multipleAttempts && (
                          <div className="mt-2">
                            <Form.Control
                              type="number"
                              placeholder="How many attempts"
                              value={formData.maxAttempts || 1}
                              onChange={(e) => handleInputChange("maxAttempts", parseInt(e.target.value) || 1)}
                              style={{width: '120px'}}
                            />
                            <small className="text-muted">attempts allowed</small>
                          </div>
                        )}
                      </Col>
                    </Row>
                    
                    <Row className="mt-3">
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          label="One Question at a Time"
                          checked={formData.oneQuestionAtATime || false}
                          onChange={(e) => handleInputChange("oneQuestionAtATime", e.target.checked)}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          label="Webcam Required"
                          checked={formData.webcamRequired || false}
                          onChange={(e) => handleInputChange("webcamRequired", e.target.checked)}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          label="Lock Questions After Answering"
                          checked={formData.lockQuestionsAfterAnswering || false}
                          onChange={(e) => handleInputChange("lockQuestionsAfterAnswering", e.target.checked)}
                        />
                      </Col>
                    </Row>
                    
                    <Row className="mt-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Access Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Leave blank for no access code"
                            value={formData.accessCode || ""}
                            onChange={(e) => handleInputChange("accessCode", e.target.value)}
                          />
                          <Form.Text className="text-muted">
                            Students will need to enter this code to access the quiz
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Show Correct Answers</Form.Label>
                          <Form.Select
                            value={formData.showCorrectAnswers ? "immediately" : "never"}
                            onChange={(e) => handleInputChange("showCorrectAnswers", e.target.value === "immediately")}
                          >
                            <option value="immediately">Immediately</option>
                            <option value="never">Never</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Assign Section */}
                  <div className="assign-section">
                    <h6>Assign</h6>
                    <div className="assign-to-section mb-3">
                      <Form.Label>Assign to:</Form.Label>
                      <div className="assign-tag">
                        <span className="badge bg-secondary">Everyone ✕</span>
                      </div>
                    </div>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Due</Form.Label>
                          <div className="input-group">
                            <Form.Control
                              type="datetime-local"
                              value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ""}
                              onChange={(e) => handleInputChange("dueDate", e.target.value)}
                            />
                            <span className="input-group-text">📅</span>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Available from</Form.Label>
                          <div className="input-group">
                            <Form.Control
                              type="datetime-local"
                              value={formData.availableDate ? new Date(formData.availableDate).toISOString().slice(0, 16) : ""}
                              onChange={(e) => handleInputChange("availableDate", e.target.value)}
                            />
                            <span className="input-group-text">📅</span>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Until</Form.Label>
                          <div className="input-group">
                            <Form.Control
                              type="datetime-local"
                              value={formData.untilDate ? new Date(formData.untilDate).toISOString().slice(0, 16) : ""}
                              onChange={(e) => handleInputChange("untilDate", e.target.value)}
                            />
                            <span className="input-group-text">📅</span>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="outline-primary" size="sm">+ Add</Button>
                  </div>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="questions">
                <div className="questions-tab-content">
                  <div className="d-flex justify-content-center mb-4">
                    <Button variant="outline-secondary" size="lg" onClick={handleAddQuestion}>
                      <FaPlus className="me-2" />
                      New Question
                    </Button>
                  </div>
                  
                  {questions.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">No questions added yet.</p>
                    </div>
                  ) : (
                    <div className="questions-list">
                      {questions.map((question: any, index: number) => (
                        <div key={question._id} className="question-item border rounded p-3 mb-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6>Question {index + 1}: {question.title}</h6>
                              <p className="text-muted mb-2">{question.questionText}</p>
                              <div className="d-flex gap-2">
                                <span className="badge bg-secondary">{question.questionType}</span>
                                <span className="badge bg-info">{question.points} points</span>
                              </div>
                            </div>
                            <div className="d-flex gap-1">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                  setEditingQuestion(question);
                                  setShowQuestionEditor(true);
                                }}
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Bottom Action Buttons */}
      <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={() => handleSave(false)}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        {!currentQuiz?.published && (
          <Button 
            variant="success" 
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save & Publish"}
          </Button>
        )}
      </div>

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
