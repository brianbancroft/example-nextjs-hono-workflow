import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { stream } from "hono/streaming";

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

const port = 4000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
