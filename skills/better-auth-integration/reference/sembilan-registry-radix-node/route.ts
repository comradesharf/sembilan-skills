import { toNextJsHandler } from "better-auth/next-js";
import auth from "@/registry/base-mira/fullstack/lib/auth.utils";

export const { POST, GET } = toNextJsHandler(auth);
