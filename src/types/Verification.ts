export type VerificationStatusType = 'VERIFIED' | 'FLAGGED' | 'REJECTED' | 'IN_REVIEW';

export type CheckStatus = 'PASSED' | 'WARNING' | 'FAILED' | 'SKIPPED';

export type CheckCategory =
  | 'HASH_INTEGRITY'
  | 'ISSUER_REPUTATION'
  | 'OCR_FIELD_SYNTAX'
  | 'EXPIRY_VALIDITY'
  | 'AI_TAMPER_RESISTANCE'
  | 'QR_CRYPTO_SIGNATURE'
  | 'SECURITY_FEATURES';

export interface VerificationCheckItem {
  id: string;
  checkCode: string;
  checkName: string;
  category: CheckCategory;
  status: CheckStatus;
  score: number;
  details: string;
  evidenceData?: Record<string, any>;
}

export interface OCRResultData {
  id: string;
  documentId: string;
  rawText: string;
  extractedFields: Record<string, string | number | boolean>;
  confidenceScore: number;
  languageDetected: string;
  pageCount: number;
  processingTimeMs: number;
}

export interface TamperDetectionData {
  id: string;
  documentId: string;
  isTampered: boolean;
  tamperConfidenceScore: number;
  fontInconsistencyDetected: boolean;
  fontAnalysisScore: number;
  pixelCloneAnomalyDetected: boolean;
  pixelAnomalyScore: number;
  edgeArtifactDetected: boolean;
  edgeArtifactScore: number;
  metadataExifAnomalyDetected: boolean;
  tamperFlags: string[];
  aiForensicExplanation: string;
}

export interface RiskAssessmentData {
  id: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 0 to 100 (higher = riskier)
  fraudProbability: number; // 0.00 to 1.00
  criticalFlagsCount: number;
  riskFactors: string[];
  recommendedAction: 'AUTO_APPROVE' | 'MANUAL_INSPECTION_REQUIRED' | 'AUTO_REJECT' | 'ESCALATE_TO_ISSUER';
}

export interface VerificationCertificate {
  id: string;
  certificateNumber: string;
  verificationLogId: string;
  documentId: string;
  issuedToName: string;
  issuerAuthority: string;
  documentType: string;
  verificationScore: number;
  cryptographicSignature: string;
  qrVerificationToken: string;
  qrCodeImageUri?: string;
  issuedAt: string;
  expiresAt: string;
  isRevoked: boolean;
  revocationReason?: string;
}

export interface VerificationResultPayload {
  verificationLogId: string;
  documentId: string;
  status: VerificationStatusType;
  compositeTrustScore: number;
  executionTimeMs: number;
  summaryReport: string;
  ocr: OCRResultData;
  tamper: TamperDetectionData;
  checks: VerificationCheckItem[];
  risk: RiskAssessmentData;
  certificate?: VerificationCertificate;
}
