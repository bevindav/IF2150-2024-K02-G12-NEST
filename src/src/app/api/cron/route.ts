import { checkDeadlinesAndGenerateNotifications } from "@/utils/checkDeadlinesAndGenerateNotifications";

export async function POST() {
  try {
    await checkDeadlinesAndGenerateNotifications();
    return new Response(
      JSON.stringify({ message: "Notifications generated successfully!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating notifications:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate notifications" }),
      { status: 500 }
    );
  }
}
