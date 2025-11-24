import { getWritable, sleep } from "workflow";

type ProgressUpdate = {
  message: string;
  percentage: number;
  status: string;
};

async function updateProgress(message: string, percentage: number) {
  "use step";

  const writable = getWritable<ProgressUpdate>();
  const writer = writable.getWriter();

  await writer.write({
    message,
    percentage,
    status: "in-progress",
  });

  writer.releaseLock();
}

async function sendCompletion() {
  "use step";

  const writable = getWritable<ProgressUpdate>();
  const writer = writable.getWriter();

  await writer.write({
    message: "Demo complete",
    percentage: 100,
    status: "complete",
  });

  writer.releaseLock();
}

async function closeStream() {
  "use step";

  await getWritable().close();
}

export async function morningRoutineWorkflow() {
  "use workflow";

  // Task 1: Opening connection (0% -> 16.67%)
  await updateProgress("Opening connection", 16.67);
  await sleep("3s");

  // Task 2: Brewing coffee (16.67% -> 33.33%)
  await updateProgress("Brewing coffee", 33.33);
  await sleep("5s");

  // Task 3: Stretching (33.33% -> 50%)
  await updateProgress("Stretching", 50);
  await sleep("4s");

  // Task 4: Browsing the news (50% -> 66.67%)
  await updateProgress("Browsing the news", 66.67);
  await sleep("6s");

  // Task 5: Opening the computer (66.67% -> 83.33%)
  await updateProgress("Opening the computer", 83.33);
  await sleep("3s");

  // Task 6: Sending response (83.33% -> 100%)
  await updateProgress("Sending response", 100);
  await sleep("8s");

  // Final completion message
  await sendCompletion();

  // Close the stream
  await closeStream();

  return { status: "complete" };
}
