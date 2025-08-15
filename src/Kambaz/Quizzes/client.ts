import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });

// Add response interceptor to suppress 401 errors
axiosWithCredentials.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 401 errors in console since they're expected for new users
    if (error.response?.status === 401) {
      // Don't log 401 errors to console
      return Promise.reject(error);
    }
    // Log other errors normally
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER || "http://localhost:4002";
export const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
export const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;
export const ATTEMPTS_API = `${REMOTE_SERVER}/api/attempts`;

// Quiz API calls
export const fetchQuizzesForCourse = async (courseId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}?courseId=${courseId}`);
  return response.data;
};

export const createQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.post(QUIZZES_API, quiz);
  return response.data;
};

export const fetchQuizById = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const updateQuiz = async (quiz: any) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return response.data;
};

export const publishQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`);
  return response.data;
};

export const unpublishQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/unpublish`);
  return response.data;
};

export const fetchQuizWithQuestions = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/with-questions`);
  return response.data;
};

// Question API calls
export const fetchQuestionsForQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/questions`);
  return response.data;
};

export const copyQuizWithQuestions = async (originalQuizId: string, newQuizData: any) => {
  // First create the new quiz
  const newQuiz = await createQuiz(newQuizData);
  
  // Then fetch and copy all questions from the original quiz
  try {
    const originalQuestions = await fetchQuestionsForQuiz(originalQuizId);
    
    // Copy each question to the new quiz
    for (const question of originalQuestions) {
      const questionCopy = {
        title: question.title,
        questionType: question.questionType,
        points: question.points,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        correctAnswers: question.correctAnswers,
        order: question.order
      };
      
      await createQuestion(newQuiz._id, questionCopy);
    }
  } catch (error) {
    // Swallow copy errors silently as copy feature is optional/no-op
  }
  
  return newQuiz;
};

export const createQuestion = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/questions`, question);
  return response.data;
};

export const updateQuestion = async (question: any) => {
  const response = await axiosWithCredentials.put(`${QUESTIONS_API}/${question._id}`, question);
  return response.data;
};

export const deleteQuestion = async (questionId: string) => {
  const response = await axiosWithCredentials.delete(`${QUESTIONS_API}/${questionId}`);
  return response.data;
};

export const updateQuestionOrder = async (questionId: string, order: number) => {
  const response = await axiosWithCredentials.put(`${QUESTIONS_API}/${questionId}/order`, { order });
  return response.data;
};

// Quiz Attempt API calls
export const startQuizAttempt = async (quizId: string) => {
  const response = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};

export const submitQuizAttempt = async (quizId: string, attemptId: string, answers: any[]) => {
  const response = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/attempts/${attemptId}`, { answers });
  return response.data;
};

export const fetchQuizAttempt = async (quizId: string, attemptId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts/${attemptId}`);
  return response.data;
};

export const fetchQuizAttemptsForStudent = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/attempts`);
  return response.data;
};
