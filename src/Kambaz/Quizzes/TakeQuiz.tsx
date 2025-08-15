import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchQuizWithQuestionsAsync, 
  startQuizAttemptAsync, 
  submitQuizAttemptAsync 
} from "./reducer";
import { 
  Card, 
  Button, 
  Alert, 
  Spinner,
  ProgressBar,
  Badge,
  Form,
  Modal} from "react-bootstrap";
import { 
  FaPlay, 
  FaStop, 
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSave
} from "react-icons/fa";
import * as client from "./client";

export default function TakeQuiz() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, questions, loading, error, currentAttempt } = useSelector((state: any) => state.quizReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: any}>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [previousAttempts, setPreviousAttempts] = useState<any[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);

  useEffect(() => {
    if (quizId) {
      (dispatch as any)(fetchQuizWithQuestionsAsync(quizId as any));
      fetchPreviousAttempts();
    }
  }, [dispatch, quizId]);

  const fetchPreviousAttempts = async () => {
    if (!quizId || !currentUser) return;
    setLoadingAttempts(true);
    try {
      const attempts = await client.fetchQuizAttemptsForStudent(quizId);
      setPreviousAttempts(attempts || []);
    } catch (err) {
      console.error("Error fetching previous attempts:", err);
      setPreviousAttempts([]);
    } finally {
      setLoadingAttempts(false);
    }
  };

  useEffect(() => {
    if (currentQuiz && isStarted && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 0) {
            handleSubmitQuiz();
            return 0;
          }
          
          // Show warning when 5 minutes remaining
          if (prev === 300) {
            setShowTimeWarning(true);
          }
          
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuiz, isStarted, isCompleted]);



  const isStudent = currentUser?.role === "STUDENT";

  if (!isStudent) {
    return (
      <Alert variant="danger">
        Only students can take quizzes.
      </Alert>
    );
  }

  const handleStartQuiz = async () => {
    // Check if access code is required
    if (currentQuiz?.accessCode && currentQuiz.accessCode.trim() !== "") {
      if (!accessCode.trim()) {
        setAccessCodeError("Please enter the access code to start the quiz.");
        return;
      }
      // Validate access code
      if (accessCode.trim() !== currentQuiz.accessCode.trim()) {
        setAccessCodeError("Invalid access code. Please try again.");
        return;
      }
    }
    
    // Clear any previous errors
    setAccessCodeError("");
    await startQuizAttempt();
  };

  const startQuizAttempt = async () => {
    try {
      // Start quiz attempt
      await dispatch(startQuizAttemptAsync(quizId!) as any).unwrap();
      setIsStarted(true);
      setTimeRemaining(currentQuiz?.timeLimit ? currentQuiz.timeLimit * 60 : null);
    } catch (error: any) {
      
      // Handle different error scenarios with specific messages
      if (error.response?.status === 403) {
        if (error.response?.data?.message?.includes("Maximum attempts reached") || 
            error.response?.data?.message?.includes("max attempts")) {
          setErrorTitle("Maximum Attempts Reached");
          setErrorMessage("You have already taken this quiz the maximum number of times allowed. Please contact your instructor if you need additional attempts.");
        } else if (error.response?.data?.message?.includes("not enrolled")) {
          setErrorTitle("Not Enrolled");
          setErrorMessage("You are not enrolled in this course. Please contact your instructor to be added to the course.");
        } else if (error.response?.data?.message?.includes("not published")) {
          setErrorTitle("Quiz Not Available");
          setErrorMessage("This quiz is not currently available. Please check back later or contact your instructor.");
        } else {
          setErrorTitle("Access Denied");
          setErrorMessage("You do not have permission to take this quiz. Please contact your instructor.");
        }
      } else if (error.response?.status === 404) {
        setErrorTitle("Quiz Not Found");
        setErrorMessage("This quiz could not be found. It may have been deleted or moved.");
      } else if (error.response?.status === 500) {
        setErrorTitle("Server Error");
        setErrorMessage("There was a problem with the server. Please try again later or contact support.");
      } else {
        setErrorTitle("Error Starting Quiz");
        setErrorMessage("There was an unexpected error while starting the quiz. Please try again or contact support if the problem persists.");
      }
      
      setShowErrorModal(true);
    }
  };



  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsCompleted(true);
    
    try {
      // Submit quiz attempt
      const result = await (dispatch as any)(submitQuizAttemptAsync({
        quizId: quizId!,
        attemptId: currentAttempt?._id,
        answers: Object.entries(answers as any).map(([questionId, answer]) => ({
          questionId,
          answer
        }))
      })).unwrap();
      
      setScore(result.score);
      setShowResults(true);
      // Navigate to results page after a short delay
      setTimeout(() => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Results`);
      }, 3000);
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      setErrorTitle("Error Submitting Quiz");
      setErrorMessage("There was an error submitting your quiz. Please try again or contact support if the problem persists.");
      setShowErrorModal(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: any) => {
    const currentAnswer = answers[question._id];

    switch (question.questionType) {
      case 'multiple-choice':
        return (
          <div>
            {question.options.map((option: any, index: number) => (
              <Form.Check
                key={index}
                type="radio"
                id={`${question._id}-${index}`}
                name={question._id}
                label={option.text}
                checked={currentAnswer === option.text}
                onChange={() => handleAnswerChange(question._id, option.text)}
                className="mb-2"
              />
            ))}
          </div>
        );

      case 'true-false':
        return (
          <div>
            <Form.Check
              type="radio"
              id={`${question._id}-true`}
              name={question._id}
              label="True"
              checked={currentAnswer === true}
              onChange={() => handleAnswerChange(question._id, true)}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id={`${question._id}-false`}
              name={question._id}
              label="False"
              checked={currentAnswer === false}
              onChange={() => handleAnswerChange(question._id, false)}
              className="mb-2"
            />
          </div>
        );

      case 'fill-blank':
        return (
          <Form.Control
            type="text"
            value={currentAnswer || ""}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Enter your answer"
          />
        );

      default:
        return <p>Unsupported question type</p>;
    }
  };

  const renderResults = () => {
    if (!showResults || score === null || !currentAttempt) return null;

    const maxScore = questions.reduce((total: number, q: any) => total + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <Card className="mb-4">
        <Card.Header>
          <h4>Quiz Results</h4>
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <h2>Score: {score}/{maxScore} ({percentage}%)</h2>
            <ProgressBar 
              now={percentage} 
              variant={percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "danger"}
              className="mb-3"
            />
            <p className="text-muted">
              Attempt #{currentAttempt.attemptNumber} • 
              Completed on {new Date(currentAttempt.endTime).toLocaleString()}
            </p>
          </div>
          
          {currentQuiz?.showCorrectAnswers && (
            <div>
              <h5>Question Review</h5>
              {questions.map((question: any, index: number) => {
                const answer = answers[question._id];
                let isCorrect = false;
                let correctAnswer = "";

                switch (question.questionType) {
                  case 'multiple-choice':
                    const correctOption = question.options.find((opt: any) => opt.isCorrect);
                    correctAnswer = correctOption?.text || "";
                    isCorrect = answer === correctAnswer;
                    break;
                  case 'true-false':
                    correctAnswer = question.correctAnswer ? "True" : "False";
                    isCorrect = answer === question.correctAnswer;
                    break;
                  case 'fill-blank':
                    correctAnswer = question.correctAnswers.join(" or ");
                    isCorrect = question.correctAnswers.some((correct: string) => 
                      correct.toLowerCase() === answer?.toLowerCase()
                    );
                    break;
                }

                return (
                  <div key={question._id} className={`border rounded p-3 mb-3 ${isCorrect ? 'border-success' : 'border-danger'}`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6>Question {index + 1}: {question.title}</h6>
                        <p className="mb-2">{question.questionText}</p>
                        <p><strong>Your Answer:</strong> {answer || "No answer"}</p>
                        <p><strong>Correct Answer:</strong> {correctAnswer}</p>
                      </div>
                      <div>
                        {isCorrect ? (
                          <Badge bg="success"><FaCheck /> Correct</Badge>
                        ) : (
                          <Badge bg="danger"><FaTimes /> Incorrect</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card.Body>
      </Card>
    );
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

  if (showResults) {
    return (
      <div className="take-quiz-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Quiz Results: {currentQuiz.title}</h2>
          <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
            <FaArrowLeft className="me-2" />
            Back to Quizzes
          </Button>
        </div>

        {renderResults()}
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="take-quiz-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Take Quiz: {currentQuiz.title}</h2>
          <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
            <FaArrowLeft className="me-2" />
            Back to Quizzes
          </Button>
        </div>

        <Card>
          <Card.Header>
            <h4>Quiz Instructions</h4>
          </Card.Header>
          <Card.Body>
            <p><strong>Description:</strong> {currentQuiz.description}</p>
            <p><strong>Time Limit:</strong> {currentQuiz.timeLimit} minutes</p>
            <p><strong>Points:</strong> {currentQuiz.points}</p>
            <p><strong>Questions:</strong> {questions.length}</p>
            <p><strong>Quiz Type:</strong> {currentQuiz.quizType}</p>

            {/* Previous attempts summary */}
            {loadingAttempts ? (
              <div className="my-3">
                <Spinner animation="border" size="sm" className="me-2" /> Loading your previous attempts...
              </div>
            ) : previousAttempts.length > 0 ? (
              <div className="my-3">
                <h6 className="mb-2">Your Previous Attempt{previousAttempts.length > 1 ? 's' : ''}</h6>
                <div className="small text-muted">
                  Last attempt: {new Date(previousAttempts[previousAttempts.length - 1].createdAt).toLocaleString()} ·
                  Score: {previousAttempts[previousAttempts.length - 1].score}/{currentQuiz.points}
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Results`)}
                >
                  View Attempt History
                </Button>
              </div>
            ) : null}
            
            {currentQuiz.accessCode && (
              <Alert variant="info">
                <strong>Access Code Required:</strong> This quiz requires an access code to begin.
              </Alert>
            )}

            {currentQuiz.accessCode && (
              <div className="mt-3">
                <Form.Group>
                  <Form.Label>Access Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      setAccessCodeError("");
                    }}
                    placeholder="Enter the access code to start the quiz"
                    isInvalid={!!accessCodeError}
                  />
                  {accessCodeError && (
                    <Form.Control.Feedback type="invalid">
                      {accessCodeError}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            )}
            
            <div className="text-center mt-4">
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleStartQuiz}
                disabled={loading}
              >
                <FaPlay className="me-2" />
                Start Quiz
              </Button>
            </div>

            {/* Inline error fallback if modal is blocked */}
            {errorTitle && errorMessage && !showErrorModal && (
              <Alert variant="danger" className="mt-3">
                <strong>{errorTitle}:</strong> {errorMessage}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="take-quiz-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{currentQuiz.title}</h2>
        <div className="d-flex align-items-center gap-3">
          {timeRemaining !== null && (
            <div className={`d-flex align-items-center gap-2 ${timeRemaining <= 300 ? 'text-danger' : ''}`}>
              <FaClock />
              <span className="fw-bold">{formatTime(timeRemaining)}</span>
            </div>
          )}
          <Badge bg="info">{answeredCount}/{questions.length} answered</Badge>
          <Button variant="outline-danger" onClick={() => setShowSubmitModal(true)}>
            <FaStop className="me-2" />
            Submit Quiz
          </Button>
        </div>
      </div>

      <ProgressBar now={progress} className="mb-4" />
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>

      <Card>
        <Card.Body>
          <div className="mb-4">
            <h4>{currentQuestion.title}</h4>
            <p className="text-muted">{currentQuestion.questionText}</p>
            <Badge bg="info" className="mb-3">{currentQuestion.points} points</Badge>
          </div>

          {renderQuestion(currentQuestion)}
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between mt-4">
        <Button 
          variant="outline-primary" 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <FaArrowLeft className="me-2" />
          Previous
        </Button>
        
        <div className="d-flex gap-2">
          {questions.map((_: any, index: number) => (
            <Button
              key={index}
              variant={
                index === currentQuestionIndex 
                  ? "primary" 
                  : answers[questions[index]._id] 
                    ? "success" 
                    : "outline-secondary"
              }
              size="sm"
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button 
          variant="outline-primary" 
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
          <FaArrowRight className="me-2" />
        </Button>
      </div>

      {/* Time Warning Modal */}
      <Modal show={showTimeWarning} onHide={() => setShowTimeWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-warning me-2" />
            Time Warning
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You have 5 minutes remaining to complete this quiz.</p>
          <p>Please review your answers and submit when ready.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={() => setShowTimeWarning(false)}>
            Continue Quiz
          </Button>
        </Modal.Footer>
      </Modal>



      {/* Submit Confirmation Modal */}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to submit this quiz?</p>
          <p><strong>Questions answered:</strong> {answeredCount} out of {questions.length}</p>
          {answeredCount < questions.length && (
            <Alert variant="warning">
              You have unanswered questions. You can still submit, but unanswered questions will be marked as incorrect.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>
            Continue Quiz
          </Button>
          <Button variant="danger" onClick={handleSubmitQuiz}>
            <FaSave className="me-2" />
            Submit Quiz
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-danger me-2" />
            {errorTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
          {errorTitle === "Maximum Attempts Reached" && (
            <Button 
              variant="primary" 
              onClick={() => {
                setShowErrorModal(false);
                navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Results`);
              }}
            >
              View Results
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
