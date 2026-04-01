import { createHash, timingSafeEqual } from "crypto";
import { adminDb } from "@/lib/firebase/admin";

const ADMIN_COLLECTION = "adminCredentials";
const ADMIN_DOC_ID = "singleton-admin";

type AdminRecord = {
  adminId: string;
  passwordHash: string;
  salt: string;
};

const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");

const hashPassword = (password: string, salt: string) => sha256(`${salt}:${password}`);

export const verifyBasicAuthorization = async (authorizationHeader: string | null) => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Basic ")) {
    return false;
  }

  let adminId = "";
  let password = "";
  try {
    const encoded = authorizationHeader.slice(6).trim();
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const idx = decoded.indexOf(":");
    if (idx <= 0) return false;

    adminId = decoded.slice(0, idx);
    password = decoded.slice(idx + 1);
  } catch {
    return false;
  }

  if (!adminId || !password) {
    return false;
  }

  const snap = await adminDb.collection(ADMIN_COLLECTION).doc(ADMIN_DOC_ID).get();
  if (!snap.exists) {
    return false;
  }

  const data = snap.data() as AdminRecord;
  if (!data?.adminId || !data?.salt || !data?.passwordHash) {
    return false;
  }

  if (data.adminId !== adminId) {
    return false;
  }

  const expected = Buffer.from(data.passwordHash, "hex");
  const actual = Buffer.from(hashPassword(password, data.salt), "hex");

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
};
