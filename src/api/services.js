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
  // Go live — PATCH /events/{id}
  goEventLive: async (eventId) => {
    const response = await apiClient.patch(`/events/${eventId}`);
    return response.data;
  },
  // Take down — PATCH /events/{id}/down
  goEventDown: async (eventId) => {
    const response = await apiClient.patch(`/events/${eventId}/down`);
    return response.data;
  },
};

/**
 * EventSeat related API calls
 * Backend base: /event-seats
 */
export const seatService = {
  getEventSeats: async (eventId) => {
    const response = await apiClient.get(`/event-seats/event/${eventId}`);
    return response.data;
  },
  getAvailableSeats: async (eventId) => {
    const response = await apiClient.get(
      `/event-seats/event/${eventId}/available`,
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
    const response = await apiClient.get("/event-seats");
    return response.data;
  },
  getEventSeatById: async (id) => {
    const response = await apiClient.get(`/event-seats/${id}`);
    return response.data;
  },
  updateEventSeat: async (id, updateDto) => {
    const response = await apiClient.put(`/event-seats/${id}`, updateDto);
    return response.data;
  },
  updateEventSeatAvailability: async (id, availability) => {
    const response = await apiClient.patch(
      `/event-seats/${id}/availability`,
      null,
      { params: { availability } },
    );
    return response.data;
  },
  deleteEventSeat: async (id) => {
    const response = await apiClient.delete(`/event-seats/${id}`);
    return response.data;
  },
  importSeats: async (file, stadiumId) => {
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name || "seats.csv",
      type: "text/csv",
    });

    const response = await apiClient.post(`/seats/import`, formData, {
      params: { stadiumId },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
  getAllBookings: async () => {
    const response = await apiClient.get("/bookings/allBookings");
    return response.data;
  },
  getBookingById: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },
  getBookingsByStadium: async (stadiumId) => {
    const response = await apiClient.get(`/bookings/stadium/${stadiumId}`);
    return response.data;
  },
};

/**
 * Food related API calls
 */
export const foodService = {
  getAllFoods: async () => {
    const response = await apiClient.get("/food/allFoods");
    return response.data;
  },
  getFoodById: async (foodId) => {
    const response = await apiClient.get(`/food/${foodId}`);
    return response.data;
  },
  getFoodByRestaurantId: async (restaurantId) => {
    const response = await apiClient.get(`/food/restaurant/${restaurantId}`);
    return response.data;
  },
  getFoodByDiet: async (diet) => {
    const response = await apiClient.get(`/food/diet/${diet}`);
    return response.data;
  },
  getFoodByType: async (type) => {
    const response = await apiClient.get(`/food/type/${type}`);
    return response.data;
  },
  uploadFood: async (foodData) => {
    const response = await apiClient.post("/food/upload", foodData);
    return response.data;
  },
  updateFood: async (id, foodUpdateDto) => {
    const response = await apiClient.patch(`/food/${id}`, foodUpdateDto);
    return response.data;
  },
  deleteFood: async (id, deleteCredentials) => {
    const response = await apiClient.delete(`/food/${id}`, {
      data: deleteCredentials,
    });
    return response.data;
  },
};

/**
 * Food Order related API calls
 */
export const foodOrderService = {
  getAllFoodOrders: async () => {
    const response = await apiClient.get("/foodOrder/allFoodOrders");
    return response.data;
  },
  getFoodOrderById: async (id) => {
    const response = await apiClient.get(`/foodOrder/${id}`);
    return response.data;
  },
  placeFoodOrder: async (orderData) => {
    const response = await apiClient.post(
      "/foodOrder/placeFoodOrder",
      orderData,
    );
    return response.data;
  },
  getFoodOrderByUserId: async (userId) => {
    const response = await apiClient.get(`/foodOrder/user/${userId}`);
    return response.data;
  },
  getFoodOrderByRestaurantId: async (restaurantId) => {
    const response = await apiClient.get(
      `/foodOrder/restaurant/${restaurantId}`,
    );
    return response.data;
  },
  getFoodOrderByEventId: async (eventId) => {
    const response = await apiClient.get(`/foodOrder/event/${eventId}`);
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
  getMerchandiseById: async (id) => {
    const response = await apiClient.get(`/merchandise/${id}`);
    return response.data;
  },
  getMerchandiseByStadiumId: async (stadiumId) => {
    const response = await apiClient.get(`/merchandise/stadium/${stadiumId}`);
    return response.data;
  },
  uploadMerchandise: async (merchData) => {
    const response = await apiClient.post("/merchandise/upload", merchData);
    return response.data;
  },
  updateMerchandise: async (id, merchUpdateDto) => {
    const response = await apiClient.patch(
      `/merchandise/${id}`,
      merchUpdateDto,
    );
    return response.data;
  },
  deleteMerchandise: async (id, deleteCredentials) => {
    const response = await apiClient.delete(`/merchandise/${id}`, {
      data: deleteCredentials,
    });
    return response.data;
  },
};

/**
 * Merchandise Order related API calls
 */
export const merchandiseOrderService = {
  getAllMerchandiseOrders: async () => {
    const response = await apiClient.get(
      "/merchandiseOrder/allMerchandiseOrders",
    );
    return response.data;
  },
  getMerchandiseOrderById: async (id) => {
    const response = await apiClient.get(`/merchandiseOrder/${id}`);
    return response.data;
  },
  placeMerchandiseOrder: async (orderData) => {
    const response = await apiClient.post(
      "/merchandiseOrder/placeMerchandiseOrder",
      orderData,
    );
    return response.data;
  },
  getMerchandiseOrderByUserId: async (userId) => {
    const response = await apiClient.get(`/merchandiseOrder/user/${userId}`);
    return response.data;
  },
  getMerchandiseOrderByStadiumId: async (stadiumId) => {
    const response = await apiClient.get(
      `/merchandiseOrder/stadium/${stadiumId}`,
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
  getRestaurantById: async (id) => {
    const response = await apiClient.get(`/restaurant/${id}`);
    return response.data;
  },
  getRestaurantMenu: async (restaurantId) => {
    const response = await apiClient.get(`/restaurant/${restaurantId}/menu`);
    return response.data;
  },
  getRestaurantByStadiumId: async (stadiumId) => {
    const response = await apiClient.get(`/restaurant/stadium/${stadiumId}`);
    return response.data;
  },
  uploadRestaurant: async (restaurantData) => {
    const response = await apiClient.post("/restaurant/upload", restaurantData);
    return response.data;
  },
  updateRestaurant: async (id, restaurantUpdateDto) => {
    const response = await apiClient.patch(
      `/restaurant/${id}`,
      restaurantUpdateDto,
    );
    return response.data;
  },
  deleteRestaurant: async (id, deleteCredentials) => {
    const response = await apiClient.delete(`/restaurant/${id}`, {
      data: deleteCredentials,
    });
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
  getSosById: async (sosId) => {
    const response = await apiClient.get(`/sos/${sosId}`);
    return response.data;
  },
  getSosByUserId: async (userId) => {
    const response = await apiClient.get(`/sos/user/${userId}`);
    return response.data;
  },
  getSosByEventId: async (eventId) => {
    const response = await apiClient.get(`/sos/event/${eventId}`);
    return response.data;
  },
  getSosByStadiumId: async (stadiumId) => {
    const response = await apiClient.get(`/sos/stadium/${stadiumId}`);
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
  getStadiumById: async (id) => {
    const response = await apiClient.get(`/stadium/${id}`);
    return response.data;
  },
  uploadStadium: async (stadiumData) => {
    const response = await apiClient.post("/stadium/upload", stadiumData);
    return response.data;
  },
  updateStadium: async (id, stadiumUpdateDto) => {
    const response = await apiClient.patch(`/stadium/${id}`, stadiumUpdateDto);
    return response.data;
  },
  deleteStadium: async (id, deleteCredentials) => {
    const response = await apiClient.delete(`/stadium/${id}`, {
      data: deleteCredentials,
    });
    return response.data;
  },
  getStadiumRestaurants: async (stadiumId) => {
    const response = await apiClient.get(`/stadium/${stadiumId}/restaurants`);
    return response.data;
  },
  getStadiumMerchandise: async (stadiumId) => {
    const response = await apiClient.get(`/stadium/${stadiumId}/merchandise`);
    return response.data;
  },
};
