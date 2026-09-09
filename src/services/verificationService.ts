import { apiRequest } from './api';
import { VerificationResultPayload } from '../types/Verification';

export const verificationService = {
  async runVerification(documentId: string): Promise<VerificationResultPayload> {
    const data = await apiRequest('/verification/process', {
      method: 'POST',
      body: JSON.stringify({ documentId }),
    });
    return data;
  },

  async runVerificationPipeline(params: { documentId: string; fileDataUrl?: string; documentType?: string; sha256Hash?: string }): Promise<VerificationResultPayload> {
    const data = await apiRequest('/verification/process', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return data;
  },

  async getVerificationResult(documentId: string): Promise<VerificationResultPayload> {
    const data = await apiRequest(`/verification/result/${documentId}`);
    return data;
  },

  async getVerificationHistory(): Promise<any[]> {
    const data = await apiRequest('/verification/history');
    return data.history;
  },

  async verifyQrToken(token: string): Promise<any> {
    const data = await apiRequest(`/verification/verify-qr/${token}`);
    return data;
  }
};
