"use client";
// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../../lib/axios'; // Ensure api is correctly configured
import axios from 'axios';

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

// Initialize UserContext with undefined to ensure it is used within a provider
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Fetch user session data and set it in the context
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await api.get('/auth/session'); // Axios handles JSON parsing
                setUser(response.data.session.user || null); // Use response.data to access the payload
            } catch (error) {
              console.error("Error during login: ", error);
              if (axios.isAxiosError(error)) {
               console.log(error.response?.data?.message || "An error occurred during login.");
              } else {
                console.log("An unexpected error occurred.");
              }
            }
        };

        fetchSession();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
