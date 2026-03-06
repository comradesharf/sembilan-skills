import { serve } from "inngest/next";
import { functions } from "@/server/inngest/_app.inngest";
import { inngest } from "@/server/inngest/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
