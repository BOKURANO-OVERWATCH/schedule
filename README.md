# @bokurano/schedule

### Super lightweight/strict schedule runner

`@bokurano/schedule` is a lightweight task scheduling utility for JavaScript/TypeScript environments.It internally uses a fixed interval loop (default: 100ms) to check for due tasks and automatically executes them at the correct time.

## Installation

```bash
npm install @bokurano/schedule
# or
bun install @bokurano/schedule
```

## Usage

```typescript
import { Schedule } from "./Schedule";

const scheduler = new Schedule();

scheduler.schedule("<unique-key>", async () => {
  console.log("Good morning!");
}, "0 9 * * *");

scheduler.scheduleAfterDelay("<unique-key>", () => {
  console.log("Executed after 5 seconds");
}, 5000);

const date = new Date("2025-06-01T12:00:00");
scheduler.scheduleAt("<unique-key>", () => {
  console.log("Time for the meeting!");
}, date)
```
