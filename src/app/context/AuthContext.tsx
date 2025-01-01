"use client";
import React, { createContext, useState, useEffect, ReactNode } from 'react';

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

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
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
