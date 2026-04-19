/**
 * MerchandiseRepository — Single Responsibility: Firestore CRUD for merchandise items and orders.
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

const MERCH_COL = "merchandise";
const ORDER_COL = "merchandiseOrders";

export const MerchandiseRepository = {
  // ── Merchandise Items ─────────────────────────────────────────

  getAll: async () => {
    const snap = await getDocs(collection(db, MERCH_COL));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id) => {
    const snap = await getDoc(doc(db, MERCH_COL, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  getByStadiumId: async (stadiumId) => {
    const q = query(collection(db, MERCH_COL), where("stadiumId", "==", stadiumId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  create: async (merchData) => {
    const ref = await addDoc(collection(db, MERCH_COL), { ...merchData, createdAt: serverTimestamp() });
    return ref.id;
  },

  update: async (id, updates) => {
    await updateDoc(doc(db, MERCH_COL, id), { ...updates, updatedAt: serverTimestamp() });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, MERCH_COL, id));
  },

  // ── Merchandise Orders ─────────────────────────────────────────

  getAllOrders: async () => {
    const snap = await getDocs(collection(db, ORDER_COL));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getOrderById: async (id) => {
    const snap = await getDoc(doc(db, ORDER_COL, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  getOrdersByUserId: async (userId) => {
    const q = query(collection(db, ORDER_COL), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getOrdersByStadiumId: async (stadiumId) => {
    const q = query(collection(db, ORDER_COL), where("stadiumId", "==", stadiumId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  placeOrder: async (orderData) => {
    const ref = await addDoc(collection(db, ORDER_COL), {
      ...orderData,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },
};
