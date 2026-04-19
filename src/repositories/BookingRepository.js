/**
 * BookingRepository — Single Responsibility: Firestore CRUD for the `bookings` collection.
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
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/config";

const BOOKING_COL = "bookings";
const SEAT_COL = "seats";

export const BookingRepository = {
  /** Fetch all bookings (admin view). */
  getAll: async () => {
    const snap = await getDocs(collection(db, BOOKING_COL));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Fetch a single booking by ID. */
  getById: async (id) => {
    const snap = await getDoc(doc(db, BOOKING_COL, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  /** Fetch all bookings for a specific user. */
  getByUserId: async (userId) => {
    const q = query(collection(db, BOOKING_COL), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Fetch all bookings for a specific event. */
  getByEventId: async (eventId) => {
    const q = query(collection(db, BOOKING_COL), where("eventId", "==", eventId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /** Fetch all bookings for a stadium. */
  getByStadiumId: async (stadiumId) => {
    const q = query(collection(db, BOOKING_COL), where("stadiumId", "==", stadiumId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  /**
   * Reserve + confirm a booking atomically via a Firestore transaction.
   * Marks the selected seats as unavailable and creates the booking document.
   */
  confirmBooking: async ({ userId, eventId, stadiumId, seats }) => {
    let bookingId = null;
    await runTransaction(db, async (transaction) => {
      // 1. Verify each seat is still available
      for (const seat of seats) {
        const seatRef = doc(db, SEAT_COL, seat.id);
        const seatSnap = await transaction.get(seatRef);
        if (!seatSnap.exists() || seatSnap.data().isAvailable === false) {
          throw new Error(`Seat ${seat.id} is no longer available.`);
        }
      }

      // 2. Mark each seat as booked
      for (const seat of seats) {
        transaction.update(doc(db, SEAT_COL, seat.id), { isAvailable: false });
      }

      // 3. Create the booking document
      const bookingRef = doc(collection(db, BOOKING_COL));
      bookingId = bookingRef.id;
      transaction.set(bookingRef, {
        userId,
        eventId,
        stadiumId,
        seats,
        status: "confirmed",
        totalAmount: seats.reduce((sum, s) => sum + (s.price || 0), 0),
        createdAt: serverTimestamp(),
      });
    });
    return bookingId;
  },
};
