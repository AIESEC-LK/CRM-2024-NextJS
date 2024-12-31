"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for the confirmation context
type ConfirmationContextType = {
    triggerConfirmation: (message: string, onConfirmCallback: () => void) => void;
};

// Define the type for the modal state
type ConfirmationState = {
    isOpen: boolean;
    message: string;
    onConfirm: (() => void) | null;
};

// Provide a default value for the context
const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const useConfirmation = (): ConfirmationContextType => {
    const context = useContext(ConfirmationContext);
    if (!context) {
        throw new Error("useConfirmation must be used within a ConfirmationProvider");
    }
    return context;
};

export const ConfirmationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<ConfirmationState>({
        isOpen: false,
        message: "",
        onConfirm: null,
    });

    const triggerConfirmation = (message: string, onConfirmCallback: () => void) => {
        setModalState({
            isOpen: true,
            message,
            onConfirm: onConfirmCallback,
        });
    };

    const handleConfirm = () => {
        if (modalState.onConfirm) {
            modalState.onConfirm();
        }
        setModalState({ isOpen: false, message: "", onConfirm: null });
    };

    const handleCancel = () => {
        setModalState({ isOpen: false, message: "", onConfirm: null });
    };

    return (
        <ConfirmationContext.Provider value={{ triggerConfirmation }}>
            {children}

            {modalState.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                        <h2 className="text-lg font-bold mb-4">
                            {modalState.message}?
                        </h2>
                        <div className="flex justify-end space-x-2">
                            <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Yes</button>
                            <button onClick={handleCancel} className="px-4 py-2 border rounded hover:bg-gray-200">No</button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmationContext.Provider>
    );
};