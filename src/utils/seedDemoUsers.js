import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const DEMO_CREDENTIALS = [
  {
    role: "Fan",
    roleKey: "user",
    email: "demo.fan@eventra.app",
    password: "Fan@1234",
    firstName: "Demo",
    lastName: "Fan",
    username: "demo_fan",
    phoneNumber: "+91 9000000001",
    gender: "Other",
    description: "Browse events, buy tickets & order food",
    color: "#457b9d",
    icon: "🎟️",
  },
  {
    role: "Admin",
    roleKey: "admin",
    email: "demo.admin@eventra.app",
    password: "Admin@1234",
    firstName: "Demo",
    lastName: "Admin",
    username: "demo_admin",
    phoneNumber: "+91 9000000002",
    gender: "Other",
    description: "Manage stadium, events & analytics",
    color: "#e63946",
    icon: "🏟️",
  },
];

/**
 * Ensure a single demo user exists. Tries sign-in first; if the account
 * doesn't exist it creates it. Either way, makes sure the Firestore
 * profile document is present.
 */
const ensureDemoUser = async (cred) => {
  let uid = null;

  try {
    // Try to sign in first (account already exists)
    const existing = await signInWithEmailAndPassword(auth, cred.email, cred.password);
    uid = existing.user.uid;
  } catch (signInError) {
    if (
      signInError.code === "auth/user-not-found" ||
      signInError.code === "auth/invalid-credential" ||
      signInError.code === "auth/invalid-email"
    ) {
      // Account doesn't exist — create it
      try {
        const created = await createUserWithEmailAndPassword(auth, cred.email, cred.password);
        uid = created.user.uid;
        await updateProfile(created.user, {
          displayName: `${cred.firstName} ${cred.lastName}`,
        });
      } catch (createError) {
        // Another process may have created it concurrently — that's fine
        console.warn(`seedDemoUsers: Could not create ${cred.role}:`, createError.code);
        return;
      }
    } else {
      // Wrong password or other transient error — don't throw, just warn
      console.warn(`seedDemoUsers: Sign-in check failed for ${cred.role}:`, signInError.code);
      return;
    }
  }

  if (!uid) return;

  // Ensure the Firestore profile document exists
  const profileRef = doc(db, "users", uid);
  const snap = await getDoc(profileRef);
  if (!snap.exists()) {
    await setDoc(profileRef, {
      uid,
      email: cred.email,
      firstName: cred.firstName,
      lastName: cred.lastName,
      displayName: `${cred.firstName} ${cred.lastName}`,
      username: cred.username,
      phoneNumber: cred.phoneNumber,
      gender: cred.gender,
      role: cred.roleKey,
      roles: [cred.roleKey],
      isDemo: true,
      createdAt: serverTimestamp(),
    });
  }
};

/**
 * Seed all demo accounts. Call this once on AuthLandingScreen mount.
 * Signs out any auto-signed-in user at the end so the landing screen is clean.
 */
export const seedDemoUsers = async () => {
  try {
    for (const cred of DEMO_CREDENTIALS) {
      await ensureDemoUser(cred);
    }
    // Sign out — we only signed in to verify/create the accounts
    await auth.signOut();
  } catch (err) {
    // Seeding is best-effort; never break the app if it fails
    console.warn("seedDemoUsers: Unexpected error", err);
  }
};
