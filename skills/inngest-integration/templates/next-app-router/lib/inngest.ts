import { EventSchemas, Inngest, type InngestFunction } from "inngest";
import * as z from "zod";

export const inngest = new Inngest({
  id: process.env.INNGEST_ACCOUNT_ID || "development",
  schemas: new EventSchemas().fromSchema({
    "app/user.created": z.object({
      userId: z.string(),
    }),
    "app/user.email.verify-requested": z.object({
      userId: z.string(),
      email: z.string().email(),
      url: z.string(),
    }),
  }),
});

export function createFunctions(
  ...groups: Record<string, InngestFunction.Like>[]
): InngestFunction.Like[] {
  return groups.flatMap((group) => Object.values(group));
}
