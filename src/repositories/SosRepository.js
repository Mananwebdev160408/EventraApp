/**
 * SosRepository — Single Responsibility: Firestore CRUD for SOS alerts.
 */
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "sos";

export const SosRepository = {
  getAll: async () => {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id) => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  getByUserId: async (userId) => {
    const q = query(collection(db, COLLECTION), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getByEventId: async (eventId) => {
    const q = query(collection(db, COLLECTION), where("eventId", "==", eventId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getByStadiumId: async (stadiumId) => {
    const q = query(collection(db, COLLECTION), where("stadiumId", "==", stadiumId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Raise a new SOS alert. */
  raise: async (sosData) => {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...sosData,
      status: "active",
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  /** Mark an SOS alert as resolved. */
  resolve: async (id) => {
    await updateDoc(doc(db, COLLECTION, id), {
      status: "resolved",
      resolvedAt: serverTimestamp(),
    });
  },
};
