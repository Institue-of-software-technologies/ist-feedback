export interface Role {
  id: number;
  roleName: string;
  createdAt: string;
  updatedAt: string;
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


