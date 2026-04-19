/**
 * FeedbackRepository — Single Responsibility: Firestore CRUD for user feedback.
 */
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "feedback";

export const FeedbackRepository = {
  getByEventId: async (eventId) => {
    const q = query(collection(db, COLLECTION), where("eventId", "==", eventId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  getByUserId: async (userId) => {
    const q = query(collection(db, COLLECTION), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  post: async (feedbackData) => {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...feedbackData,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },
};
