import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkDeadlinesAndGenerateNotifications() {
  try {
    const now = new Date();

    // Fetch all projects and tasks
    const projects = await prisma.project.findMany();
    const tasks = await prisma.task.findMany({
      include: { project: true },
    });
    console.log("Fetched tasks:", tasks);

    const notifications: any[] = [];

    // Check deadlines for projects
    for (const project of projects) {
      const timeLeft = project.deadline.getTime() - now.getTime();

      if (timeLeft <= 0) continue; // Skip if deadline is already passed

      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const daysLeft = Math.floor(hoursLeft / 24);
      console.log("Project Jam", hoursLeft);
      console.log("Project Hari", daysLeft);

      if (daysLeft === 3 || daysLeft === 1 || hoursLeft === 2) {
        const timeLeftString = `${
          daysLeft > 0 ? `Day-${daysLeft}` : `Hour-${hoursLeft}`
        }`;

        // Check if a notification already exists for this project and timeLeft
        const existingNotification = await prisma.notification.findFirst({
          where: {
            projectId: project.id,
            timeLeft: timeLeftString,
          },
        });

        if (existingNotification) {
          console.log(
            `Notification already exists for project "${project.title}" with timeLeft "${timeLeftString}"`
          );
          continue; // Skip creating the duplicate notification
        }

        const message = `Project "${project.title}" ${timeLeftString} Left until deadline`;
        notifications.push({
          message,
          type: "project",
          timeLeft: timeLeftString,
          projectId: project.id,
        });
      }
    }
    console.log("Task processing");
    // Check deadlines for tasks
    for (const task of tasks) {
      const timeLeft = task.deadline.getTime() - now.getTime();
      console.log("TIMELEFT Task", timeLeft);
      if (timeLeft <= 0) continue; // Skip if deadline is already passed

      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const daysLeft = Math.floor(hoursLeft / 24);
      console.log("Task Jam", hoursLeft);
      console.log("Task Hari", daysLeft);

      if (daysLeft === 3 || daysLeft === 1 || hoursLeft === 2) {
        const timeLeftString = `${
          daysLeft > 0 ? `Day-${daysLeft}` : `Hour-${hoursLeft}`
        }`;

        // Check if a notification already exists for this task and timeLeft
        const existingNotification = await prisma.notification.findFirst({
          where: {
            taskId: task.id,
            timeLeft: timeLeftString,
          },
        });

        if (existingNotification) {
          console.log(
            `Notification already exists for task "${task.title}" in project "${task.project.title}" with timeLeft "${timeLeftString}"`
          );
          continue; // Skip creating the duplicate notification
        }

        const message = `Task "${task.title}" in Project "${task.project.title}" ${timeLeftString} Left until deadline`;
        notifications.push({
          message,
          type: "task",
          timeLeft: timeLeftString,
          projectId: task.projectId,
          taskId: task.id,
        });
      }
    }

    // Save notifications to the database (if there are new notifications)
    if (notifications.length > 0) {
      await prisma.notification.createMany({ data: notifications });
      console.log("Notifications generated successfully123!");
    } else {
      console.log("Kosong");
    }
  } catch (error) {
    console.error("Error generating notifications:", error);
  } finally {
    await prisma.$disconnect();
  }
}
