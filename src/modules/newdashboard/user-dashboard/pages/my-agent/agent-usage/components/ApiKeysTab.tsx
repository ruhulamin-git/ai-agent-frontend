"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface ApiKeysTabProps {
  agentId: number;
}

export const ApiKeysTab = ({ agentId: _agentId }: ApiKeysTabProps) => {
  // Mock API keys (should come from API in production)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      key: "ak_live_1234567890abcdef",
      name: "Production Key",
      created: "2024-01-15",
      lastUsed: "2024-01-20",
    },
  ]);

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("API key copied to clipboard!");
    } catch (_error) {
      toast.error("Failed to copy API key");
    }
  };

  const handleGenerateKey = () => {
    toast.info("API key generation coming soon!");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-100 dark:bg-gray-900/40 backdrop-blur-sm border border-gray-300 dark:border-gray-800/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
            <span>API Keys</span>
            <button
              onClick={handleGenerateKey}
              className="px-3 py-1.5 text-sm font-medium rounded bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 text-gray-900 dark:text-white transition-colors"
            >
              + Generate New Key
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use these API keys to authenticate requests to your agent. Keep them secure and never
            share them publicly.
          </p>

          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>No API keys yet. Generate one to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-800 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-medium">{apiKey.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="px-3 py-1.5 text-sm font-medium rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {apiKey.key}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 backdrop-blur-sm border border-yellow-300 dark:border-yellow-700/50">
        <CardHeader>
          <CardTitle className="text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
            <span>⚠️</span> Security Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800 dark:text-yellow-200 text-sm space-y-2">
          <p>• Never commit API keys to version control</p>
          <p>• Don&apos;t expose API keys in client-side code</p>
          <p>• Rotate keys regularly for security</p>
          <p>• Use environment variables to store keys</p>
        </CardContent>
      </Card>
    </div>
  );
};
