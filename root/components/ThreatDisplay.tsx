import React from "react";
import { 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  Calendar, 
  Info,
  CheckCircle2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ThreatDisplayProps } from "@/lib/types";

export default function ThreatDisplay({ data }: ThreatDisplayProps) {
  const { aiAssessment, results } = data;

  // Visual configuration based on threat level
  const config = {
    low: { color: "text-green-600", border: "border-green-200", bg: "bg-green-50", icon: ShieldCheck },
    medium: { color: "text-yellow-600", border: "border-yellow-200", bg: "bg-yellow-50", icon: Info },
    high: { color: "text-orange-600", border: "border-orange-200", bg: "bg-orange-50", icon: AlertTriangle },
    extreme: { color: "text-red-600", border: "border-red-200", bg: "bg-red-50", icon: ShieldAlert },
  }[aiAssessment.threatLevel || "medium"];

  const Icon = config.icon;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* AI OVERVIEW SECTION */}
      <Card className={`border-2 ${config.border} ${config.bg}`}>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className={`p-2 rounded-full bg-white shadow-sm ${config.color}`}>
            <Icon size={32} />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold uppercase tracking-tight">
              {aiAssessment.threatLevel} Threat Detected
            </CardTitle>
            <CardDescription className="text-slate-700 font-medium">
              {aiAssessment.summary}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white/50 p-4 rounded-lg border border-white/20">
            <h4 className="font-semibold mb-1 flex items-center gap-2">
              <Info size={16} /> Analysis
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">{aiAssessment.analysis}</p>
          </div>
          
          <Alert variant={aiAssessment.threatLevel === 'extreme' ? 'destructive' : 'default'} className="bg-white">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle className="font-bold">Security Recommendation</AlertTitle>
            <AlertDescription>{aiAssessment.verdict}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* TECHNICAL EVIDENCE SECTION */}
      <div className="grid gap-4">
        <h3 className="text-lg font-bold flex items-center gap-2 px-1">
          <ExternalLink size={20} /> Link Analysis Details
        </h3>
        
        {results.map((item, index) => (
          <Card key={index} className="overflow-hidden border-l-4 border-l-slate-400">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <code className="text-xs bg-slate-100 p-1 rounded block truncate w-full max-w-md">
                    {item.url}
                  </code>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.vtReport?.malicious > 0 && (
                      <Badge variant="destructive">VirusTotal: {item.vtReport.malicious} hits</Badge>
                    )}
                    {item.domainReport?.isNew && (
                      <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                        Brand New Domain
                      </Badge>
                    )}
                    {!item.domainReport?.isNew && item.domainReport?.ageInDays && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Calendar size={12} /> {Math.floor(item.domainReport.ageInDays / 365)} years old
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Risk Level</p>
                  <span className={`font-black ${item.isTechnicalRisk ? 'text-red-500' : 'text-green-500'}`}>
                    {item.isTechnicalRisk ? 'SUSPICIOUS' : 'LIKELY SAFE'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}