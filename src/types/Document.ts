export type DocumentType =
  | 'PASSPORT'
  | 'DRIVER_LICENSE'
  | 'NATIONAL_ID'
  | 'ACADEMIC_DEGREE'
  | 'PROFESSIONAL_CERTIFICATE'
  | 'MEDICAL_RECORD'
  | 'BANK_STATEMENT'
  | 'UTILITY_BILL'
  | 'LEGAL_CONTRACT';

export type DocumentStatus =
  | 'UPLOADED'
  | 'PROCESSING_OCR'
  | 'ANALYZING_TAMPERING'
  | 'VERIFIED_VALID'
  | 'SUSPICIOUS_FLAGGED'
  | 'REJECTED_FRAUDULENT'
  | 'MANUAL_REVIEW';

export interface DocumentRecord {
  id: string;
  userId: string;
  issuerId?: string;
  issuerName?: string;
  title: string;
  documentType: DocumentType;
  originalFilename: string;
  fileSizeBytes: number;
  mimeType: string;
  fileDataUrl?: string;
  sha256Hash: string;
  status: DocumentStatus;
  overallConfidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface IssuerRecord {
  id: string;
  name: string;
  code: string;
  category: 'GOVERNMENT' | 'ACADEMIC' | 'FINANCIAL' | 'HEALTHCARE' | 'CORPORATE' | 'LEGAL';
  countryCode: string;
  website: string;
  contactEmail: string;
  trustScore: number;
  isAccredited: boolean;
}
