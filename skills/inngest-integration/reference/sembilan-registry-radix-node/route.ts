import { serve } from "inngest/next";
import { functions } from "@/registry/base-mira/fullstack/lib/_app.inngest";
import { inngest } from "@/registry/base-mira/fullstack/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
