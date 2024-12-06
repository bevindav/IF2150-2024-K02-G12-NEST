import cron from "node-cron";
import { checkDeadlinesAndGenerateNotifications } from "@/utils/checkDeadlinesAndGenerateNotifications";

console.log("Starting cron jobs123...");

cron.schedule("* * * * *", async () => {
  console.log("Running notification checktes...");
  await checkDeadlinesAndGenerateNotifications();
});
