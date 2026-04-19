/**
 * SeatRepository — Single Responsibility: Firestore CRUD for the `seats` collection.
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
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "seats";

export const SeatRepository = {
  /** Fetch all seats for an event. */
  getByEventId: async (eventId) => {
    const q = query(collection(db, COLLECTION), where("eventId", "==", eventId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Fetch only available seats for an event. */
  getAvailableByEventId: async (eventId) => {
    const q = query(
      collection(db, COLLECTION),
      where("eventId", "==", eventId),
      where("isAvailable", "==", true),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Bulk-create seats for an event using a batched write. */
  bulkCreate: async (eventId, seatsData) => {
    const batch = writeBatch(db);
    const refs = [];
    seatsData.forEach((seat) => {
      const ref = doc(collection(db, COLLECTION));
      refs.push(ref.id);
      batch.set(ref, { ...seat, eventId, isAvailable: true, createdAt: serverTimestamp() });
    });
    await batch.commit();
    return refs;
  },

  /** Fetch a single seat by ID. */
  getById: async (id) => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  /** Update a seat's availability or other fields. */
  update: async (id, updates) => {
    await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
  },

  /** Delete a seat document. */
  delete: async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
