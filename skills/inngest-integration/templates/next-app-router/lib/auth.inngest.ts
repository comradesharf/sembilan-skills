import { NonRetriableError } from "inngest";
import { inngest } from "@/server/inngest/inngest";

export const sendUserEmailVerification = inngest.createFunction(
  { id: "send-user-email-verification" },
  { event: "app/user.email.verify-requested" },
  async ({ step, event }) => {
    await step.run("send-user-email-verification", async () => {
      const { userId, email, url } = event.data;

      if (!userId || !email || !url) {
        throw new NonRetriableError("Missing verification payload data");
      }

      // Replace this with your real mailer call.
      console.log("Send verification email", { userId, email, url });
    });
  },
);
