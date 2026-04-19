/**
 * FoodRepository — Single Responsibility: Firestore CRUD for food items and food orders.
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

const FOOD_COL = "foodItems";
const ORDER_COL = "foodOrders";

export const FoodRepository = {
  // ── Food Items ──────────────────────────────────────────────

  getAll: async () => {
    const snap = await getDocs(collection(db, FOOD_COL));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getById: async (id) => {
    const snap = await getDoc(doc(db, FOOD_COL, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  getByRestaurantId: async (restaurantId) => {
    const q = query(collection(db, FOOD_COL), where("restaurantId", "==", restaurantId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  create: async (foodData) => {
    const ref = await addDoc(collection(db, FOOD_COL), { ...foodData, createdAt: serverTimestamp() });
    return ref.id;
  },

  update: async (id, updates) => {
    await updateDoc(doc(db, FOOD_COL, id), { ...updates, updatedAt: serverTimestamp() });
  },

  delete: async (id) => {
    await deleteDoc(doc(db, FOOD_COL, id));
  },

  // ── Food Orders ──────────────────────────────────────────────

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

  getOrdersByEventId: async (eventId) => {
    const q = query(collection(db, ORDER_COL), where("eventId", "==", eventId));
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
