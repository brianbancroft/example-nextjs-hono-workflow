"use client";

import { useState } from "react";
import { fetchHelloWorld } from "./actions";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState<{
    success: boolean;
    data: any;
    error: string | null;
  } | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setProgress(30);
    setResponse(null);

    const result = await fetchHelloWorld();

    setProgress(100);
    setResponse(result);
    setLoading(false);
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
          {loading ? "Loading..." : "Fetch Hello World"}
        </button>

        {response && (
          <div
            className={`w-full p-6 rounded-lg border-2 ${
              response.success
                ? "bg-green-50 border-green-500 dark:bg-green-950/30 dark:border-green-700"
                : "bg-red-50 border-red-500 dark:bg-red-950/30 dark:border-red-700"
            }`}
          >
            <h2 className="text-xl font-semibold mb-3 text-black dark:text-zinc-50">
              Response Status
            </h2>
            {response.success ? (
              <div className="text-green-800 dark:text-green-300">
                <p className="font-medium mb-2">Success!</p>
                <pre className="bg-white dark:bg-black p-3 rounded border border-green-300 dark:border-green-800 overflow-auto">
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-red-800 dark:text-red-300">
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
