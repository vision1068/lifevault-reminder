import type { Config } from "@netlify/functions";
import { processDueEmailReminders } from "../../src/lib/email-reminders-core";

const handler = async () => {
  const result = await processDueEmailReminders();
  console.log("Scheduled email reminder run complete", result);
};

export default handler;

export const config: Config = {
  schedule: "*/5 * * * *"
};
