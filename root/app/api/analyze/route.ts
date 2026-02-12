import { NextResponse } from "next/server";
import { extractUrls } from "@/lib/scanner";
import { getDomain } from "@/lib/utils";
import { checkUrlReputation } from "@/lib/detectors/vt-check";
export async function POST(request: Request) {
  try {
    // Parse the incoming request body as JSON
  const body = await request.json();
  //   Extract the 'content' field from the request body
  const { content } = body;
  //   validate that content is provided
  if (!content) {
    return NextResponse.json({ error: "No content provided" }, { status: 400 });
  }
  //   Use the extractUrls function to find all URLs in the content
  const urls = extractUrls(content);
 

  // We limit to the first 5 links for now to avoid hitting API limits
const suspectUrls = urls.slice(0, 5); 
 // map over the extracted URLs to analyze their domains using the getDomain function
  const domainAnalysis = suspectUrls.map((url) => ({
    url,
    domain: getDomain(url),
  }));
const reportResults = [];
for (const url of suspectUrls) {
  const report = await checkUrlReputation(url);
  reportResults.push(report);
}
console.log(reportResults)
return NextResponse.json({ 
  success: true, 
  results: reportResults,
  matches: domainAnalysis
});
  } catch (error) {
    console.error("Error analyzing content:", error);
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 });
  }
}
