/**
 * AuthRepository — Single Responsibility: Firebase Authentication operations only.
 *
 * Abstracts Firebase Auth SDK from the rest of the app (Dependency Inversion).
 * Screens and contexts depend on this interface, not on Firebase directly.
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const AuthRepository = {
  /**
   * Register a new user with email + password.
   * Also creates a Firestore user document with profile data.
   */
  register: async ({ email, password, firstName, lastName, username, phoneNumber, gender, role = "user" }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    // Update Firebase Auth display name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Create the user profile document in Firestore
    const userProfile = {
      uid: user.uid,
      email,
      firstName,
      lastName,
      username: username || email.split("@")[0],
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phoneNumber || "",
      gender: gender || "Other",
      role, // "user" or "admin"
      roles: [role],
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userProfile);
    return { user, userProfile };
  },

  /**
   * Sign in an existing user with email + password.
   * Fetches the Firestore profile and returns it alongside the Firebase user.
   */
  login: async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    const profileSnap = await getDoc(doc(db, "users", user.uid));
    const userProfile = profileSnap.exists()
      ? { uid: user.uid, ...profileSnap.data() }
      : { uid: user.uid, email: user.email, role: "user", roles: ["user"] };

    return { user, userProfile };
  },

  /**
   * Sign out the current user from Firebase Auth.
   */
  logout: async () => {
    await signOut(auth);
  },

  /**
   * Fetch the Firestore profile for a given Firebase UID.
   */
  getUserProfile: async (uid) => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? { uid, ...snap.data() } : null;
  },

  /**
   * Send a password reset email to the given address.
   */
  sendPasswordReset: async (email) => {
    await sendPasswordResetEmail(auth, email);
  },

  /** Returns the currently signed-in Firebase user or null. */
  getCurrentUser: () => auth.currentUser,
};
