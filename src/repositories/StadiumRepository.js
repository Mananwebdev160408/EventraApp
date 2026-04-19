/**
 * StadiumRepository — Single Responsibility: Firestore CRUD for the `stadiums` collection.
 */
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "stadiums";

export const StadiumRepository = {
  /** Fetch all stadiums. */
  getAll: async () => {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Fetch a single stadium by ID. */
  getById: async (id) => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  /** Fetch the stadium managed by a specific admin UID. */
  getByAdminUid: async (adminUid) => {
    const q = query(collection(db, COLLECTION), where("adminUid", "==", adminUid));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  /** Create a new stadium. Returns the new document ID. */
  create: async (stadiumData) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...stadiumData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  /** Update stadium fields. */
  update: async (id, updates) => {
    await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
  },

  /** Delete a stadium document. */
  delete: async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
