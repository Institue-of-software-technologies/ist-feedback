import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the 'id' field here
      username?: string;
      email?: string;
      role?: string;
      permissions?: string[];
    };
  }

  interface User {
    id: string; // Add the 'id' field here
    username?: string;
    email?: string;
    role?: string;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add the 'id' field to the JWT as well
    username?: string;
    role?: string;
    permissions?: string[];
  }
}
