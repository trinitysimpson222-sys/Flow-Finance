"use client";

import { useState } from "react";
import { LinkIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface SimpleFINConnectProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function SimpleFINConnect({ onSuccess, onCancel }: SimpleFINConnectProps) {
  const [setupToken, setSetupToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/simplefin/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupToken: setupToken.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to connect");

      setResult(data);
      setTimeout(() => onSuccess(), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Connect via SimpleFIN</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {result?.success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">✓ Connected {result.accounts?.length || 0} account(s)!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="font-medium text-blue-800 mb-1">Get your Setup Token:</p>
            <ol className="text-blue-700 list-decimal list-inside space-y-1">
              <li>Visit <a href="https://bridge.simplefin.org/simplefin/create" target="_blank" className="underline">SimpleFIN Bridge</a></li>
              <li>Connect your bank</li>
              <li>Copy the token and paste below</li>
            </ol>
          </div>

          <textarea
            value={setupToken}
            onChange={(e) => setSetupToken(e.target.value)}
            placeholder="Paste your SimpleFIN setup token..."
            rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
            disabled={isLoading}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !setupToken.trim()}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? "Connecting..." : <><LinkIcon className="w-4 h-4" /> Connect</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
