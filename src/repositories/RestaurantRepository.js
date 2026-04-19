/**
 * RestaurantRepository — Single Responsibility: Firestore CRUD for the `restaurants` collection.
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

const COLLECTION = "restaurants";

export const RestaurantRepository = {
  getAll: async () => {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id) => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  getByStadiumId: async (stadiumId) => {
    const q = query(collection(db, COLLECTION), where("stadiumId", "==", stadiumId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  create: async (data) => {
    const ref = await addDoc(collection(db, COLLECTION), { ...data, createdAt: serverTimestamp() });
    return ref.id;
  },

  update: async (id, updates) => {
    await updateDoc(doc(db, COLLECTION, id), { ...updates, updatedAt: serverTimestamp() });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
  },
};
