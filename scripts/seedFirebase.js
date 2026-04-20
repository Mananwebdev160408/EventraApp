/**
 * scripts/seedFirebase.js
 *
 * Standalone Node.js script to seed linked demo data into Firebase Auth + Firestore.
 * Uses Firebase Auth REST API and Firestore REST API directly.
 *
 * Run: node scripts/seedFirebase.js
 */

const https = require("https");

// Firebase project config
const API_KEY = "AIzaSyCplYt7wlhNlCh-fiH6nmCynszl06GZNS0";
const PROJECT_ID = "eventra-3d1ff";

// Demo accounts (Auth + users collection)
const DEMO_USERS = [
  {
    key: "fan_primary",
    email: "demo.fan@eventra.app",
    password: "Fan@1234",
    firstName: "Demo",
    lastName: "Fan",
    username: "demo_fan",
    phoneNumber: "+91 9000000001",
    gender: "Other",
    role: "user",
    roles: ["user"],
  },
  {
    key: "admin_primary",
    email: "demo.admin@eventra.app",
    password: "Admin@1234",
    firstName: "Demo",
    lastName: "Admin",
    username: "demo_admin",
    phoneNumber: "+91 9000000002",
    gender: "Other",
    role: "admin",
    roles: ["admin"],
  },
  {
    key: "fan_2",
    email: "demo.fan2@eventra.app",
    password: "Fan2@1234",
    firstName: "Alex",
    lastName: "Roy",
    username: "alex_roy",
    phoneNumber: "+91 9000000003",
    gender: "Male",
    role: "user",
    roles: ["user"],
  },
  {
    key: "fan_3",
    email: "demo.fan3@eventra.app",
    password: "Fan3@1234",
    firstName: "Priya",
    lastName: "Shah",
    username: "priya_shah",
    phoneNumber: "+91 9000000004",
    gender: "Female",
    role: "user",
    roles: ["user"],
  },
  {
    key: "fan_4",
    email: "demo.fan4@eventra.app",
    password: "Fan4@1234",
    firstName: "Rahul",
    lastName: "Iyer",
    username: "rahul_iyer",
    phoneNumber: "+91 9000000005",
    gender: "Male",
    role: "user",
    roles: ["user"],
  },
];

const AUTH_BASE = "https://identitytoolkit.googleapis.com/v1/accounts";
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function request(url, method, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const hasBody = body !== undefined;
    const data = hasBody ? JSON.stringify(body) : null;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(hasBody ? { "Content-Length": Buffer.byteLength(data) } : {}),
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => {
        raw += chunk;
      });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });

    req.on("error", reject);
    if (hasBody) req.write(data);
    req.end();
  });
}

function signUp(email, password) {
  return request(`${AUTH_BASE}:signUp?key=${API_KEY}`, "POST", {
    email,
    password,
    returnSecureToken: true,
  });
}

function signIn(email, password) {
  return request(`${AUTH_BASE}:signInWithPassword?key=${API_KEY}`, "POST", {
    email,
    password,
    returnSecureToken: true,
  });
}

function updateDisplayName(idToken, displayName) {
  return request(`${AUTH_BASE}:update?key=${API_KEY}`, "POST", {
    idToken,
    displayName,
    returnSecureToken: false,
  });
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };

  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) => toFirestoreValue(item)),
      },
    };
  }

  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }

  return { stringValue: String(value) };
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    fields[k] = toFirestoreValue(v);
  }
  return fields;
}

function writeDocument(collectionName, docId, data, idToken) {
  return request(
    `${FS_BASE}/${collectionName}/${docId}`,
    "PATCH",
    { fields: toFirestoreFields(data) },
    { Authorization: `Bearer ${idToken}` }
  );
}

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function buildSeedGraph(userByKey) {
  const admin = userByKey.admin_primary;
  const fanPrimary = userByKey.fan_primary;
  const fan2 = userByKey.fan_2;
  const fan3 = userByKey.fan_3;
  const fan4 = userByKey.fan_4;

  const stadiums = [
    {
      id: "seed_stadium_wankhede",
      name: "Wankhede Stadium",
      location: "Mumbai, Maharashtra",
      capacity: 33108,
      adminUid: admin.uid,
      adminEmail: admin.email,
      description: "Iconic cricket venue in South Mumbai.",
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_stadium_eden",
      name: "Eden Gardens",
      location: "Kolkata, West Bengal",
      capacity: 68000,
      adminUid: admin.uid,
      adminEmail: admin.email,
      description: "Historic multi-purpose stadium and cricket fortress.",
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const events = [
    {
      id: "seed_event_ipl_mi_csk",
      name: "IPL 2026: MI vs CSK",
      category: "Sports",
      tag: "FEATURED",
      tags: ["Cricket", "High Voltage"],
      description: "A blockbuster IPL faceoff under lights.",
      stadiumId: stadiums[0].id,
      stadiumName: stadiums[0].name,
      venue: stadiums[0].name,
      datetime: daysFromNow(5).toISOString(),
      dateTime: daysFromNow(5).toISOString(),
      minPrice: 799,
      price: 1499,
      tierPrices: { VIP: 2499, Standard: 1499, "Early Bird": 799 },
      isFeatured: true,
      status: "live",
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_event_music_night",
      name: "Neon Music Carnival",
      category: "Music",
      tag: "TRENDING",
      tags: ["Live", "Festival"],
      description: "An all-night music festival with top artists.",
      stadiumId: stadiums[1].id,
      stadiumName: stadiums[1].name,
      venue: stadiums[1].name,
      datetime: daysFromNow(12).toISOString(),
      dateTime: daysFromNow(12).toISOString(),
      minPrice: 599,
      price: 999,
      tierPrices: { VIP: 1999, Standard: 999, "Early Bird": 599 },
      isFeatured: false,
      status: "live",
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_event_football_final",
      name: "City Derby Final 2026",
      category: "Sports",
      tag: "LIMITED",
      tags: ["Football", "Final"],
      description: "Championship final with sold-out energy.",
      stadiumId: stadiums[0].id,
      stadiumName: stadiums[0].name,
      venue: stadiums[0].name,
      datetime: daysFromNow(-7).toISOString(),
      dateTime: daysFromNow(-7).toISOString(),
      minPrice: 499,
      price: 899,
      tierPrices: { VIP: 1599, Standard: 899, "Early Bird": 499 },
      isFeatured: false,
      status: "offline",
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const restaurants = [
    {
      id: "seed_restaurant_northbite",
      name: "North Bite Kitchen",
      cuisine: "Indian",
      section: "112",
      stadiumId: stadiums[0].id,
      rating: 4.5,
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_restaurant_grillhouse",
      name: "Grill House Express",
      cuisine: "Continental",
      section: "206",
      stadiumId: stadiums[1].id,
      rating: 4.3,
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const foodItems = [
    {
      id: "seed_food_paneer_wrap",
      name: "Paneer Tikka Wrap",
      type: "Main",
      diet: "veg",
      price: 6.99,
      restaurantId: restaurants[0].id,
      eventId: events[0].id,
      stadiumId: stadiums[0].id,
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_food_loaded_fries",
      name: "Loaded Peri Peri Fries",
      type: "Snacks",
      diet: "veg",
      price: 4.49,
      restaurantId: restaurants[0].id,
      eventId: events[0].id,
      stadiumId: stadiums[0].id,
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_food_bbq_burger",
      name: "BBQ Chicken Burger",
      type: "Main",
      diet: "non-veg",
      price: 7.49,
      restaurantId: restaurants[1].id,
      eventId: events[1].id,
      stadiumId: stadiums[1].id,
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_food_cold_coffee",
      name: "Cold Coffee",
      type: "Beverages",
      diet: "veg",
      price: 3.25,
      restaurantId: restaurants[1].id,
      eventId: events[1].id,
      stadiumId: stadiums[1].id,
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const merchandise = [
    {
      id: "seed_merch_mi_jersey",
      name: "MI Official Jersey 2026",
      type: "Apparel",
      price: 39.99,
      stock: 120,
      eventId: events[0].id,
      stadiumId: stadiums[0].id,
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_merch_csk_cap",
      name: "CSK Captain Cap",
      type: "Headwear",
      price: 12.5,
      stock: 200,
      eventId: events[0].id,
      stadiumId: stadiums[0].id,
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_merch_eventra_hoodie",
      name: "Eventra Limited Hoodie",
      type: "Apparel",
      price: 49,
      stock: 80,
      eventId: events[1].id,
      stadiumId: stadiums[1].id,
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const seats = [];
  const eventSeatPlan = [
    { eventId: events[0].id, stadiumId: stadiums[0].id },
    { eventId: events[1].id, stadiumId: stadiums[1].id },
    { eventId: events[2].id, stadiumId: stadiums[0].id },
  ];

  const seatPricesByType = {
    VIP: 2499,
    Standard: 1499,
    "Early Bird": 799,
  };

  eventSeatPlan.forEach(({ eventId, stadiumId }) => {
    ["A", "B", "C"].forEach((rowPrefix, rowIndex) => {
      const seatCategory = rowIndex === 0 ? "VIP" : rowIndex === 1 ? "Standard" : "Early Bird";
      for (let i = 1; i <= 8; i += 1) {
        seats.push({
          id: `seed_seat_${eventId}_${rowPrefix}${String(i).padStart(2, "0")}`,
          eventId,
          stadiumId,
          row: rowPrefix,
          seatNumber: String(i),
          seatCategory,
          price: seatPricesByType[seatCategory],
          isAvailable: true,
          createdAt: new Date(),
          isDemo: true,
        });
      }
    });
  });

  const selectedSeatsBooking1 = seats
    .filter((s) => s.eventId === events[0].id)
    .slice(0, 2)
    .map((s) => ({
      id: s.id,
      row: s.row,
      seatNumber: s.seatNumber,
      seatCategory: s.seatCategory,
      price: s.price,
    }));

  const selectedSeatsBooking2 = seats
    .filter((s) => s.eventId === events[1].id)
    .slice(2, 4)
    .map((s) => ({
      id: s.id,
      row: s.row,
      seatNumber: s.seatNumber,
      seatCategory: s.seatCategory,
      price: s.price,
    }));

  const bookings = [
    {
      id: "seed_booking_fan_primary_1",
      userId: fanPrimary.uid,
      eventId: events[0].id,
      stadiumId: stadiums[0].id,
      seats: selectedSeatsBooking1,
      event: {
        id: events[0].id,
        name: events[0].name,
        datetime: events[0].datetime,
        stadiumName: events[0].stadiumName,
      },
      ticketType: "VIP GOLD",
      status: "confirmed",
      totalAmount: selectedSeatsBooking1.reduce((sum, s) => sum + s.price, 0),
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_booking_fan_2_1",
      userId: fan2.uid,
      eventId: events[1].id,
      stadiumId: stadiums[1].id,
      seats: selectedSeatsBooking2,
      event: {
        id: events[1].id,
        name: events[1].name,
        datetime: events[1].datetime,
        stadiumName: events[1].stadiumName,
      },
      ticketType: "STANDARD",
      status: "confirmed",
      totalAmount: selectedSeatsBooking2.reduce((sum, s) => sum + s.price, 0),
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const bookedSeatIds = new Set([
    ...selectedSeatsBooking1.map((s) => s.id),
    ...selectedSeatsBooking2.map((s) => s.id),
  ]);

  const foodOrders = [
    {
      id: "seed_food_order_1",
      userId: fanPrimary.uid,
      restaurantId: restaurants[0].id,
      restaurantName: restaurants[0].name,
      eventId: events[0].id,
      stadiumId: stadiums[0].id,
      foodIds: [foodItems[0].id, foodItems[1].id],
      foodNames: [foodItems[0].name, foodItems[1].name],
      quantity: 3,
      price: 15.97,
      status: "delivered",
      orderTime: daysFromNow(-1).toISOString(),
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_food_order_2",
      userId: fan3.uid,
      restaurantId: restaurants[1].id,
      restaurantName: restaurants[1].name,
      eventId: events[1].id,
      stadiumId: stadiums[1].id,
      foodIds: [foodItems[2].id],
      foodNames: [foodItems[2].name],
      quantity: 1,
      price: 7.49,
      status: "pending",
      orderTime: daysFromNow(1).toISOString(),
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const merchandiseOrders = [
    {
      id: "seed_merch_order_1",
      userId: fan2.uid,
      stadiumId: stadiums[0].id,
      stadiumName: stadiums[0].name,
      eventId: events[0].id,
      merchandiseIds: [merchandise[0].id],
      merchandiseNames: [merchandise[0].name],
      quantity: 1,
      price: 39.99,
      status: "delivered",
      orderTime: daysFromNow(-2).toISOString(),
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_merch_order_2",
      userId: fan4.uid,
      stadiumId: stadiums[1].id,
      stadiumName: stadiums[1].name,
      eventId: events[1].id,
      merchandiseIds: [merchandise[2].id],
      merchandiseNames: [merchandise[2].name],
      quantity: 2,
      price: 98,
      status: "pending",
      orderTime: daysFromNow(2).toISOString(),
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const feedback = [
    {
      id: "seed_feedback_1",
      userId: fanPrimary.uid,
      eventId: events[2].id,
      rating: 5,
      comment: "Amazing atmosphere and smooth entry experience.",
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_feedback_2",
      userId: fan2.uid,
      eventId: events[2].id,
      rating: 4,
      comment: "Great event, food queues were slightly long.",
      createdAt: new Date(),
      isDemo: true,
    },
  ];

  const sos = [
    {
      id: "seed_sos_1",
      userId: fan3.uid,
      eventId: events[1].id,
      stadiumId: stadiums[1].id,
      location: "Section B, Gate 4",
      message: "Need medical assistance",
      severity: "high",
      status: "active",
      createdAt: new Date(),
      isDemo: true,
    },
    {
      id: "seed_sos_2",
      userId: fan4.uid,
      eventId: events[0].id,
      stadiumId: stadiums[0].id,
      location: "Stand C, Row 18",
      message: "Lost child announcement request",
      severity: "medium",
      status: "resolved",
      createdAt: daysFromNow(-3),
      resolvedAt: daysFromNow(-3),
      isDemo: true,
    },
  ];

  return {
    stadiums,
    events,
    restaurants,
    foodItems,
    merchandise,
    seats,
    bookings,
    foodOrders,
    merchandiseOrders,
    feedback,
    sos,
    bookedSeatIds,
  };
}

async function ensureAuthAndUserProfile(user) {
  const displayName = `${user.firstName} ${user.lastName}`;

  let uid;
  let idToken;

  const signInRes = await signIn(user.email, user.password);
  if (signInRes.status === 200) {
    uid = signInRes.body.localId;
    idToken = signInRes.body.idToken;
    console.log(`  + Auth exists: ${user.email}`);
  } else if (
    signInRes.body?.error?.message === "EMAIL_NOT_FOUND" ||
    signInRes.body?.error?.message === "INVALID_LOGIN_CREDENTIALS" ||
    signInRes.body?.error?.message === "INVALID_EMAIL"
  ) {
    const signUpRes = await signUp(user.email, user.password);
    if (signUpRes.status !== 200) {
      throw new Error(`Failed to create ${user.email}: ${signUpRes.body?.error?.message}`);
    }

    uid = signUpRes.body.localId;
    idToken = signUpRes.body.idToken;
    await updateDisplayName(idToken, displayName);
    console.log(`  + Auth created: ${user.email}`);
  } else {
    throw new Error(`Unexpected auth response for ${user.email}: ${signInRes.body?.error?.message}`);
  }

  const userDoc = {
    uid,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    displayName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    role: user.role,
    roles: user.roles,
    isDemo: true,
    createdAt: new Date(),
  };

  const userDocRes = await writeDocument("users", uid, userDoc, idToken);
  if (userDocRes.status !== 200) {
    throw new Error(`users/${uid} write failed: ${JSON.stringify(userDocRes.body?.error)}`);
  }

  return { uid, idToken, email: user.email, role: user.role, key: user.key };
}

async function writeCollection(collectionName, rows, token) {
  for (const row of rows) {
    const res = await writeDocument(collectionName, row.id, row, token);
    if (res.status !== 200) {
      console.error(`  - Failed ${collectionName}/${row.id}:`, JSON.stringify(res.body?.error));
    }
  }
}

async function seedLinkedData(adminToken, graph) {
  await writeCollection("stadiums", graph.stadiums, adminToken);
  console.log(`  + stadiums: ${graph.stadiums.length}`);

  await writeCollection("events", graph.events, adminToken);
  console.log(`  + events: ${graph.events.length}`);

  await writeCollection("restaurants", graph.restaurants, adminToken);
  console.log(`  + restaurants: ${graph.restaurants.length}`);

  await writeCollection("foodItems", graph.foodItems, adminToken);
  console.log(`  + foodItems: ${graph.foodItems.length}`);

  await writeCollection("merchandise", graph.merchandise, adminToken);
  console.log(`  + merchandise: ${graph.merchandise.length}`);

  for (const seat of graph.seats) {
    const res = await writeDocument(
      "seats",
      seat.id,
      { ...seat, isAvailable: !graph.bookedSeatIds.has(seat.id) },
      adminToken
    );
    if (res.status !== 200) {
      console.error(`  - Failed seats/${seat.id}:`, JSON.stringify(res.body?.error));
    }
  }
  console.log(`  + seats: ${graph.seats.length}`);

  await writeCollection("bookings", graph.bookings, adminToken);
  console.log(`  + bookings: ${graph.bookings.length}`);

  await writeCollection("foodOrders", graph.foodOrders, adminToken);
  console.log(`  + foodOrders: ${graph.foodOrders.length}`);

  await writeCollection("merchandiseOrders", graph.merchandiseOrders, adminToken);
  console.log(`  + merchandiseOrders: ${graph.merchandiseOrders.length}`);

  await writeCollection("feedback", graph.feedback, adminToken);
  console.log(`  + feedback: ${graph.feedback.length}`);

  await writeCollection("sos", graph.sos, adminToken);
  console.log(`  + sos: ${graph.sos.length}`);
}

async function main() {
  console.log("\nEventra Linked Firebase Seed\n");
  console.log(`Project: ${PROJECT_ID}\n`);

  const authUsers = [];
  for (const user of DEMO_USERS) {
    console.log(`Seeding user ${user.email}`);
    const seeded = await ensureAuthAndUserProfile(user);
    authUsers.push(seeded);
  }

  const userByKey = Object.fromEntries(authUsers.map((u) => [u.key, u]));
  const admin = authUsers.find((u) => u.role === "admin");
  if (!admin?.idToken) {
    throw new Error("Admin token unavailable, cannot seed linked documents.");
  }

  console.log("\nSeeding linked collections...");
  const graph = buildSeedGraph(userByKey);
  await seedLinkedData(admin.idToken, graph);

  console.log("\nSeed complete. Credentials:");
  console.log("- demo.fan@eventra.app / Fan@1234");
  console.log("- demo.admin@eventra.app / Admin@1234");
  console.log("- demo.fan2@eventra.app / Fan2@1234");
  console.log("- demo.fan3@eventra.app / Fan3@1234");
  console.log("- demo.fan4@eventra.app / Fan4@1234\n");
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
