import * as z from "zod";
import { Timezones } from "@/registry/base-mira/fullstack/lib/timezones";

const EmailSchema = z
  .email("Invalid email")
  .trim()
  .max(255)
  .nonempty("Email is required");

export const PasswordSchema = z
  .string()
  .max(255)
  .min(
    8,
    "Password must be at least 8 characters with a number, a lowercase character, and an uppercase character.",
  )
  .regex(/[0-9]/, "Password must have at least 1 digit")
  .regex(/[a-z]/, "Password must have at least 1 lowercase character")
  .regex(/[A-Z]/, "Password must have at least 1 uppercase character")
  .nonempty("Password is required");

export const RegisterInputSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: EmailSchema,
    password: PasswordSchema,
    repeatPassword: PasswordSchema,
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["repeatPassword"],
      });
    }
  });

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const LoginInputSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const OnboardInputSchema = z.object({
  locale: z.string().min(2).max(10),
  timezone: z.enum(Timezones),
});

export type OnboardInput = z.infer<typeof OnboardInputSchema>;
