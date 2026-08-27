export interface ATSMetricDetail {
  id: string;
  name: string;
  score: number; // 0 - 100
  status: "pass" | "fail" | "warning";
  summary: string;
  findings: string[];
  tips: string[];
}

export interface ATSBulletSuggestion {
  original: string;
  improved: string;
  reason: string;
  metric?: string;
}

export interface ATSScanResult {
  overallScore: number;
  verdict: "Ready to Apply" | "Good Match" | "Needs Improvement" | "High Risk of Rejection";
  summaryText: string;
  targetRole: string;
  metrics: {
    bulletPoints: ATSMetricDetail;
    quantifiableMetrics: ATSMetricDetail;
    grammarAndTone: ATSMetricDetail;
    keywordsAndSkills: ATSMetricDetail;
    formattingAndHierarchy: ATSMetricDetail;
    contactInformation: ATSMetricDetail;
    brevityAndLength: ATSMetricDetail;
  };
  skillsFound: string[];
  missingKeywords: string[];
  bulletSuggestions: ATSBulletSuggestion[];
  generalSuggestions: string[];
  parsedResume: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    currentTitle?: string | null;
    experienceYears?: number | null;
    summary?: string | null;
    skills?: string[];
  };
}
