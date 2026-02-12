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
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
interface AnalysisResult {
  url: string;
  domain: string;
}
export default function Home() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult[] | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setResult(data.matches);
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
      {result && (
        <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Analysis Result</CardTitle>
            <CardDescription>
              Detected URLs and their domains.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.length > 0 ? (
              result.map((item, index) => (
                <div key={index} className="p-3 bg-slate-800 rounded">
                  <p className="text-sm text-slate-300">{item.url}</p>
                  <p className="text-xs text-slate-500">{item.domain}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-green-500">No URLs detected. Message looks clean!</p>
            )}
          </CardContent>
        </Card>
      )}
      {/* Footer Disclaimer */}
      <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest">
        Stateless Processing • No Data Stored
      </p>
    </main>
  );
}
