import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizWithQuestionsAsync } from "./reducer";
import { 
  Card, 
  Button, 
  Alert, 
  Spinner,
  ProgressBar,
  Badge,
  Form
} from "react-bootstrap";
import { 
  FaEdit, 
  FaCheck, 
  FaTimes,
  FaArrowLeft,
  FaPlay
} from "react-icons/fa";

export default function QuizPreview() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, questions, loading, error } = useSelector((state: any) => state.quizReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: any}>({});

  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeError, setAccessCodeError] = useState("");

  useEffect(() => {
    if (quizId) {
      (dispatch as any)(fetchQuizWithQuestionsAsync(quizId as any));
      // Reset state when quiz changes
      setIsStarted(false);
      setShowResults(false);
      setScore(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
    }
  }, [dispatch, quizId]);



  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const isCreator = currentQuiz?.createdBy === currentUser?._id;

  if (!isFaculty || !isCreator) {
    return (
      <Alert variant="danger">
        You don't have permission to preview this quiz.
      </Alert>
    );
  }

  const handleStartQuiz = () => {
    // If quiz has an access code, validate like student view
    if (currentQuiz?.accessCode && currentQuiz.accessCode.trim() !== "") {
      if (!accessCode.trim()) {
        setAccessCodeError("Please enter the access code to start the preview.");
        return;
      }
      if (accessCode.trim() !== currentQuiz.accessCode.trim()) {
        setAccessCodeError("Invalid access code. Please try again.");
        return;
      }
    }
    setAccessCodeError("");
    setIsStarted(true);
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



  const handleSubmitQuiz = () => {
    setShowResults(true);
    
    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    
    questions.forEach((question: any) => {
      maxScore += question.points;
      const answer = answers[question._id];
      
      if (answer !== undefined) {
        let isCorrect = false;
        
        switch (question.questionType) {
          case 'multiple-choice':
            const correctOption = question.options.find((opt: any) => opt.isCorrect);
            isCorrect = answer === correctOption?.text;
            break;
          case 'true-false':
            isCorrect = answer === question.correctAnswer;
            break;
          case 'fill-blank':
            isCorrect = question.correctAnswers.some((correct: string) => 
              correct.toLowerCase() === answer.toLowerCase()
            );
            break;
        }
        
        if (isCorrect) {
          totalScore += question.points;
        }
      }
    });
    
    setScore(totalScore);
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
        // Handle both legacy single-blank and new multi-blank structure
        if (question.blanks && question.blanks.length > 0) {
          // New multi-blank structure
          const blankAnswers = currentAnswer || {};
          return (
            <div>
              <p className="text-muted mb-3">
                <strong>Instructions:</strong> Fill in each blank with your answer.
              </p>
              {question.blanks.map((blank: any, blankIndex: number) => (
                <div key={blank.id} className="mb-3">
                  <Form.Label htmlFor={`${question._id}-${blank.id}`}>
                    <strong>Blank {blankIndex + 1}:</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id={`${question._id}-${blank.id}`}
                    value={blankAnswers[blank.id] || ""}
                    onChange={(e) => {
                      const newAnswers = { ...blankAnswers, [blank.id]: e.target.value };
                      handleAnswerChange(question._id, newAnswers);
                    }}
                    placeholder={`Enter answer for blank ${blankIndex + 1}`}
                    className="mb-2"
                  />
                </div>
              ))}
            </div>
          );
        } else {
          // Legacy single-blank structure
          return (
            <Form.Control
              type="text"
              value={currentAnswer || ""}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              placeholder="Enter your answer"
            />
          );
        }

      default:
        return <p>Unsupported question type</p>;
    }
  };

  const renderResults = () => {
    if (!showResults || score === null) return null;

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
          </div>
          
          <div>
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

  if (showResults && isStarted) {
    return (
      <div className="quiz-results-container">
        <div className="quiz-results-header">
          <h2>Quiz Preview: {currentQuiz.title}</h2>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Questions`)}>
              <FaEdit className="me-2" />
              Edit Quiz
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`)}>
              <FaArrowLeft className="me-2" />
              Back to Details
            </Button>
          </div>
        </div>

        <div className="quiz-results-content">
          {renderResults()}
        </div>
      </div>
    );
  }

  if (!isStarted) {
    // Match student TakeQuiz initial layout
    return (
      <div className="take-quiz-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Quiz Preview: {currentQuiz.title}</h2>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Questions`)}>
              <FaEdit className="me-2" />
              Edit Quiz
            </Button>
            <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`)}>
              <FaArrowLeft className="me-2" />
              Back to Details
            </Button>
          </div>
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
                    placeholder="Enter the access code to start the preview"
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
              >
                <FaPlay className="me-2" />
                Start Preview
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  // Removed unused currentTime after layout change

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="take-quiz-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quiz Preview: {currentQuiz.title}</h2>
        <div className="d-flex align-items-center gap-3">
          <Badge bg="info">{answeredCount}/{questions.length} answered</Badge>
          <Button variant="outline-danger" onClick={handleSubmitQuiz}>
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
          onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
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
        </Button>
      </div>
    </div>
  );
}
