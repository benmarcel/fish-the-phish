import { NextResponse } from "next/server";
import { extractUrls } from "@/lib/scanner";
import { getDomain } from "@/lib/utils";
import { checkUrlReputation } from "@/lib/detectors/vt-check";
import { checkDomainAge } from "@/lib/detectors/whois-check";
import { analyzeWithAI } from "@/lib/detectors/ai-agent"; // Make sure this is created!

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const urls = extractUrls(content);
    const suspectUrls = urls.slice(0, 5); 

    const reportResults = [];

    // Technical Analysis Loop
    for (const url of suspectUrls) {
      const domain = getDomain(url);
      
      const [vtReport, domainReport] = await Promise.all([
        checkUrlReputation(url),
        domain ? checkDomainAge(domain) : Promise.resolve(null)
      ]);

      // Calculate a quick technical risk score for this specific link
      const isTechnicalRisk = vtReport?.isFlagged || (domainReport?.isNew ?? false);

      reportResults.push({ 
        url, 
        vtReport, 
        domainReport,
        isTechnicalRisk 
      });
    }

    // AI Intelligence Layer
    // We pass the email text AND our technical findings to the AI
    const aiAssessment = await analyzeWithAI(content, reportResults);

    // Final Response
    return NextResponse.json({ 
      success: true, 
      results: reportResults,
      aiAssessment: aiAssessment, // The "Brain" assessment
      stats: {
        totalLinks: urls.length,
        analyzedLinks: suspectUrls.length,
        riskLevel: aiAssessment?.threatLevel || "unknown"
      }
    });

  } catch (error) {
    console.error("Error analyzing content:", error);
    return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 });
  }
}