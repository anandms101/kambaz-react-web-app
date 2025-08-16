import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchQuizWithQuestionsAsync 
} from "./reducer";
import { 
  Card, 
  Button, 
  Alert, 
  Spinner,
  ProgressBar,
  Badge,
  Row,
  Col,
  Table,
  Tabs,
  Tab,
  Accordion
} from "react-bootstrap";
import { 
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaClock,
  FaEye,
  FaDownload,
  FaPrint,
  FaTrophy,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";

export default function QuizResults() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, questions, loading, error } = useSelector((state: any) => state.quizReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [attempts, setAttempts] = useState<any[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (quizId) {
      (dispatch as any)(fetchQuizWithQuestionsAsync(quizId as any));
      fetchAttempts();
    }
  }, [dispatch, quizId]);

  const fetchAttempts = async () => {
    setLoadingAttempts(true);
    const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4002";
    try {
      const response = await fetch(`${REMOTE_SERVER}/api/quizzes/${quizId}/attempts`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAttempts(data);
        if (data.length > 0) {
          setSelectedAttempt(data[0]); // Select the most recent attempt
        }
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    } finally {
      setLoadingAttempts(false);
    }
  };

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString();
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  const getScoreor = (percentage: number) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "info";
    if (percentage >= 70) return "warning";
    return "danger";
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 90) return <FaTrophy className="text-warning" />;
    if (percentage >= 80) return <FaCheckCircle className="text-success" />;
    if (percentage >= 70) return <FaExclamationTriangle className="text-warning" />;
    return <FaTimes className="text-danger" />;
  };

  // Stats panel removed per requirements

  const renderAttemptDetails = (attempt: any) => {
    if (!attempt || !questions.length) return null;

    const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
    const scoreor = getScoreor(percentage);
    const scoreIcon = getScoreIcon(percentage);

    return (
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5>Attempt #{attempt.attemptNumber} Details</h5>
            <div className="d-flex gap-2">
              <Badge bg={scoreor}>
                {scoreIcon} {attempt.score}/{attempt.maxScore} ({percentage}%)
              </Badge>
              <Badge bg="secondary">
                <FaClock /> {formatDuration(attempt.startTime, attempt.endTime)}
              </Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <h6>Attempt Information</h6>
              <p><strong>Started:</strong> {formatDate(attempt.startTime)}</p>
              <p><strong>Completed:</strong> {formatDate(attempt.endTime)}</p>
              <p><strong>Duration:</strong> {formatDuration(attempt.startTime, attempt.endTime)}</p>
            </Col>
            <Col md={6}>
              <h6>Performance</h6>
              <ProgressBar 
                now={percentage} 
                variant={scoreor}
                className="mb-2"
              />
              <p><strong>Score:</strong> {attempt.score} out of {attempt.maxScore} points</p>
              <p><strong>Percentage:</strong> {percentage}%</p>
            </Col>
          </Row>

          {currentQuiz?.showCorrectAnswers && (
            <div>
              <h6>Question Review</h6>
              <Accordion>
                {questions.map((question: any, index: number) => {
                  const answer = attempt.answers?.find((a: any) => a.questionId === question._id);
                  let isCorrect = false;
                  let correctAnswer = "";
                  let studentAnswer = answer?.answer !== undefined ? answer.answer : "No answer";

                  switch (question.questionType) {
                    case 'multiple-choice':
                      const correctOption = question.options.find((opt: any) => opt.isCorrect);
                      correctAnswer = correctOption?.text || "";
                      isCorrect = studentAnswer === correctAnswer;
                      break;
                    case 'true-false':
                      correctAnswer = question.correctAnswer ? "True" : "False";
                      isCorrect = studentAnswer === question.correctAnswer;
                      break;
                    case 'fill-blank':
                      // Handle both legacy single-blank and new multi-blank structure
                      if (question.blanks && question.blanks.length > 0) {
                        // New multi-blank structure with partial credit display
                        const blankAnswers = studentAnswer || {};
                        let correctBlanks = 0;
                        let correctAnswersText = "";
                        
                        question.blanks.forEach((blank: any, blankIndex: number) => {
                          const studentBlankAnswer = blankAnswers[blank.id] || "";
                          const isBlankCorrect = blank.answers.some((correct: string) => 
                            correct.toLowerCase() === studentBlankAnswer.toLowerCase()
                          );
                          if (isBlankCorrect) {
                            correctBlanks++;
                          }
                          
                          if (blankIndex > 0) correctAnswersText += "; ";
                          correctAnswersText += `Blank ${blankIndex + 1}: ${blank.answers.join(" or ")}`;
                        });
                        
                        correctAnswer = correctAnswersText;
                        isCorrect = correctBlanks === question.blanks.length; // Fully correct only if all blanks are right
                      } else {
                        // Legacy single-blank structure
                        correctAnswer = question.correctAnswers.join(" or ");
                        isCorrect = question.correctAnswers.some((correct: string) => 
                          correct.toLowerCase() === studentAnswer?.toLowerCase()
                        );
                      }
                      break;
                  }

                  return (
                    <Accordion.Item key={question._id} eventKey={index.toString()}>
                      <Accordion.Header>
                        <div className="d-flex align-items-center gap-2">
                          <span>Question {index + 1}: {question.title}</span>
                          {isCorrect ? (
                            <Badge bg="success"><FaCheck /> Correct</Badge>
                          ) : (
                            <Badge bg="danger"><FaTimes /> Incorrect</Badge>
                          )}
                          <Badge bg="info">{question.points} points</Badge>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <p><strong>Question:</strong> {question.questionText}</p>
                        <p><strong>Your Answer:</strong> {
                          typeof studentAnswer === 'object' && studentAnswer !== null
                            ? Object.entries(studentAnswer).map(([blankId, answer], idx) => (
                                <span key={blankId}>
                                  {idx > 0 ? ', ' : ''}Blank {idx + 1}: {answer as string}
                                </span>
                              ))
                            : (question.questionType === 'true-false' && typeof studentAnswer === 'boolean')
                              ? (studentAnswer ? "True" : "False")
                              : studentAnswer
                        }</p>
                        <p><strong>Correct Answer:</strong> {correctAnswer}</p>
                        <p><strong>Points Earned:</strong> {answer?.points || 0}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  const renderAttemptsTable = () => {
    return (
      <Card>
        <Card.Header>
          <h5>{isFaculty ? "Attempt History" : "Your Last Attempt"}</h5>
        </Card.Header>
        <Card.Body>
          {!isFaculty && attempts.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">You haven't taken this quiz yet.</p>
            </div>
          )}
          
          {attempts.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Attempt #</th>
                  <th>Date</th>
                  <th>Duration</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => {
                  const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
                  const scoreor = getScoreor(percentage);
                  
                  return (
                    <tr 
                      key={attempt._id}
                      className={selectedAttempt?._id === attempt._id ? "table-active" : ""}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedAttempt(attempt);
                        setActiveTab("overview");
                      }}
                    >
                      <td>{attempt.attemptNumber}</td>
                      <td>{formatDate(attempt.endTime)}</td>
                      <td>{formatDuration(attempt.startTime, attempt.endTime)}</td>
                      <td>{attempt.score}/{attempt.maxScore}</td>
                      <td>
                        <Badge bg={scoreor}>{percentage}%</Badge>
                      </td>
                      <td>
                        <Badge bg="success">Completed</Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAttempt(attempt);
                            setActiveTab("overview");
                          }}
                        >
                          <FaEye />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
          
          {!isFaculty && attempts.length > 0 && (
            <div className="mt-3 p-3 bg-light rounded">
              <small className="text-muted">
                <strong>Note:</strong> You can only see your last attempt. Previous attempts are not visible to students.
              </small>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  // Stats panel removed per requirements

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
    <div className="quiz-results-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quiz Results: {currentQuiz.title}</h2>
        <div className="d-flex gap-2">
          {isFaculty && (
            <>
              <Button variant="outline-primary">
                <FaDownload className="me-2" />
                Export Results
              </Button>
              <Button variant="outline-secondary">
                <FaPrint className="me-2" />
                Print
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
            <FaArrowLeft className="me-2" />
            Back to Quizzes
          </Button>
        </div>
      </div>

      {loadingAttempts ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading attempt history...</p>
        </div>
      ) : attempts.length === 0 ? (
        <Alert variant="info">
          No attempts found for this quiz.
        </Alert>
      ) : (
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "overview")} className="mb-4">
          <Tab eventKey="overview" title="Overview">
            {selectedAttempt && renderAttemptDetails(selectedAttempt)}
          </Tab>
          <Tab eventKey="history" title="Attempt History">
            {renderAttemptsTable()}
          </Tab>
        </Tabs>
      )}
    </div>
  );
}
