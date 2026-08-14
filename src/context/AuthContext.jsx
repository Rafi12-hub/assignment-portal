import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Initial mock student user for Demo Mode
const DEMO_USER_KEY = 'student_portal_demo_user';
const defaultDemoUser = {
  uid: 'demo_student_123',
  email: 'alex.morgan@university.edu',
  displayName: 'Alex Morgan',
  studentId: 'ST-88902',
  major: 'Computer Science',
  isDemo: true
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Fetch additional profile info from Firestore if exists
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || userDoc.data().displayName || 'Student',
                studentId: userDoc.data().studentId || 'N/A',
                major: userDoc.data().major || 'General Studies',
                ...userDoc.data()
              });
            } else {
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Student'
              });
            }
          } catch (err) {
            console.error("Error fetching user profile:", err);
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Student'
            });
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Demo Mode check local storage
      const savedDemoUser = localStorage.getItem(DEMO_USER_KEY);
      if (savedDemoUser) {
        try {
          setCurrentUser(JSON.parse(savedDemoUser));
        } catch (e) {
          setCurrentUser(defaultDemoUser);
        }
      } else {
        // Auto-login demo user for immediate experience
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultDemoUser));
        setCurrentUser(defaultDemoUser);
      }
      setIsDemo(true);
      setLoading(false);
    }
  }, []);

  // Register function
  const signup = async (email, password, displayName, studentId = '', major = '') => {
    if (isFirebaseConfigured && auth) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Auth Profile
      await updateProfile(user, { displayName });

      // Save student extra details to Firestore users collection
      const userProfile = {
        uid: user.uid,
        email,
        displayName,
        studentId,
        major,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      setCurrentUser(userProfile);
      return userCredential;
    } else {
      // Demo mode signup
      const newUser = {
        uid: `demo_${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
        studentId: studentId || 'ST-DEMO',
        major: major || 'Computer Science',
        isDemo: true
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
      setCurrentUser(newUser);
      return { user: newUser };
    }
  };

  // Login function
  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      return signInWithEmailAndPassword(auth, email, password);
    } else {
      // Demo mode login
      const demoUser = {
        uid: 'demo_student_123',
        email: email || defaultDemoUser.email,
        displayName: email ? email.split('@')[0] : defaultDemoUser.displayName,
        studentId: defaultDemoUser.studentId,
        major: defaultDemoUser.major,
        isDemo: true
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      return { user: demoUser };
    }
  };

  // Logout function
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      return firebaseSignOut(auth);
    } else {
      localStorage.removeItem(DEMO_USER_KEY);
      setCurrentUser(null);
    }
  };

  // Quick Demo Login helper
  const loginAsDemo = () => {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(defaultDemoUser));
    setCurrentUser(defaultDemoUser);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loginAsDemo,
    loading,
    isDemoMode: isDemo || !isFirebaseConfigured,
    isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
