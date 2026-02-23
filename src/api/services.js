import apiClient from "./apiClient";

/**
 * Auth related API calls
 */
export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};

/**
 * User management API calls
 */
export const userService = {
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },
  changePassword: async (userId, passwordData) => {
    const response = await apiClient.put(
      `/users/${userId}/password`,
      passwordData,
    );
    return response.data;
  },
  deleteUser: async (userId, password) => {
    const response = await apiClient.delete(`/users/${userId}`, {
      data: { password },
    });
    return response.data;
  },
};

/**
 * Event related API calls
 */
export const eventService = {
  getEvents: async (params) => {
    const response = await apiClient.get("/events", { params });
    console.log(response.data);
    return response.data;
  },
  getEventDetails: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await apiClient.post("/events/create", eventData);
    return response.data;
  },
  updateEventStatus: async (eventId, status) => {
    const response = await apiClient.patch(`/events/${eventId}/status`, {
      status,
    });
    return response.data;
  },
};

/**
 * Seat related API calls (EventSeat)
 */
export const seatService = {
  getEventSeats: async (eventId) => {
    const response = await apiClient.get(`/event-seat/events/${eventId}`);
    return response.data;
  },
  getAvailableSeats: async (eventId) => {
    const response = await apiClient.get(
      `/event-seat/event/${eventId}/available`,
    );
    return response.data;
  },
  bulkCreateSeats: async (eventId, pricing) => {
    const response = await apiClient.post(
      `/event-seats/bulk/event/${eventId}`,
      pricing,
    );
    return response.data;
  },
  getAllEventSeats: async () => {
    const response = await apiClient.get("/event-seat/events");
    return response.data;
  },
};

/**
 * Booking related API calls
 */
export const bookingService = {
  reserveSeats: async (bookingData) => {
    const response = await apiClient.post("/bookings/reserve", bookingData);
    return response.data;
  },
  confirmBooking: async (bookingData) => {
    const response = await apiClient.post("/bookings/confirm", bookingData);
    return response.data;
  },
  getUserBookings: async (userId) => {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  },
  getBookingsByEvent: async (eventId) => {
    const response = await apiClient.get(`/bookings/event/${eventId}`);
    return response.data;
  },
};

/**
 * Food & Orders related API calls
 */
export const foodService = {
  getFoodById: async (foodId) => {
    const response = await apiClient.get(`/food/${foodId}`);
    return response.data;
  },
  uploadFood: async (foodData) => {
    const response = await apiClient.post("/food/upload", foodData);
    return response.data;
  },
  placeFoodOrder: async (orderData) => {
    const response = await apiClient.post(
      "/foodOrder/placeFoodOrder",
      orderData,
    );
    return response.data;
  },
  getAllFoodOrders: async () => {
    const response = await apiClient.get("/foodOrder/allFoodOrders");
    return response.data;
  },
};

/**
 * Merchandise related API calls
 */
export const merchandiseService = {
  getAllMerchandise: async () => {
    const response = await apiClient.get("/merchandise/allMerchandise");
    return response.data;
  },
  uploadMerchandise: async (merchData) => {
    const response = await apiClient.post("/merchandise/upload", merchData);
    return response.data;
  },
  placeMerchandiseOrder: async (orderData) => {
    const response = await apiClient.post(
      "/merchandiseOrder/placeMerchandiseOrder",
      orderData,
    );
    return response.data;
  },
};

/**
 * Restaurant related API calls
 */
export const restaurantService = {
  getAllRestaurants: async () => {
    const response = await apiClient.get("/restaurant/allRestaurants");
    return response.data;
  },
  getRestaurantMenu: async (restaurantId) => {
    const response = await apiClient.get(`/restaurant/${restaurantId}/menu`);
    return response.data;
  },
  uploadRestaurant: async (restaurantData) => {
    const response = await apiClient.post("/restaurant/upload", restaurantData);
    return response.data;
  },
};

/**
 * Feedback API calls
 */
export const feedbackService = {
  postFeedback: async (feedbackData) => {
    const response = await apiClient.post("/feedback", feedbackData);
    return response.data;
  },
  getFeedbackByEvent: async (eventId) => {
    const response = await apiClient.get(`/feedback/event/${eventId}`);
    return response.data;
  },
  getFeedbackByUser: async (userId) => {
    const response = await apiClient.get(`/feedback/user/${userId}`);
    return response.data;
  },
};

/**
 * SOS API calls
 */
export const sosService = {
  raiseSos: async (sosData) => {
    const response = await apiClient.post("/sos/raiseSos", sosData);
    return response.data;
  },
  resolveSos: async (sosId) => {
    const response = await apiClient.patch(`/sos/${sosId}/resolveSos`);
    return response.data;
  },
  getAllSos: async () => {
    const response = await apiClient.get("/sos/allSos");
    return response.data;
  },
};

/**
 * Stadium API calls
 */
export const stadiumService = {
  getAllStadiums: async () => {
    const response = await apiClient.get("/stadium/allStadiums");
    return response.data;
  },
  uploadStadium: async (stadiumData) => {
    const response = await apiClient.post("/stadium/upload", stadiumData);
    return response.data;
  },
  getStadiumRestaurants: async (stadiumId) => {
    const response = await apiClient.get(`/stadium/${stadiumId}/restaurants`);
    return response.data;
  },
};
