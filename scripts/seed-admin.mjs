import admin from "firebase-admin";
import { createHash, randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const loadEnvLocal = () => {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

loadEnvLocal();

const ADMIN_COLLECTION = "adminCredentials";
const ADMIN_DOC_ID = "singleton-admin";

const adminId = process.env.ADMIN_ID;
const adminPass = process.env.ADMIN_PASS;

if (!adminId || !adminPass) {
  console.error("Missing ADMIN_ID or ADMIN_PASS in environment");
  process.exit(1);
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = admin.firestore();
const ref = db.collection(ADMIN_COLLECTION).doc(ADMIN_DOC_ID);

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const run = async () => {
  const snap = await ref.get();
  const salt = randomBytes(16).toString("hex");
  const now = new Date().toISOString();
  const passwordHash = sha256(`${salt}:${adminPass}`);

  const payload = {
    adminId,
    salt,
    passwordHash,
    createdAt: snap.exists ? snap.data().createdAt || now : now,
    updatedAt: now,
  };

  await ref.set(payload);
  console.log(
    "Admin credential seeded/updated at",
    `${ADMIN_COLLECTION}/${ADMIN_DOC_ID}`,
  );
};

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed admin:", err?.message || err);
    process.exit(1);
  });
