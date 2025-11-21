"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  // Search state
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add attempt state
  const [addEmail, setAddEmail] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

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

  const handleAddAttempt = async () => {
    if (!addEmail || !moduleId || !timestamp) {
      setAddError("Please fill in all fields");
      return;
    }

    setAddLoading(true);
    setAddError(null);
    setAddSuccess(false);

    try {
      const { error } = await supabase.rpc("add_plp_attempts", {
        email: addEmail,
        module: parseInt(moduleId),
        time_stamp: new Date(timestamp).toISOString()
      });

      if (error) throw error;

      setAddSuccess(true);
      // Reset form
      setAddEmail("");
      setModuleId("");
      setTimestamp("");
      
      // Hide success message after 3 seconds
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAddError(err.message);
      } else {
        setAddError("An unknown error occurred");
      }
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-16">
      {/* Search Section */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">Remote Procedure Call</h1>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Search by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 bg-red-50 p-4 rounded-md w-full text-center">
            Error: {error}
          </div>
        )}

        {results && (
          <div className="w-full">
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
      </div>

      {/* Add Attempt Section */}
      <div className="w-full max-w-sm flex flex-col gap-6 border p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-center">Add Attempt</h2>
        
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="add-email">Email</Label>
            <Input 
              id="add-email" 
              type="email"
              placeholder="user@example.com"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="module">Module ID</Label>
            <Input 
              id="module" 
              type="number"
              placeholder="123"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="timestamp">Timestamp</Label>
            <Input 
              id="timestamp" 
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="block"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={handleAddAttempt} disabled={addLoading} className="w-full">
            {addLoading ? "Adding..." : "Add Attempt"}
          </Button>
          
          {addSuccess && (
            <div className="text-center text-2xl animate-in fade-in zoom-in duration-300">
              ✅
            </div>
          )}
          
          {addError && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {addError}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
