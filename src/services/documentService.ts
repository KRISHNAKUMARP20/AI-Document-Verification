import { apiRequest } from './api';
import { DocumentRecord, IssuerRecord } from '../types/Document';

export const documentService = {
  async getDocuments(): Promise<DocumentRecord[]> {
    const data = await apiRequest('/documents');
    return data.documents;
  },

  async getDocumentById(id: string): Promise<DocumentRecord> {
    const data = await apiRequest(`/documents/${id}`);
    return data.document;
  },

  async uploadDocument(formData: {
    title: string;
    documentType: string;
    issuerId?: string;
    originalFilename: string;
    fileSizeBytes: number;
    mimeType: string;
    fileDataUrl: string;
  }): Promise<DocumentRecord> {
    const data = await apiRequest('/documents', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return data.document;
  },

  async getIssuers(): Promise<IssuerRecord[]> {
    const data = await apiRequest('/issuers');
    return data.issuers;
  },

  async getAccreditedIssuers(): Promise<IssuerRecord[]> {
    return this.getIssuers();
  }
};
