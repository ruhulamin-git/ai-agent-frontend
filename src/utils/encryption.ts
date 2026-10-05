import crypto from "crypto";

import { ENCRYPTION_KEY } from "@/config";

const algorithm = "aes-256-cbc";
const KEY_LENGTH = 32;
const ivLength = 16;
const key = crypto
  .createHash("sha256")
  .update(String(ENCRYPTION_KEY))
  .digest("base64")
  .slice(0, KEY_LENGTH);

const encrypt = (password: string): string => {
  const iv = crypto.randomBytes(ivLength);

  // @ts-expect-error: Suppressing TypeScript error for createDecipheriv
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedPassword: string): string => {
  const [ivString, encrypted] = encryptedPassword.split(":");
  if (ivString && ivString.length !== ivLength * 2) {
    throw new Error("Invalid IV length");
  }
  const iv = ivString ? Buffer.from(ivString, "hex") : null;
  if (!iv) {
    throw new Error("Invalid IV");
  }

  // @ts-expect-error: Suppressing TypeScript error for createDecipheriv
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = encrypted ? decipher.update(encrypted, "hex", "utf8") : "";
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { decrypt, encrypt };
