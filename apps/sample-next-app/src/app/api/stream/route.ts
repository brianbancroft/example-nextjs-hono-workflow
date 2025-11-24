export async function GET() {
  try {
    const response = await fetch("http://localhost:4050/helloworld-stream", {
      method: "GET",
    });

    if (!response.ok || !response.body) {
      return new Response(
        JSON.stringify({ error: `HTTP error! status: ${response.status}` }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the stream directly
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
