export const SESSION_TTL = -1;

import { z } from "zod";

export const nameFormat = z.custom<string>((val) => {
  return typeof val === "string" && val.length > 3 && val.length < 20 // allows string of length 4
    && /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]+$/.test(val) // regex for alphanumeric and _- (allows _- only if there is at least one alphanumeric character)
});

export const codeFormat = z.custom<string>((val) => {
    return typeof val === "string" && val.length > 5 && /[a-z]-[a-z]-[a-z]/.test(val);
});

const codeSchema = z.union([
    z.object({
    code: codeFormat,
    isQuest: z.literal(true),
    expires: z.coerce.date().optional().nullable(),
    questId: z.number().int().positive(),
    description: z.string().optional().nullable(),
}),
z.object({
    code: codeFormat,
    isQuest: z.literal(false),
    points: z.number().int().positive().default(1),
    expires: z.coerce.date().optional().nullable(),
})
])

    

export const questSchema = z.object({
  title: z.string().min(1, "Title is required"),
  img: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  lore: z.string().optional().nullable(),
  global: z.boolean().default(true),
  points: z.number().int().positive().default(1),
  starts: z.coerce.date().optional().nullable(),
  ends: z.coerce.date().optional().nullable(),
}).refine(data => !data.starts || !data.ends || data.starts < data.ends, {
  message: "End date must be after start date",
  path: ["ends"],
});

export type QuestInput = z.infer<typeof questSchema>;

export const constraints = {
  name: nameFormat,
  mail: z.string().email(),
};