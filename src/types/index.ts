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

export interface Notification {
  id: number;
  title: string;
  message: string;
  link: string;
  status: string;
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
  courseTrainer: {
    id: number,
    trainerId: number,
    courseId: number,
    trainers_users: {
      username: string
    }
  },
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
    course: {
      id: number;
      courseName: string;
    }
  };
}

export interface Intake {
  id: number;
  intakeName: string;
  intakeYear: string;
}

export interface Trainer {
  id: number;
  username: string;
  email: string;
}

export interface ClassTime {
  id: number;
  classTime: string;
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
  role: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  acceptInvite: boolean;
  roleUsers: {
    id: number;
    roleName: string;
  }; // Add role object here
  trainer_courses: [
    {
      id: number;
      trainerId: number;
      courseId: number;
      course: {
        id: number;
        courseName: string;
      }
    }
  ]
}

export interface FeedbackQuestion {
  feedbackQuestion: string;
  id: number;
  questionText: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating';
  minRating?: number;
  maxRating?: number;
  required?: string;
}

export interface trainer_courses {
  id: number;
  trainerId: number;
  courseId: number;
  Course: {
    id: number;
    courseName: string;
  }
}
export interface FeedbackQuestionSelect {
  id: number;
  questionText: string;
  questionType: string;
  feedbackQuestion: {
    id: number;
    questionText: string;
    questionType: string;
    required: string;
    answerOption: [
      {
        description: string;
        id: number;
        optionText: string;
      }
    ];
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

export interface Button {
  label: string;
  type: string;
  onClick: () => void;
  buttonLoading?: boolean; // Add this property to make it valid
}

export interface UserSession {
  id: number;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}