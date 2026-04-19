/**
 * scripts/seedFirebase.js
 *
 * Standalone Node.js script to seed demo accounts into Firebase Auth + Firestore.
 * Uses the Firebase Auth REST API and Firestore REST API directly —
 * no service account or Admin SDK required, just the project config.
 *
 * Run:  node scripts/seedFirebase.js
 */

const https = require("https");

// ── Firebase project config (copied from src/firebase/config.js) ──────────────
const API_KEY = "AIzaSyCplYt7wlhNlCh-fiH6nmCynszl06GZNS0";
const PROJECT_ID = "eventra-3d1ff";

// ── Demo accounts to seed ─────────────────────────────────────────────────────
const DEMO_USERS = [
  {
    email: "demo.fan@eventra.app",
    password: "Fan@1234",
    firstName: "Demo",
    lastName: "Fan",
    username: "demo_fan",
    phoneNumber: "+91 9000000001",
    gender: "Other",
    role: "user",
    roles: ["user"],
    isDemo: true,
  },
  {
    email: "demo.admin@eventra.app",
    password: "Admin@1234",
    firstName: "Demo",
    lastName: "Admin",
    username: "demo_admin",
    phoneNumber: "+91 9000000002",
    gender: "Other",
    role: "admin",
    roles: ["admin"],
    isDemo: true,
  },
];

// ── HTTP helper ───────────────────────────────────────────────────────────────
function request(url, method, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ── Firebase Auth REST helpers ────────────────────────────────────────────────
const AUTH_BASE = `https://identitytoolkit.googleapis.com/v1/accounts`;

async function signUp(email, password) {
  return request(`${AUTH_BASE}:signUp?key=${API_KEY}`, "POST", {
    email,
    password,
    returnSecureToken: true,
  });
}

async function signIn(email, password) {
  return request(`${AUTH_BASE}:signInWithPassword?key=${API_KEY}`, "POST", {
    email,
    password,
    returnSecureToken: true,
  });
}

async function updateDisplayName(idToken, displayName) {
  return request(`${AUTH_BASE}:update?key=${API_KEY}`, "POST", {
    idToken,
    displayName,
    returnSecureToken: false,
  });
}

// ── Firestore REST helper ─────────────────────────────────────────────────────
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") fields[k] = { stringValue: v };
    else if (typeof v === "boolean") fields[k] = { booleanValue: v };
    else if (typeof v === "number") fields[k] = { integerValue: String(v) };
    else if (Array.isArray(v)) {
      fields[k] = {
        arrayValue: {
          values: v.map((item) => ({ stringValue: item })),
        },
      };
    }
  }
  return fields;
}

async function writeUserProfile(uid, profile, idToken) {
  const url = `${FS_BASE}/users/${uid}`;
  const fields = toFirestoreFields({
    uid,
    ...profile,
    displayName: `${profile.firstName} ${profile.lastName}`,
    createdAt: new Date().toISOString(),
  });

  const res = await new Promise((resolve, reject) => {
    const data = JSON.stringify({ fields });
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        Authorization: `Bearer ${idToken}`,
      },
    };
    const req = https.request(options, (r) => {
      let raw = "";
      r.on("data", (c) => (raw += c));
      r.on("end", () => resolve({ status: r.statusCode, body: JSON.parse(raw) }));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });

  return res;
}

// ── Seed logic ────────────────────────────────────────────────────────────────
async function seedUser(user) {
  const displayName = `${user.firstName} ${user.lastName}`;
  let uid, idToken;

  // 1. Try to sign in first (account may already exist)
  const signInRes = await signIn(user.email, user.password);
  if (signInRes.status === 200) {
    uid = signInRes.body.localId;
    idToken = signInRes.body.idToken;
    console.log(`  ✓ Already exists — signed in as ${user.email}`);
  } else if (
    signInRes.body?.error?.message === "EMAIL_NOT_FOUND" ||
    signInRes.body?.error?.message === "INVALID_LOGIN_CREDENTIALS" ||
    signInRes.body?.error?.message === "INVALID_EMAIL"
  ) {
    // 2. Account doesn't exist — create it
    const signUpRes = await signUp(user.email, user.password);
    if (signUpRes.status !== 200) {
      console.error(
        `  ✗ Failed to create ${user.email}:`,
        signUpRes.body?.error?.message
      );
      return;
    }
    uid = signUpRes.body.localId;
    idToken = signUpRes.body.idToken;
    await updateDisplayName(idToken, displayName);
    console.log(`  ✓ Created Auth account for ${user.email}`);
  } else {
    console.error(
      `  ✗ Unexpected sign-in response for ${user.email}:`,
      signInRes.body?.error?.message
    );
    return;
  }

  // 3. Write / overwrite Firestore profile
  const { email, password, ...profileData } = user;
  const fsRes = await writeUserProfile(uid, { ...profileData, email }, idToken);
  if (fsRes.status === 200) {
    console.log(`  ✓ Firestore profile written for ${user.email} (uid: ${uid})`);
  } else {
    console.error(`  ✗ Firestore write failed:`, JSON.stringify(fsRes.body?.error));
  }
}

async function main() {
  console.log("\n🚀  Eventra — Firebase Demo Seed\n");
  console.log(`   Project: ${PROJECT_ID}\n`);

  for (const user of DEMO_USERS) {
    console.log(`→ Seeding [${user.role.toUpperCase()}] ${user.email}`);
    await seedUser(user);
    console.log("");
  }

  console.log("✅  Seeding complete!\n");
  console.log("   Fan account:   demo.fan@eventra.app   / Fan@1234");
  console.log("   Admin account: demo.admin@eventra.app / Admin@1234\n");
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
