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
  courseName:string;
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


