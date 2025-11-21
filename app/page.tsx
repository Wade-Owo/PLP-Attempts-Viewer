"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!email) return;
    
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const { data, error } = await supabase.rpc("get_plp_attempts", { email });
      
      if (error) throw error;
      
      setResults(data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-8">
      <h1 className="text-4xl font-bold">Remote Procedure Call</h1>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          Error: {error}
        </div>
      )}

      {results && (
        <div className="w-full max-w-4xl mt-8">
          {results.length === 0 ? (
            <p className="text-center text-muted-foreground">No results found.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    {Object.keys(results[0]).map((key) => (
                      <th key={key} className="p-4 font-medium">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      {Object.values(row).map((value: unknown, j) => (
                        <td key={j} className="p-4">
                          {typeof value === 'object' && value !== null 
                            ? JSON.stringify(value) 
                            : String(value)
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
