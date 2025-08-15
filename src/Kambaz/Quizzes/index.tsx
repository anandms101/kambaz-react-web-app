import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchQuizzesForCourse, 
  createQuizAsync, 
  deleteQuizAsync, 
  publishQuizAsync, 
  unpublishQuizAsync,
  type Quiz 
} from "./reducer";
import * as client from "./client";

import { 
  Button, 
  Dropdown, 
  Modal, 
  Alert,
  Spinner
} from "react-bootstrap";
import { 
  FaPlus, 
  FaEllipsisV, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaSort
} from "react-icons/fa";

export default function Quizzes() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizzes, loading, error } = useSelector((state: any) => state.quizReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [sortBy, setSortBy] = useState("availableDate");
  const [questionCounts, setQuestionCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (cid) {
      dispatch(fetchQuizzesForCourse(cid) as any);
    }
  }, [dispatch, cid]);

  // Fetch question counts for each quiz
  useEffect(() => {
    const fetchQuestionCounts = async () => {
      const counts: {[key: string]: number} = {};
      for (const quiz of quizzes) {
        try {
          const questions = await client.fetchQuestionsForQuiz(quiz._id);
          counts[quiz._id] = questions.length;
        } catch (error) {
          console.error(`Error fetching questions for quiz ${quiz._id}:`, error);
          counts[quiz._id] = 0;
        }
      }
      setQuestionCounts(counts);
    };

    if (quizzes.length > 0) {
      fetchQuestionCounts();
    }
  }, [quizzes]);

  // Filter quizzes based on user role
  const filteredQuizzes = (currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN")
    ? quizzes // Faculty can see all quizzes
    : quizzes.filter((quiz: Quiz) => quiz.published); // Students can only see published quizzes

  // Sort quizzes based on selected criteria
  const sortedQuizzes = [...filteredQuizzes].sort((a: any, b: any) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);
      case "dueDate":
        const dueDateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dueDateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return dueDateA - dueDateB;
      case "availableDate":
      default:
        const availableDateA = a.availableDate ? new Date(a.availableDate).getTime() : 0;
        const availableDateB = b.availableDate ? new Date(b.availableDate).getTime() : 0;
        return availableDateA - availableDateB;
    }
  });

  const handleCreateQuiz = async () => {
    if (cid) {
      const quizData = {
        title: "New Quiz", // Default name as per requirements
        courseId: cid,
        description: "",
        quizType: "Graded Quiz" as const,
        points: 0,
        assignmentGroup: "Quizzes" as const,
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        maxAttempts: 1,
        showCorrectAnswers: true,
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        published: false
      };

      try {
        const result = await dispatch(createQuizAsync(quizData) as any).unwrap();
        // Navigate directly to quiz editor for editing (as per requirements)
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${result._id}/Edit`);
      } catch (error) {
        console.error("Failed to create quiz:", error);
      }
    }
  };

  const handleDeleteQuiz = async () => {
    if (quizToDelete) {
      try {
        await dispatch(deleteQuizAsync(quizToDelete._id) as any).unwrap();
        setShowDeleteModal(false);
        setQuizToDelete(null);
      } catch (error) {
        console.error("Failed to delete quiz:", error);
      }
    }
  };

  // Copy quiz (optional) removed from UI per requirements clarification

  const handleSortQuizzes = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handlePublishToggle = async (quiz: any) => {
    try {
      if (quiz.published) {
        await dispatch(unpublishQuizAsync(quiz._id) as any).unwrap();
      } else {
        await dispatch(publishQuizAsync(quiz._id) as any).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle quiz publish status:", error);
    }
  };

  const getAvailabilityStatus = (quiz: Quiz) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (!quiz.published) {
      return { status: "Unpublished", variant: "secondary" };
    }

    if (availableDate && now < availableDate) {
      return { 
        status: `Not available until ${availableDate.toLocaleDateString()}`, 
        variant: "warning" 
      };
    }

    if (untilDate && now > untilDate) {
      return { status: "Closed", variant: "danger" };
    }

    return { status: "Available", variant: "success" };
  };

  const getQuestionCount = (quiz: Quiz) => {
    // Return actual question count if available, otherwise fallback to estimate
    if (questionCounts[quiz._id] !== undefined) {
      return questionCounts[quiz._id];
    }
    
    // Fallback: estimate based on points if actual count not available yet
    if (quiz.points === 0) return 0;
    return Math.max(1, Math.floor(quiz.points / 10)); // Conservative estimate
  };

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const [studentScores, setStudentScores] = useState<{[key: string]: number | null}>({});

  // Fetch student scores for quizzes
  useEffect(() => {
    const fetchStudentScores = async () => {
      if (!isFaculty && currentUser) {
        const scores: {[key: string]: number | null} = {};
        for (const quiz of quizzes) {
          try {
            const attempts = await client.fetchQuizAttemptsForStudent(quiz._id);
            if (attempts && attempts.length > 0) {
              // Get the last attempt score
              const lastAttempt = attempts[attempts.length - 1];
              scores[quiz._id] = lastAttempt.score;
            } else {
              scores[quiz._id] = null;
            }
          } catch (error) {
            console.error(`Error fetching attempts for quiz ${quiz._id}:`, error);
            scores[quiz._id] = null;
          }
        }
        setStudentScores(scores);
      }
    };

    if (quizzes.length > 0 && !isFaculty && currentUser) {
      fetchStudentScores();
    }
  }, [quizzes, isFaculty, currentUser]);

  const getStudentScore = (quiz: Quiz) => {
    // For students, show their last attempt score
    if (!isFaculty && currentUser) {
      return studentScores[quiz._id] || null;
    }
    return null;
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

  return (
    <div className="quizzes-container">
      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <h3>Quizzes</h3>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for Quiz"
              className="form-control"
              style={{ width: '250px' }}
            />
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
          {quizzes.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <small className="text-muted">Sort by:</small>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  <FaSort className="me-2" />
                  {sortBy === "name" ? "Name" : 
                   sortBy === "dueDate" ? "Due Date" : "Available Date"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item 
                    active={sortBy === "name"}
                    onClick={() => handleSortQuizzes("name")}
                  >
                    Name
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={sortBy === "dueDate"}
                    onClick={() => handleSortQuizzes("dueDate")}
                  >
                    Due Date
                  </Dropdown.Item>
                  <Dropdown.Item 
                    active={sortBy === "availableDate"}
                    onClick={() => handleSortQuizzes("availableDate")}
                  >
                    Available Date
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          {isFaculty && (
            <Button 
              variant="danger" 
              onClick={handleCreateQuiz}
              className="d-flex align-items-center gap-2"
            >
              <FaPlus /> Add Quiz
            </Button>
          )}
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No quizzes yet</h4>
          <p className="text-muted">
            {(currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN")
              ? "Create your first quiz to get started."
              : "No quizzes have been published for this course yet."
            }
          </p>
          {(currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") && (
            <Button 
              variant="danger" 
              onClick={handleCreateQuiz}
              className="d-inline-flex align-items-center gap-2"
            >
              <FaPlus /> Add Quiz
            </Button>
          )}
        </div>
      ) : (
        <div className="quiz-list">
          {sortedQuizzes.map((quiz) => {
            const availability = getAvailabilityStatus(quiz);
            const questionCount = getQuestionCount(quiz);
            const studentScore = getStudentScore(quiz);

            return (
              <div key={quiz._id} className="quiz-item d-flex align-items-center py-3 border-bottom">
                <div className="quiz-icon me-3">
                  <i className="fas fa-rocket text-success" style={{ fontSize: '1.2rem' }}></i>
                </div>
                
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="quiz-info">
                      <h6 className="mb-1">
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (isFaculty) {
                              navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`);
                            } else {
                              navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Take`);
                            }
                          }}
                          className="text-decoration-none text-dark fw-bold"
                        >
                          {quiz.title}
                        </a>
                      </h6>
                      
                      <div className="quiz-details text-muted small">
                        <span className="me-3">
                          {availability.status}
                        </span>
                        <span className="me-3">
                          Due {quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : "No due date"}
                        </span>
                        <span className="me-3">
                          {quiz.points} pts
                        </span>
                        <span className="me-3">
                          {questionCount} Questions
                        </span>
                        {studentScore !== null && (
                          <span>
                            Score: {studentScore}/{quiz.points}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="quiz-actions d-flex align-items-center gap-2">
                      {quiz.published ? (
                        <i 
                          className="fas fa-check text-success" 
                          title="Published"
                        ></i>
                      ) : (
                        <i 
                          className="fas fa-times-circle text-danger" 
                          title="Unpublished"
                        ></i>
                      )}
                      
                      {isFaculty && (
                        <Dropdown>
                          <Dropdown.Toggle variant="link" className="text-muted p-0 border-0">
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item 
                              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`)}
                            >
                              <FaEdit className="me-2" />
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Preview`)}
                            >
                              <FaEye className="me-2" />
                              Preview
                            </Dropdown.Item>
                            <Dropdown.Item 
                              onClick={() => handlePublishToggle(quiz)}
                            >
                              {quiz.published ? <FaEyeSlash className="me-2" /> : <FaEye className="me-2" />}
                              {quiz.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              className="text-danger"
                              onClick={() => {
                                setQuizToDelete(quiz);
                                setShowDeleteModal(true);
                              }}
                            >
                              <FaTrash className="me-2" />
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}



      {/* Delete Quiz Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{quizToDelete?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteQuiz}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
