import { randomBytes } from "crypto";

// 4 first characters are random, 11 next characters are the date it was generated, last characters are the user id in hex
export function generateSession(id: string) {
  return `${randomBytes(2)
    .toString("hex")
    .padStart(5, "0")}${Date.now().toString(16)}${id
    .split("")
    .map((c) => c.charCodeAt(0).toString(16))
    .join("")}`;
}
