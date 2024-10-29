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
    id: number,
    courseName: string
  }
  createdAt: string;
  updatedAt: string;
}

export interface ClassTime{
  id: number;
  classTime:string;
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
  tokenExpiration: string;
  trainer: {
    id: number;
    trainerName: string;
  };
  intake: {
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
  trainerName:string;
}

export interface ClassTime {
  id: number;
  classTime:string;
}

export interface Module {
  id: number;
  moduleName:string;
  courseId:string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  role: Role; // Add role object here
}
export interface FeedbackQuestion {
  id: number;
  questionText: string;
  questionType: 'open-ended' | 'closed-ended' | 'rating';
}

export interface AnswerOptions {
  id: number;
  optionText: string;
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