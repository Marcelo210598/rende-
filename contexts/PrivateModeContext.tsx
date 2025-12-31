"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface PrivateModeContextType {
    isPrivateMode: boolean;
    togglePrivateMode: () => void;
    setPrivateMode: (value: boolean) => void;
}

const PrivateModeContext = createContext<PrivateModeContextType | undefined>(undefined);

export function PrivateModeProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [isPrivateMode, setIsPrivateMode] = useState(false);

    // Sync with server when session changes
    useEffect(() => {
        const fetchPrivateMode = async () => {
            if (session?.user) {
                try {
                    const response = await fetch('/api/user');
                    if (response.ok) {
                        const user = await response.json();
                        setIsPrivateMode(user.discreteMode || false);
                    }
                } catch (error) {
                    console.error('Error fetching private mode:', error);
                }
            }
        };
        fetchPrivateMode();
    }, [session]);

    const togglePrivateMode = async () => {
        const newValue = !isPrivateMode;
        setIsPrivateMode(newValue);

        // Update in database
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ discreteMode: newValue }),
            });
        } catch (error) {
            console.error('Error updating private mode:', error);
            setIsPrivateMode(!newValue); // Revert on error
        }
    };

    const setPrivateMode = async (value: boolean) => {
        setIsPrivateMode(value);
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ discreteMode: value }),
            });
        } catch (error) {
            console.error('Error updating private mode:', error);
        }
    };

    return (
        <PrivateModeContext.Provider value={{ isPrivateMode, togglePrivateMode, setPrivateMode }}>
            {children}
        </PrivateModeContext.Provider>
    );
}

export function usePrivateMode() {
    const context = useContext(PrivateModeContext);
    if (context === undefined) {
        throw new Error("usePrivateMode must be used within a PrivateModeProvider");
    }
    return context;
}
