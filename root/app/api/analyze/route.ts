import { NextResponse } from "next/server";
import { extractUrls } from "@/lib/scanner";
import { getDomain } from "@/lib/utils";
import { checkUrlReputation } from "@/lib/detectors/vt-check";
import { checkDomainAge } from "@/lib/detectors/whois-check";
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
const domain = getDomain(url);
  
  // Run both checks in parallel for speed
  const [vtReport, domainReport] = await Promise.all([
    checkUrlReputation(url),
    domain ? checkDomainAge(domain) : Promise.resolve(null)
  ]);
  reportResults.push({ url, vtReport, domainReport });
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
