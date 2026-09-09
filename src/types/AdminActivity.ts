export type CertificateCategory = 'CERTIFICATE' | 'MARKSHEET' | 'DEGREE' | 'ID_CARD' | 'PASSPORT';
export type VerificationOutcome = 'VERIFIED_VALID' | 'SUSPICIOUS_FLAGGED' | 'REJECTED_FRAUDULENT' | 'PENDING';

export interface ForensicCheckItem {
  id: string;
  name: string;
  category: 'OCR' | 'TAMPER' | 'CRYPTOGRAPHY' | 'REGISTRY';
  status: 'PASSED' | 'WARNING' | 'FAILED';
  score: number;
  detail: string;
}

export interface UserActivityItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userIp: string;
  device: string;
  documentTitle: string;
  certificateType: CertificateCategory;
  issuerName: string;
  originalFilename: string;
  fileSizeBytes: number;
  fileFormat: 'PDF' | 'JPG' | 'PNG' | 'JPEG';
  status: VerificationOutcome;
  confidenceScore: number;
  trustScore: number;
  resultSummary: string;
  keyFinding: string;
  tamperRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ocrExtracted: {
    recipientName: string;
    idNumber: string;
    institution: string;
    issueDate: string;
    courseOrSpecialization?: string;
    scoreOrGrade?: string;
  };
  forensicChecks: ForensicCheckItem[];
  submittedAt: string;
  sha256Hash: string;
}
