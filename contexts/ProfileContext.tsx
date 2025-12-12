"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

export interface UserProfile {
    id?: string;
    name: string;
    email: string;
    nickname?: string;
    phone?: string;
    birthdate?: string;
    photo?: string; // base64 or URL
    photoSource?: 'google' | 'upload';
}

interface ProfileContextType {
    profile: UserProfile | null;
    updateProfile: (data: Partial<UserProfile>) => void;
    clearProfile: () => void;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'rendeplus_user_profile';

export function ProfileProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load profile from localStorage on mount
    useEffect(() => {
        const loadProfile = () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setProfile(parsed);
                } else if (session?.user) {
                    // If no stored profile but has session, create from session
                    const sessionProfile: UserProfile = {
                        name: session.user.name || '',
                        email: session.user.email || '',
                        photo: session.user.image || undefined,
                        photoSource: 'google'
                    };
                    setProfile(sessionProfile);
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [session]);

    // Save profile to localStorage whenever it changes
    useEffect(() => {
        if (profile && !isLoading) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
            } catch (error) {
                console.error('Error saving profile:', error);
            }
        }
    }, [profile, isLoading]);

    const updateProfile = (data: Partial<UserProfile>) => {
        setProfile(prev => {
            if (!prev) {
                return {
                    name: data.name || '',
                    email: data.email || '',
                    ...data
                };
            }
            return { ...prev, ...data };
        });
    };

    const clearProfile = () => {
        setProfile(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <ProfileContext.Provider value={{ profile, updateProfile, clearProfile, isLoading }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
