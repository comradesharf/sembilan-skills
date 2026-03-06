import { EventSchemas, Inngest, type InngestFunction } from "inngest";
import * as z from "zod";
import { Log } from "@/registry/base-mira/fullstack/lib/logger";

export const inngest = new Inngest({
  id: process.env.INNGEST_ACCOUNT_ID || "development",
  logger: Log,
  schemas: new EventSchemas().fromSchema({
    "app/user.created": z.object({
      user: z.string(),
    }),
    "app/user.updated": z.object({
      user: z.string(),
    }),
    "app/user.email.verify-new-requested": z.object({
      user: z.string(),
      newEmail: z.string(),
      url: z.string(),
    }),
    "app/user.email.verify-requested": z.object({
      user: z.string(),
      url: z.string(),
    }),
    "app/otp.requested": z.object({
      user: z.string(),
      otp: z.string(),
    }),
    "app/password.reset-requested": z.object({
      user: z.string(),
      url: z.string(),
    }),
  }),
});

export function createFunctions(
  ...args: Record<string, InngestFunction.Like>[]
): InngestFunction.Like[] {
  return args.flatMap((a) => Object.values(a));
}
