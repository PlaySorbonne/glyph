export const SESSION_TTL = -1;

import { z } from "zod";

export const nameFormat = z.custom<string>(
  (val) => {
    return (
      typeof val === "string" &&
      val.length > 3 &&
      val.length < 20 && // allows string of length 4
      /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]+$/.test(val)
    ); // regex for alphanumeric and _- (allows _- only if there is at least one alphanumeric character)
  },
  {
    message:
      "Le nom doit contenir entre 4 et 20 caractères alphanumériques et ne contenir que des lettres, des chiffres, des tirets et des underscores.",
  }
);

export const codeFormat = z
  .string()
  .min(3)
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      "Le code ne peut contenir que des lettres, des chiffres, des tirets et des underscores. et avoir une longueur minimale de 3 caractères.",
  });

export const codeSchema = z.object({
  code: codeFormat,
  isQuest: z.boolean().default(false),
  expires: z.coerce.date().optional().nullable(),
  questId: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  points: z.number().int().default(1).optional().nullable(),
});

export const questSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    img: z.string().url().optional().nullable(),
    description: z.string().optional().nullable(),
    lore: z.string().optional().nullable(),
    global: z.boolean().default(true),
    points: z.number().int().positive().default(1),
    starts: z.coerce.date().optional().nullable(),
    ends: z.coerce.date().optional().nullable(),
  })
  .refine((data) => !data.starts || !data.ends || data.starts < data.ends, {
    message: "End date must be after start date",
    path: ["ends"],
  });

export type QuestInput = z.infer<typeof questSchema>;

export const constraints = {
  name: nameFormat,
};

export const userSchema = z.object({
  name: nameFormat.optional().nullable(),
  displayName: z.string().min(1).max(20).nullable().optional(),
  email: z.string().email().nullable().optional(),
  emailVerified: z.boolean().default(false).optional(),
  image: z.string().url().nullable().optional(),
  isAdmin: z.boolean().default(false).optional(),
  score: z.coerce.number().int().nonnegative().default(0).optional(),
  fraternityId: z.coerce.number().int().positive().max(2).nullable().optional(),
});

export type UserInput = z.infer<typeof userSchema>;

export const fraternitySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
});
