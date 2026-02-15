export interface ThreatDisplayProps {
  data: {
    results: any[];
    aiAssessment: {
      threatLevel: "low" | "medium" | "high" | "extreme";
      summary: string;
      analysis: string;
      verdict: string;
    };
    stats: {
      totalLinks: number;
      riskLevel: string;
    };
  };
}

// --- Technical Report Types ---

export interface VTReport {
  url: string;
  malicious: number;
  suspicious: number;
  harmless: number;
  totalEngines: number;
  isFlagged: boolean;
  error?: string; // For cases where VT returns 404 or fails
}

export interface DomainAgeReport {
  domain: string;
  ageInDays: number | null;
  creationDate: string | null;
  isNew: boolean;
}

export interface LinkAnalysis {
  url: string;
  vtReport: VTReport;
  domainReport: DomainAgeReport | null;
  isTechnicalRisk: boolean;
}

// --- AI Analysis Types ---

export interface AIAssessment {
  threatLevel: "low" | "medium" | "high" | "extreme";
  summary: string;
  analysis: string;
  verdict: string;
}

// --- Main API Response Type ---

export interface AnalysisResponse {
  success: boolean;
  results: LinkAnalysis[];
  aiAssessment: AIAssessment;
  stats: {
    totalLinks: number;
    analyzedLinks: number;
    riskLevel: string;
  };
}