import { CronExpressionParser } from "cron-parser";

type TaskKey = string | symbol;

type ScheduleTask = () => Promise<void> | void;

interface ScheduledTaskEntry {
    task: ScheduleTask;
    runAt: number;
    parser?: ReturnType<typeof CronExpressionParser.parse>;
}

export class Schedule {
    private readonly intervalTimer: NodeJS.Timeout;
    private readonly queue = new Map<TaskKey, ScheduledTaskEntry>();
    private isConsuming = false;

    constructor(private readonly INTERVAL_MS = 100) {
        this.intervalTimer = setInterval(() => {
            if (this.isConsuming) {
                return;
            }
            this.isConsuming = true;
            this.processDueTasks()
                .catch((err) => {
                    throw new Error(`Unexpected error in consume loop: ${err}`);
                })
                .finally(() => {
                    this.isConsuming = false;
                });
        }, this.INTERVAL_MS);
    }

    private async processDueTasks(): Promise<void> {
        const now = Date.now();
        const tasks = Array.from(this.queue.entries());
        const promises = tasks.flatMap(([key, entry]) => {
            if (entry.runAt <= now) {
                if (entry.parser) {
                    const nextDate = entry.parser.next();
                    entry.runAt = nextDate.getTime();
                } else {
                    this.queue.delete(key);
                }
                return [entry.task()];
            }
            return [];
        });

        await Promise.allSettled(promises);
    }

    schedule(key: TaskKey, task: ScheduleTask, expression: string): void {
        const parser = CronExpressionParser.parse(expression);
        const nextDate = parser.next();
        this.queue.set(key, {
            task,
            parser,
            runAt: nextDate.getTime(),
        });
    }

    scheduleAfterDelay(key: TaskKey, task: ScheduleTask, delayMs: number): void {
        this.queue.set(key, {
            task,
            runAt: Date.now() + delayMs,
        });
    }

    scheduleAt(key: TaskKey, task: ScheduleTask, time: Date): void {
        this.queue.set(key, {
            task,
            runAt: time.getTime(),
        });
    }

    has(key: TaskKey): boolean {
        return this.queue.has(key);
    }

    cancel(key: TaskKey): void {
        this.queue.delete(key);
    }

    cancelAll(): void {
        this.queue.clear();
    }

    destroy(): void {
        this.queue.clear();
        clearInterval(this.intervalTimer);
    }
}
