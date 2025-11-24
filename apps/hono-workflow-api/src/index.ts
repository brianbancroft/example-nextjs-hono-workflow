import { Hono } from "hono";
import { stream } from "hono/streaming";
import { start } from "workflow/api";
import { morningRoutineWorkflow } from "../workflows/morning-routine.js";

const app = new Hono();

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

app.get("/helloworld", (c) => {
  return c.json({ hello: "world" });
});

app.get("/helloworld-stream", (c) => {
  return stream(c, async (stream) => {
    // Open stream
    await stream.writeln("Stream opened");
    await stream.sleep(500);

    // Send response
    await stream.writeln(JSON.stringify({ hello: "world" }));
    await stream.sleep(500);

    // Close stream
    await stream.writeln("Stream closed");
  });
});

app.get("/workflow-stream", async (c) => {
  const run = await start(morningRoutineWorkflow);

  // Transform the stream to encode JSON objects as text
  const textStream = run.readable.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        const text = JSON.stringify(chunk) + "\n";
        controller.enqueue(new TextEncoder().encode(text));
      },
    })
  );

  // Return the readable stream to the client
  return new Response(textStream, {
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
    },
  });
});

export default app;
