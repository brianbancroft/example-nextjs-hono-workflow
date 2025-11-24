"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [response, setResponse] = useState<{
    success: boolean;
    error: string | null;
  } | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setProgress(30);
    setMessages([]);
    setResponse(null);

    try {
      const res = await fetch("/api/stream", {
        method: "GET",
      });

      if (!res.ok || !res.body) {
        setProgress(100);
        setResponse({
          success: false,
          error: `HTTP error! status: ${res.status}`,
        });
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setProgress(100);
          setResponse({
            success: true,
            error: null,
          });
          setLoading(false);
          break;
        }

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          setMessages((prev) => [...prev, line]);
        }
      }
    } catch (error) {
      setProgress(100);
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="flex flex-col items-center gap-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
          API Test Demo
        </h1>

        <button
          onClick={handleClick}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 py-4 text-white font-semibold text-lg transition-all hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[200px]"
        >
          {loading && (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          )}
          {loading ? "Streaming..." : "Stream Hello World"}
        </button>

        {(messages.length > 0 || response) && (
          <div
            className={`w-full p-6 rounded-lg border-2 ${
              response?.success === false
                ? "bg-red-50 border-red-500 dark:bg-red-950/30 dark:border-red-700"
                : response?.success === true
                ? "bg-green-50 border-green-500 dark:bg-green-950/30 dark:border-green-700"
                : "bg-blue-50 border-blue-500 dark:bg-blue-950/30 dark:border-blue-700"
            }`}
          >
            <h2 className="text-xl font-semibold mb-3 text-black dark:text-zinc-50">
              Stream Response
            </h2>
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-black p-3 rounded border border-gray-300 dark:border-gray-700 animate-[fadeIn_0.3s_ease-in]"
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-mono">
                    {msg}
                  </p>
                </div>
              ))}
            </div>
            {response && response.error && (
              <div className="mt-4 text-red-800 dark:text-red-300">
                <p className="font-medium mb-2">Error:</p>
                <p className="bg-white dark:bg-black p-3 rounded border border-red-300 dark:border-red-800">
                  {response.error}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="w-full">
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
