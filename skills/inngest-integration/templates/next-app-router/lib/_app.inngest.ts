import * as auth from "@/server/inngest/auth.inngest";
import { createFunctions } from "@/server/inngest/inngest";

export const functions = createFunctions(auth);
