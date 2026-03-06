import * as auth from "@/registry/base-mira/fullstack/lib/auth.inngest";
import { createFunctions } from "@/registry/base-mira/fullstack/lib/inngest";

export const functions = createFunctions(auth);
