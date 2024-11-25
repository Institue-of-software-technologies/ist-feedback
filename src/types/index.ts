export interface Role {
  id: number;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: number;
  permissionName: string;
}

export interface Course {
  id: number;
  courseName: string;
}

export interface Module {
  id: number;
  moduleName: string;
  courseId: string;
  course: {
    id: number;
    courseName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClassTime {
  id: number;
  classTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: number;
  trainerId: number;
  intakeId: number;
  classTimeId: number;
  moduleId: number;
  studentToken: string;
  tokenStartTime: string;
  tokenExpiration: string;
  trainer: {
    id: number;
    trainerName: string;
    email: string;
    course: {
      courseName: string;
    };
  };
  intake: {
    intakeYear: string;
    id: number;
    intakeName: string;
  };
  classTime: {
    id: number;
    classTime: string;
  };
  module: {
    id: number;
    moduleName: string;
  };
}

export interface Intake {
  id: number;
  intakeName: string;
  intakeYear: string;
}

export interface Trainer {
  id: number;
  trainerName: string;
  email: string;
}

export interface ClassTime {
  id: number;
  classTime: string;
  classTimeStart: string;
  classTimeEnd: string;
}

export interface Module {
  id: number;
  moduleName: string;
  courseId: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    roleName: string;
  }; // Add role object here
}

export interface FeedbackQuestion {
  feedbackQuestion: string;
  id: number;
  questionText: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating';
  minRating?: number;
  maxRating?: number;
}

export interface FeedbackQuestionSelect {
  id: number;
  questionText: string;
  questionType: string;
  feedbackQuestion: {
    id: number;
    questionText: string;
    questionType: string;
    answerOption: [
      {
        description: string;
        id: number;
        optionText: string;
      }
    ];
    ratingDescriptions?: {
      [key: number]: string;
    };
  };
}

export interface AnswerOptions {
  id: number;
  optionText: string;
  description?: string;
}

export interface Trainer {
  id: number;
  trainerName: string;
  courseId: string;
  course: {
    id: number;
    courseName: string;
  };
}

export interface RecentActivities {
  id: number;
  entityType: string;
  activityType: string;
  description: string;
}