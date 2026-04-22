import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api';
import { firebaseAuth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { clearAccessToken, setAccessToken } from '../lib/session';

const AuthContext = createContext(null);

async function syncBackendProfile(payload = {}) {
  const response = await apiRequest('/auth/sync', {
    method: 'POST',
    data: payload,
  });

  return response.user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState(isFirebaseConfigured ? 'firebase' : 'demo');

  useEffect(() => {
    let isMounted = true;

    if (!isFirebaseConfigured || !firebaseAuth) {
      const bootstrapDemoProfile = async () => {
        try {
          if (!import.meta.env.VITE_DEV_AUTH_EMAIL) {
            return;
          }

          const nextProfile = await syncBackendProfile({
            name: 'Sayan Trendz Demo',
            preferences: {},
          });

          if (!isMounted) {
            return;
          }

          setUser({
            uid: 'demo-user',
            email: nextProfile.email,
            displayName: nextProfile.name,
          });
          setProfile(nextProfile);
          setAuthMode('demo');
        } catch (error) {
          console.warn('Demo auth bootstrap skipped:', error.message);
        } finally {
          if (isMounted) {
            setAuthLoading(false);
          }
        }
      };

      bootstrapDemoProfile();

      return () => {
        isMounted = false;
      };
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      try {
        if (!nextUser) {
          clearAccessToken();
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setAuthLoading(false);
          }
          return;
        }

        const token = await nextUser.getIdToken();
        setAccessToken(token);

        const nextProfile = await syncBackendProfile({
          name: nextUser.displayName,
          phone: nextUser.phoneNumber,
          avatar: nextUser.photoURL,
        });

        if (!isMounted) {
          return;
        }

        setUser(nextUser);
        setProfile(nextProfile);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const loginWithEmail = async ({ email, password }) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const nextProfile = await syncBackendProfile({ name: email.split('@')[0] });
      setUser({ uid: 'demo-user', email, displayName: nextProfile.name });
      setProfile(nextProfile);
      return nextProfile;
    }

    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return result.user;
  };

  const registerWithEmail = async ({ name, email, password }) => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      const nextProfile = await syncBackendProfile({ name });
      setUser({ uid: 'demo-user', email, displayName: name });
      setProfile(nextProfile);
      return nextProfile;
    }

    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await updateProfile(result.user, { displayName: name });
    return result.user;
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured || !firebaseAuth || !googleProvider) {
      return loginWithEmail({
        email: import.meta.env.VITE_DEV_AUTH_EMAIL || 'demo@sayantrendz.com',
        password: 'demo-password',
      });
    }

    const result = await signInWithPopup(firebaseAuth, googleProvider);
    return result.user;
  };

  const signOutUser = async () => {
    clearAccessToken();

    if (isFirebaseConfigured && firebaseAuth) {
      await signOut(firebaseAuth);
    }

    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    const response = await apiRequest('/auth/me');
    setProfile(response.user);
    return response.user;
  };

  const updateCurrentUser = async (payload) => {
    const response = await apiRequest('/auth/me', {
      method: 'PATCH',
      data: payload,
    });

    setProfile(response.user);
    return response.user;
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      authLoading,
      authMode,
      isFirebaseConfigured,
      isAuthenticated: Boolean(profile),
      isAdmin: profile?.role === 'admin',
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      signOutUser,
      refreshProfile,
      updateCurrentUser,
    }),
    [authLoading, authMode, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
