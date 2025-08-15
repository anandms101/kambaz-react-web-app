import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchQuizWithQuestionsAsync, 
  publishQuizAsync, 
  unpublishQuizAsync,
  type Quiz 
} from "./reducer";
import { 
  Button, 
  Alert, 
  Spinner
} from "react-bootstrap";
import { 
  FaEdit, 
  FaEye, 
  FaClock, 
  FaLock,
  FaUnlock,
  FaEyeSlash
} from "react-icons/fa";

export default function QuizDetails() {
  const { cid, quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, questions, loading, error } = useSelector((state: any) => state.quizReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  useEffect(() => {
    if (quizId) {
      (dispatch as any)(fetchQuizWithQuestionsAsync(quizId as any));
    }
  }, [dispatch, quizId]);

  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  // Calculate total points from all questions
  const calculateTotalPoints = () => {
    return questions.reduce((total: number, question: any) => total + (question.points || 0), 0);
  };

  const getAvailabilityStatus = (quiz: Quiz) => {
    const now = new Date();
    const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
    const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (!quiz.published) {
      return { status: "Unpublished", variant: "secondary", icon: <FaEyeSlash /> };
    }

    if (availableDate && now < availableDate) {
      return { 
        status: `Not available until ${availableDate.toLocaleDateString()}`, 
        variant: "warning",
        icon: <FaClock />
      };
    }

    if (untilDate && now > untilDate) {
      return { status: "Closed", variant: "danger", icon: <FaLock /> };
    }

    return { status: "Available", variant: "success", icon: <FaUnlock /> };
  };



  const handlePublishToggle = async () => {
    try {
      if (currentQuiz?.published) {
        await (dispatch as any)(unpublishQuizAsync(currentQuiz._id as any)).unwrap();
      } else {
        await (dispatch as any)(publishQuizAsync(currentQuiz!._id as any)).unwrap();
      }
      // Refresh quiz data
      (dispatch as any)(fetchQuizWithQuestionsAsync(quizId! as any));
    } catch (error) {
      console.error("Failed to toggle quiz publish status:", error);
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

  const availability = getAvailabilityStatus(currentQuiz);

  return (
    <div className="quiz-details-container">
      <div className="d-flex justify-content-center gap-3 mb-4">
        <Button 
          variant="outline-secondary"
          onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Preview`)}
        >
          Preview
        </Button>
        {isFaculty && (
          <Button 
            variant="outline-secondary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Edit`)}
          >
            <FaEdit className="me-2" />
            Edit
          </Button>
        )}
      </div>

      <div className="quiz-info-card border border-2 border-dashed p-4">
        <h2 className="mb-4 text-center">{currentQuiz.title}</h2>
        
        <div className="quiz-properties">
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Quiz Type:</strong>
            <span>{currentQuiz.quizType}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Points:</strong>
            <span>{calculateTotalPoints()}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Assignment Group:</strong>
            <span>{currentQuiz.assignmentGroup}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Shuffle Answers:</strong>
            <span>{currentQuiz.shuffleAnswers ? "Yes" : "No"}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Time Limit:</strong>
            <span>{currentQuiz.timeLimit ? `${currentQuiz.timeLimit} Minutes` : "No limit"}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Multiple Attempts:</strong>
            <span>{currentQuiz.multipleAttempts ? "Yes" : "No"}</span>
          </div>
          {currentQuiz.multipleAttempts && (
            <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
              <strong>How Many Attempts:</strong>
              <span>{currentQuiz.maxAttempts || 1}</span>
            </div>
          )}
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>View Responses:</strong>
            <span>Always</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Show Correct Answers:</strong>
            <span>{currentQuiz.showCorrectAnswers ? "Immediately" : "Never"}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Access Code:</strong>
            <span>
              {isFaculty 
                ? (currentQuiz.accessCode ? currentQuiz.accessCode : "No access code")
                : (currentQuiz.accessCode ? "Required" : "No access code")
              }
            </span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>One Question at a Time:</strong>
            <span>{currentQuiz.oneQuestionAtATime ? "Yes" : "No"}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Require Respondus LockDown Browser:</strong>
            <span>No</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Required to View Quiz Results:</strong>
            <span>No</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Webcam Required:</strong>
            <span>{currentQuiz.webcamRequired ? "Yes" : "No"}</span>
          </div>
          <div className="property-row d-flex justify-content-between align-items-center py-2 border-bottom">
            <strong>Lock Questions After Answering:</strong>
            <span>{currentQuiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</span>
          </div>
        </div>

        <hr className="my-4" />
        
        <h5 className="mb-3">Availability and Due Dates</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available from</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentQuiz.dueDate ? new Date(currentQuiz.dueDate).toLocaleDateString() + ' at ' + new Date(currentQuiz.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "No due date"}</td>
                <td>Everyone</td>
                <td>{currentQuiz.availableDate ? new Date(currentQuiz.availableDate).toLocaleDateString() + ' at ' + new Date(currentQuiz.availableDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "No start date"}</td>
                <td>{currentQuiz.untilDate ? new Date(currentQuiz.untilDate).toLocaleDateString() + ' at ' + new Date(currentQuiz.untilDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "No end date"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {!isFaculty && currentQuiz.published && availability.status === "Available" && (
          <div className="mt-4 text-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}/Take`)}
            >
              Start Quiz
            </Button>
          </div>
        )}

        {isFaculty && (
          <div className="mt-4 d-flex justify-content-center gap-3">
            <Button 
              variant={currentQuiz.published ? "warning" : "success"}
              onClick={handlePublishToggle}
            >
              {currentQuiz.published ? (
                <>
                  <FaEyeSlash className="me-2" />
                  Unpublish
                </>
              ) : (
                <>
                  <FaEye className="me-2" />
                  Publish
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
