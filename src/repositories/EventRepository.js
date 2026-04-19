/**
 * EventRepository — Single Responsibility: Firestore CRUD for the `events` collection.
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
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "events";

export const EventRepository = {
  /** Fetch all events (optionally paginated via Firestore queries). */
  getAll: async () => {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Fetch a single event by Firestore document ID. */
  getById: async (id) => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  /** Create a new event document. Returns the new document ID. */
  create: async (eventData) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...eventData,
      status: "draft",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  /** Update an existing event document. */
  update: async (id, updates) => {
    await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
  },

  /** Set event status to "live". */
  goLive: async (id) => {
    await updateDoc(doc(db, COLLECTION, id), { status: "live", updatedAt: serverTimestamp() });
  },

  /** Set event status to "offline". */
  takeDown: async (id) => {
    await updateDoc(doc(db, COLLECTION, id), { status: "offline", updatedAt: serverTimestamp() });
  },

  /** Delete an event document. */
  delete: async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
