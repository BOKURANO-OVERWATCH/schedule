import { Schedule } from "./src/index";

const schedule = new Schedule();
console.log(`[${new Date().toISOString()}] Starting up`);

// Schedule a task to run every minute
schedule.schedule(
    "every-minute",
    () => {
        console.log(`[${new Date().toISOString()}] Task running every minute`);
    },
    "* * * * *"
);

// Schedule a one-off task to run once after a 5-second delay
schedule.scheduleAfterDelay(
    "after-delay",
    () => {
        console.log(`[${new Date().toISOString()}] Task executed once after 5 seconds`);
    },
    5000
);

// Schedule a one-off task at a specific time (10 seconds from now)
schedule.scheduleAt(
    "at-specific-time",
    () => {
        console.log(`[${new Date().toISOString()}] Task executed at the specific time`);
    },
    new Date(Date.now() + 10000)
);

// You can even use a Symbol as the key
schedule.scheduleAfterDelay(
    Symbol("unique-task"),
    () => {
        console.log(`[${new Date().toISOString()}] You can also use a Symbol as the key`);
    },
    15000
);

// Cancel the every-minute task after 3 minutes
setTimeout(
    () => {
        console.log("Cancel: removing the every-minute task");
        schedule.cancel("every-minute");
    },
    3 * 60 * 1000
);

// Clean up on process termination
process.on("SIGINT", () => {
    console.log("Shutting down...");
    schedule.destroy();
    process.exit();
});
