"use client";
// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    permissions: string[];
    trainers: string;

}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // the typeof window is a check done to make sure that the code is running on the clinet so
        //  as to access the localStorage sessionStorage in the client 
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem("userRolesPermissions");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      }, []);

    return (
        <UserContext.Provider value={{ user, setUser, }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error("use context not found");
    }
    return context;
  }
