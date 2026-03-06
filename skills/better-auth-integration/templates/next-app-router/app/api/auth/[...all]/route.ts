import { toNextJsHandler } from "better-auth/next-js";
import auth from "@/src/lib/auth.utils";

export const { POST, GET } = toNextJsHandler(auth);
