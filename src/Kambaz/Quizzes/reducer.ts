import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as client from "./client";

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  courseId: string;
  quizType: 'Graded Quiz' | 'Practice Quiz' | 'Graded Survey' | 'Ungraded Survey';
  points: number;
  assignmentGroup: 'Quizzes' | 'Exams' | 'Assignments' | 'Project';
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  maxAttempts: number;
  showCorrectAnswers: boolean;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  _id: string;
  quizId: string;
  title: string;
  questionType: 'multiple-choice' | 'true-false' | 'fill-blank';
  points: number;
  questionText: string;
  options?: Array<{ text: string; isCorrect: boolean }>;
  correctAnswer?: boolean | string;
  correctAnswers?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  _id: string;
  quizId: string;
  studentId: string;
  attemptNumber: number;
  startTime: string;
  endTime?: string;
  score: number;
  maxScore: number;
  answers: Array<{
    questionId: string;
    answer: any;
    isCorrect: boolean;
    points: number;
  }>;
  completed: boolean;
  createdAt: string;
}

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  questions: Question[];
  currentAttempt: QuizAttempt | null;
  attempts: QuizAttempt[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  questions: [],
  currentAttempt: null,
  attempts: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchQuizzesForCourse = createAsyncThunk(
  'quizzes/fetchQuizzesForCourse',
  async (courseId: string) => {
    return await client.fetchQuizzesForCourse(courseId);
  }
);

export const createQuizAsync = createAsyncThunk(
  'quizzes/createQuiz',
  async (quiz: Partial<Quiz>) => {
    return await client.createQuiz(quiz);
  }
);

export const updateQuizAsync = createAsyncThunk(
  'quizzes/updateQuiz',
  async (quiz: Quiz) => {
    return await client.updateQuiz(quiz);
  }
);

export const deleteQuizAsync = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (quizId: string) => {
    await client.deleteQuiz(quizId);
    return quizId;
  }
);

export const publishQuizAsync = createAsyncThunk(
  'quizzes/publishQuiz',
  async (quizId: string) => {
    return await client.publishQuiz(quizId);
  }
);

export const unpublishQuizAsync = createAsyncThunk(
  'quizzes/unpublishQuiz',
  async (quizId: string) => {
    return await client.unpublishQuiz(quizId);
  }
);

export const fetchQuizWithQuestionsAsync = createAsyncThunk(
  'quizzes/fetchQuizWithQuestions',
  async (quizId: string) => {
    return await client.fetchQuizWithQuestions(quizId);
  }
);

export const createQuestionAsync = createAsyncThunk(
  'quizzes/createQuestion',
  async ({ quizId, question }: { quizId: string; question: Partial<Question> }) => {
    return await client.createQuestion(quizId, question);
  }
);

export const updateQuestionAsync = createAsyncThunk(
  'quizzes/updateQuestion',
  async (question: Question) => {
    return await client.updateQuestion(question);
  }
);

export const deleteQuestionAsync = createAsyncThunk(
  'quizzes/deleteQuestion',
  async (questionId: string) => {
    await client.deleteQuestion(questionId);
    return questionId;
  }
);

export const startQuizAttemptAsync = createAsyncThunk(
  'quizzes/startQuizAttempt',
  async (quizId: string) => {
    return await client.startQuizAttempt(quizId);
  }
);

export const submitQuizAttemptAsync = createAsyncThunk(
  'quizzes/submitQuizAttempt',
  async ({ quizId, attemptId, answers }: { quizId: string; attemptId: string; answers: any[] }) => {
    return await client.submitQuizAttempt(quizId, attemptId, answers);
  }
);

const quizSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.currentQuiz = action.payload;
    },
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setCurrentAttempt: (state, action: PayloadAction<QuizAttempt | null>) => {
      state.currentAttempt = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch quizzes for course
    builder
      .addCase(fetchQuizzesForCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzesForCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzesForCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      });

    // Create quiz
    builder
      .addCase(createQuizAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuizAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes.push(action.payload);
      })
      .addCase(createQuizAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create quiz';
      });

    // Update quiz
    builder
      .addCase(updateQuizAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuizAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quizzes.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        if (state.currentQuiz?._id === action.payload._id) {
          state.currentQuiz = action.payload;
        }
      })
      .addCase(updateQuizAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update quiz';
      });

    // Delete quiz
    builder
      .addCase(deleteQuizAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuizAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = state.quizzes.filter(q => q._id !== action.payload);
        if (state.currentQuiz?._id === action.payload) {
          state.currentQuiz = null;
        }
      })
      .addCase(deleteQuizAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete quiz';
      });

    // Publish/Unpublish quiz
    builder
      .addCase(publishQuizAsync.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        if (state.currentQuiz?._id === action.payload._id) {
          state.currentQuiz = action.payload;
        }
      })
      .addCase(unpublishQuizAsync.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
        if (state.currentQuiz?._id === action.payload._id) {
          state.currentQuiz = action.payload;
        }
      });

    // Fetch quiz with questions
    builder
      .addCase(fetchQuizWithQuestionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizWithQuestionsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
        state.questions = action.payload.questions || [];
      })
      .addCase(fetchQuizWithQuestionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quiz with questions';
      });

    // Create question
    builder
      .addCase(createQuestionAsync.fulfilled, (state, action) => {
        state.questions.push(action.payload);
      });

    // Update question
    builder
      .addCase(updateQuestionAsync.fulfilled, (state, action) => {
        const index = state.questions.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      });

    // Delete question
    builder
      .addCase(deleteQuestionAsync.fulfilled, (state, action) => {
        state.questions = state.questions.filter(q => q._id !== action.payload);
      });

    // Start quiz attempt
    builder
      .addCase(startQuizAttemptAsync.fulfilled, (state, action) => {
        state.currentAttempt = action.payload;
      });

    // Submit quiz attempt
    builder
      .addCase(submitQuizAttemptAsync.fulfilled, (state, action) => {
        state.currentAttempt = action.payload;
        state.attempts.push(action.payload);
      });
  },
});

export const { setCurrentQuiz, setQuestions, setCurrentAttempt, clearError } = quizSlice.actions;
export default quizSlice.reducer;
