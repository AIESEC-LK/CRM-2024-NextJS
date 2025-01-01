"use client";
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

// Define types for the user object and context value
interface User {
    email: string;
    role: 'member' | 'admin';
    lcId: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
    hasRole: (role: 'member' | 'admin') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component with types for props
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUserByEmail = async (email: string): Promise<User | null> => {
        try {
            const response = await fetch(`/api_new/user/get_user_by_email?email=${email}`);
            if (!response.ok) {
                console.error("Error fetching user by email:", response.statusText);
                return null;
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error("Error fetching user by email:", error);
            return null;
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (userData: User) => {
        const fetchedUser = await fetchUserByEmail(userData.email);
        if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem('user', JSON.stringify(fetchedUser));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const isAuthenticated = (): boolean => user !== null;

    const hasRole = (role: 'member' | 'admin'): boolean => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook for accessing the context
export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
