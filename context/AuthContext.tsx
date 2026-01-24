'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';
import { userService } from '@/lib/firestore';
import { User, LoginCredentials } from '@/lib/types';
import logger from '@/lib/services/logger';

// TODO: Port these services
// import integrationService from '../services/integrationService';
// import dailyActivityService from '../services/dailyActivityService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<void>;
    handleGoogleSignIn: () => Promise<void>;
    isGoogleClientConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Use Firebase Auth user with full metadata
                const userData: User = {
                    id: firebaseUser.uid,
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    picture: firebaseUser.photoURL || undefined,
                    photoURL: firebaseUser.photoURL,
                    isGoogleUser: firebaseUser.providerData.some(p => p.providerId === 'google.com'),
                    metadata: firebaseUser.metadata,
                    providerData: firebaseUser.providerData as any[],
                };
                setUser(userData);

                // TODO: Port daily activity tracking
                // dailyActivityService.trackDailyActivity(userData.id);

                // TODO: Port robust sync
                /*
                if (userData && userData.id) {
                  userService.robustSyncUserData(userData.id)
                    .then(() => logger.info('Robust user data sync complete'))
                    .catch(error => logger.error('Robust user data sync failed:', error));
                }
                */
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async ({ email, password }: LoginCredentials) => {
        if (!password) throw new Error("Password is required for email login");
        await signInWithEmailAndPassword(auth, email, password);
        // User update handled by onAuthStateChanged

        const user = auth.currentUser;
        if (user) {
          const userDoc = await userService.getUserDoc(user.uid);
          if (!userDoc) {
            await userService.initializeUserData(
              user.uid, 
              user.email || email,
              user.displayName || undefined
            );
          }
        }
    };

    const signup = async (email: string, password: string, name?: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user && name) {
            // @ts-ignore
            await userCredential.user.updateProfile({ displayName: name });
        }

        if (userCredential.user) {
          await userService.initializeUserData(
            userCredential.user.uid,
            userCredential.user.email || email,
            name || userCredential.user.displayName || undefined
          );
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            // Cleanup local data
            localStorage.removeItem('justgoals-settings');
            localStorage.removeItem('drift-welcome-seen');
            setUser(null);
            logger.info("User logged out successfully");
        } catch (error) {
            logger.error("Logout failed:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        
        if (result.user) {
          const userDoc = await userService.getUserDoc(result.user.uid);
          if (!userDoc) {
            await userService.initializeUserData(
              result.user.uid,
              result.user.email || '',
              result.user.displayName || undefined
            );
          }
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        signup,
        handleGoogleSignIn,
        isGoogleClientConfigured: true,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
