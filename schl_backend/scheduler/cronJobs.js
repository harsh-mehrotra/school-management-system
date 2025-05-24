import cron from 'node-cron';
import Status from '../model/statusModel.js';

cron.schedule("27 11 * * *", async () => {
    console.log("Running 11:15 AM task: Updating 'In Class' student statuses to 'Parent not came yet'");

    try {
        await Status.updateMany({ status: "In Class" }, { status: "Parent not came yet" });
        console.log("Updated all 'In Class' students to 'Parent not came yet'.");
    } catch (error) {
        console.error("Error updating student statuses:", error);
    }
});


cron.schedule("0 0 * * *", async () => {
    console.log("Running 12:00 AM task: Updating student statuses to 'Absent'");

    try {
        await Status.updateMany({}, { status: "Absent" });
        console.log("All student statuses marked as 'Absent'.");
    } catch (error) {
        console.error("Error updating student statuses:", error);
    }
});

export default cron;