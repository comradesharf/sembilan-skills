import { render } from "@react-email/components";
import { eq } from "drizzle-orm";
import { NonRetriableError } from "inngest";
import ChangeEmail from "@/registry/base-mira/fullstack/emails/change-email";
import EmailVerification from "@/registry/base-mira/fullstack/emails/email-verification";
import ResetPassword from "@/registry/base-mira/fullstack/emails/reset-password";
import VerifyOtp from "@/registry/base-mira/fullstack/emails/verify-otp";
import { users } from "@/registry/base-mira/fullstack/lib/auth.db";
import db from "@/registry/base-mira/fullstack/lib/db";
import { sendMail } from "@/registry/base-mira/fullstack/lib/emails";
import { inngest } from "@/registry/base-mira/fullstack/lib/inngest";

export const sendUserEmailChangeVerification = inngest.createFunction(
  { id: "send-user-email-change-verification" },
  { event: "app/user.email.verify-new-requested" },
  async ({ step, event }) => {
    await step.run("send-user-email-change-verification", async () => {
      const { user: userId, newEmail, url } = event.data;

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new NonRetriableError("User not found");
      }

      await sendMail({
        to: user.email,
        subject: "Confirm your new email address",
        from: process.env.SMTP_FROM,
        html: await render(
          ChangeEmail({
            name: user.name,
            url,
            newEmail,
          }),
        ),
      });
    });
  },
);

export const sendUserEmailVerification = inngest.createFunction(
  { id: "send-user-email-verification" },
  { event: "app/user.email.verify-requested" },
  async ({ step, event }) => {
    await step.run("send-user-email-verification", async () => {
      const { user: userId, url } = event.data;

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new NonRetriableError("User not found");
      }

      await sendMail({
        to: user.email,
        subject: "Verify your email address",
        from: process.env.SMTP_FROM,
        html: await render(
          EmailVerification({
            name: user.name,
            url,
          }),
        ),
      });
    });
  },
);

export const sendUserOtp = inngest.createFunction(
  { id: "send-user-otp" },
  { event: "app/otp.requested" },
  async ({ step, event }) => {
    await step.run("send-user-otp", async () => {
      const { user: userId, otp } = event.data;

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new NonRetriableError("User not found");
      }

      await sendMail({
        to: user.email,
        subject: "Your verification code",
        from: process.env.SMTP_FROM,
        html: await render(
          VerifyOtp({
            name: user.name,
            code: otp,
          }),
        ),
      });
    });
  },
);

export const sendPasswordResetEmail = inngest.createFunction(
  { id: "send-password-reset-email" },
  { event: "app/password.reset-requested" },
  async ({ step, event }) => {
    await step.run("send-password-reset-email", async () => {
      const { user: userId, url } = event.data;

      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new NonRetriableError("User not found");
      }

      await sendMail({
        to: user.email,
        subject: "Reset your password",
        from: process.env.SMTP_FROM,
        html: await render(
          ResetPassword({
            name: user.name,
            url,
          }),
        ),
      });
    });
  },
);
