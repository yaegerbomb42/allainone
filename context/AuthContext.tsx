'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, User } from 'firebase/auth';

// TODO: Port these services
// import firestoreService from '../services/firestoreService';
// import integrationService from '../services/integrationService';
// import dailyActivityService from '../services/dailyActivityService';

interface AuthContextType {
    user: any | null; // Using any for now to match refined user object structure
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<void>;
    handleGoogleSignIn: () => Promise<void>;
    isGoogleClientConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Use Firebase Auth user with full metadata
                const userData = {
                    id: firebaseUser.uid,
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    picture: firebaseUser.photoURL || undefined,
                    photoURL: firebaseUser.photoURL,
                    isGoogleUser: firebaseUser.providerData.some(p => p.providerId === 'google.com'),
                    metadata: firebaseUser.metadata,
                    providerData: firebaseUser.providerData,
                };
                setUser(userData);

                // TODO: Port daily activity tracking
                // dailyActivityService.trackDailyActivity(userData.id);

                // TODO: Port robust sync
                /*
                if (userData && userData.id) {
                  firestoreService.robustSyncUserData(userData.id)
                    .then(() => console.log('Robust user data sync complete'))
                    .catch(error => console.error('Robust user data sync failed:', error));
                }
                */
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async ({ email, password }: any) => {
        await signInWithEmailAndPassword(auth, email, password);
        // User update handled by onAuthStateChanged

        // TODO: Port user initialization
        /*
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firestoreService.getUserDoc(user.uid);
          if (!userDoc) {
            await firestoreService.initializeUserData(user.uid);
          }
        }
        */
    };

    const signup = async (email: string, password: string, name?: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user && name) {
            // @ts-ignore
            await userCredential.user.updateProfile({ displayName: name });
        }

        // TODO: Port user initialization
        /*
        if (userCredential.user) {
          await firestoreService.initializeUserData(userCredential.user.uid);
        }
        */
    };

    const logout = async () => {
        await signOut(auth);
        // TODO: Cleanup services
        // integrationService.cleanup();
        setUser(null);
    };

    const handleGoogleSignIn = async () => {
        await signInWithPopup(auth, googleProvider);
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
