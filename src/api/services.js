/**
 * services.js — Business Logic / Service Layer
 *
 * This file maintains the EXACT same export surface as the old REST-based services.js
 * so that all screens continue to work without modification (Open/Closed Principle).
 *
 * Internally, each service delegates to the appropriate Repository, which is the
 * only place that knows about Firebase (Dependency Inversion Principle).
 */

import { AuthRepository } from "../repositories/AuthRepository";
import { EventRepository } from "../repositories/EventRepository";
import { SeatRepository } from "../repositories/SeatRepository";
import { BookingRepository } from "../repositories/BookingRepository";
import { FoodRepository } from "../repositories/FoodRepository";
import { MerchandiseRepository } from "../repositories/MerchandiseRepository";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { SosRepository } from "../repositories/SosRepository";
import { FeedbackRepository } from "../repositories/FeedbackRepository";
import { StadiumRepository } from "../repositories/StadiumRepository";

// ── Auth Service ──────────────────────────────────────────────────────────────
export const authService = {
  /** Login with email + password (Firebase Auth). */
  login: (credentials) => AuthRepository.login(credentials),
  /** Register a new user (Firebase Auth + Firestore profile). */
  register: (userData) => AuthRepository.register(userData),
  /** Fetch the current user's Firestore profile. */
  getCurrentUser: () => {
    const user = AuthRepository.getCurrentUser();
    if (!user) return Promise.resolve(null);
    return AuthRepository.getUserProfile(user.uid);
  },
  /** Send a password reset email. */
  sendPasswordReset: (email) => AuthRepository.sendPasswordReset(email),
};

// ── User Service ──────────────────────────────────────────────────────────────
export const userService = {
  /** Update a user's Firestore profile fields. */
  updateUser: (userId, userData) => {
    const { doc, updateDoc, serverTimestamp } = require("firebase/firestore");
    const { db } = require("../firebase/config");
    return updateDoc(doc(db, "users", userId), { ...userData, updatedAt: serverTimestamp() });
  },
};

// ── Event Service ─────────────────────────────────────────────────────────────
export const eventService = {
  getEvents: () => EventRepository.getAll().then((events) => ({ content: events })),
  getEventDetails: (eventId) => EventRepository.getById(eventId),
  createEvent: (eventData) => EventRepository.create(eventData),
  goEventLive: (eventId) => EventRepository.goLive(eventId),
  goEventDown: (eventId) => EventRepository.takeDown(eventId),
};

// ── Seat Service ──────────────────────────────────────────────────────────────
export const seatService = {
  getEventSeats: (eventId) => SeatRepository.getByEventId(eventId),
  getAvailableSeats: (eventId) => SeatRepository.getAvailableByEventId(eventId),
  bulkCreateSeats: (eventId, seatsData) => SeatRepository.bulkCreate(eventId, seatsData),
  getEventSeatById: (id) => SeatRepository.getById(id),
  updateEventSeat: (id, data) => SeatRepository.update(id, data),
  updateEventSeatAvailability: (id, isAvailable) => SeatRepository.update(id, { isAvailable }),
  deleteEventSeat: (id) => SeatRepository.delete(id),
  getAllEventSeats: async () => {
    // Not commonly needed; returning empty array to keep API surface intact
    return [];
  },
};

// ── Booking Service ───────────────────────────────────────────────────────────
export const bookingService = {
  /** Reserve seats — delegates to atomic Firestore transaction. */
  reserveSeats: (bookingData) => BookingRepository.confirmBooking(bookingData),
  /** Confirm booking (same as reserve in Firebase — transaction ensures atomicity). */
  confirmBooking: (bookingData) => BookingRepository.confirmBooking(bookingData),
  getUserBookings: (userId) => BookingRepository.getByUserId(userId),
  // Backward-compatible alias used by some screens.
  getBookingByUserId: (userId) => BookingRepository.getByUserId(userId),
  getBookingsByEvent: (eventId) => BookingRepository.getByEventId(eventId),
  getAllBookings: () => BookingRepository.getAll(),
  getBookingById: (id) => BookingRepository.getById(id),
  getBookingsByStadium: (stadiumId) => BookingRepository.getByStadiumId(stadiumId),
};

// ── Food Service ──────────────────────────────────────────────────────────────
export const foodService = {
  getAllFoods: () => FoodRepository.getAll(),
  getFoodById: (id) => FoodRepository.getById(id),
  getFoodByRestaurantId: (restaurantId) => FoodRepository.getByRestaurantId(restaurantId),
  uploadFood: (data) => FoodRepository.create(data),
  updateFood: (id, data) => FoodRepository.update(id, data),
  deleteFood: (id) => FoodRepository.delete(id),
  // Diet/type filtering not available via indexed queries without compound indexes,
  // so we fetch all and filter client-side (can be improved with Firestore indexes)
  getFoodByDiet: async (diet) => {
    const all = await FoodRepository.getAll();
    return all.filter((f) => f.diet === diet);
  },
  getFoodByType: async (type) => {
    const all = await FoodRepository.getAll();
    return all.filter((f) => f.type === type);
  },
};

// ── Food Order Service ────────────────────────────────────────────────────────
export const foodOrderService = {
  getAllFoodOrders: () => FoodRepository.getAllOrders(),
  getFoodOrderById: (id) => FoodRepository.getOrderById(id),
  placeFoodOrder: (data) => FoodRepository.placeOrder(data),
  getFoodOrderByUserId: (userId) => FoodRepository.getOrdersByUserId(userId),
  getFoodOrderByEventId: (eventId) => FoodRepository.getOrdersByEventId(eventId),
  getFoodOrderByRestaurantId: async (restaurantId) => {
    const all = await FoodRepository.getAllOrders();
    return all.filter((o) => o.restaurantId === restaurantId);
  },
};

// ── Merchandise Service ───────────────────────────────────────────────────────
export const merchandiseService = {
  getAllMerchandise: () => MerchandiseRepository.getAll(),
  getMerchandiseById: (id) => MerchandiseRepository.getById(id),
  getMerchandiseByStadiumId: (stadiumId) => MerchandiseRepository.getByStadiumId(stadiumId),
  uploadMerchandise: (data) => MerchandiseRepository.create(data),
  updateMerchandise: (id, data) => MerchandiseRepository.update(id, data),
  deleteMerchandise: (id) => MerchandiseRepository.delete(id),
};

// ── Merchandise Order Service ─────────────────────────────────────────────────
export const merchandiseOrderService = {
  getAllMerchandiseOrders: () => MerchandiseRepository.getAllOrders(),
  getMerchandiseOrderById: (id) => MerchandiseRepository.getOrderById(id),
  placeMerchandiseOrder: (data) => MerchandiseRepository.placeOrder(data),
  getMerchandiseOrderByUserId: (userId) => MerchandiseRepository.getOrdersByUserId(userId),
  getMerchandiseOrderByStadiumId: (stadiumId) => MerchandiseRepository.getOrdersByStadiumId(stadiumId),
};

// ── Restaurant Service ────────────────────────────────────────────────────────
export const restaurantService = {
  getAllRestaurants: () => RestaurantRepository.getAll(),
  getRestaurantById: (id) => RestaurantRepository.getById(id),
  getRestaurantByStadiumId: (stadiumId) => RestaurantRepository.getByStadiumId(stadiumId),
  uploadRestaurant: (data) => RestaurantRepository.create(data),
  updateRestaurant: (id, data) => RestaurantRepository.update(id, data),
  deleteRestaurant: (id) => RestaurantRepository.delete(id),
  getRestaurantMenu: (restaurantId) => FoodRepository.getByRestaurantId(restaurantId),
};

// ── Feedback Service ──────────────────────────────────────────────────────────
export const feedbackService = {
  postFeedback: (data) => FeedbackRepository.post(data),
  getFeedbackByEvent: (eventId) => FeedbackRepository.getByEventId(eventId),
  getFeedbackByUser: (userId) => FeedbackRepository.getByUserId(userId),
};

// ── SOS Service ───────────────────────────────────────────────────────────────
export const sosService = {
  raiseSos: (data) => SosRepository.raise(data),
  resolveSos: (id) => SosRepository.resolve(id),
  getAllSos: () => SosRepository.getAll(),
  getSosById: (id) => SosRepository.getById(id),
  getSosByUserId: (userId) => SosRepository.getByUserId(userId),
  getSosByEventId: (eventId) => SosRepository.getByEventId(eventId),
  getSosByStadiumId: (stadiumId) => SosRepository.getByStadiumId(stadiumId),
};

// ── Stadium Service ───────────────────────────────────────────────────────────
export const stadiumService = {
  getAllStadiums: () => StadiumRepository.getAll(),
  getStadiumById: (id) => StadiumRepository.getById(id),
  uploadStadium: (data) => StadiumRepository.create(data),
  updateStadium: (id, data) => StadiumRepository.update(id, data),
  deleteStadium: (id) => StadiumRepository.delete(id),
  getStadiumRestaurants: (stadiumId) => RestaurantRepository.getByStadiumId(stadiumId),
  getStadiumMerchandise: (stadiumId) => MerchandiseRepository.getByStadiumId(stadiumId),
};
