"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import ThreatDisplay from "@/components/ThreatDisplay";
import { AnalysisResponse } from "@/lib/types";
import { analyzeEmail } from "@/lib/api";
export default function Home() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await analyzeEmail(content);
      if (response.success) {
        setResult(response);
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch (error) {
      console.error("Error analyzing content:", error);
    } finally {
      setLoading(false);
      setError(null);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-950 text-slate-50">
      {/* Header Section */}
      {/* error message */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}  
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-blue-600/20 p-3 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-blue-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Fish-the-Phish
        </h1>
        <p className="text-slate-400 mt-2 max-w-md">
          Professional-grade phishing detection. Paste any message below to
          analyze links, intent, and sender identity.
        </p>
      </div>

      {/* Main Analysis Card */}
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Scan Center</CardTitle>
          <CardDescription>
            Paste the email body, SMS, or message content here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'Your account will be suspended. Click here to verify...'"
            className="min-h-50 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-6 text-lg"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Message"
            )}
          </Button>
        </CardContent>
      </Card>
      {/* result  */}
      {result && <ThreatDisplay data={result} />}
      
      {/* Footer Disclaimer */}
      <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest">
        Stateless Processing • No Data Stored
      </p>
    </main>
  );
}
