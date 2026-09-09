import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  FileCheck, 
  Sparkles, 
  ShieldAlert,
  Hash,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DocumentType, IssuerRecord } from '../../types/Document';

interface FileUploadProps {
  issuers: IssuerRecord[];
  onUploadComplete: (doc: any) => void;
  isUploading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  issuers, 
  onUploadComplete, 
  isUploading 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [calculatedHash, setCalculatedHash] = useState<string>('');
  const [documentType, setDocumentType] = useState<DocumentType>('PASSPORT');
  const [issuerId, setIssuerId] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute SHA-256 in browser using Web Crypto API
  const computeSha256 = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileProcess = async (file: File) => {
    setSelectedFile(file);
    if (!documentTitle) {
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '));
    }

    // Generate preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreviewUrl(null);
    }

    // Compute cryptographic SHA-256
    const hash = await computeSha256(file);
    setCalculatedHash(hash);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Sample presets for instant testing
  const loadDemoPreset = (presetKey: 'valid_passport' | 'valid_degree' | 'tampered_license') => {
    if (presetKey === 'valid_passport') {
      setDocumentTitle('Official Passport - Alexandria Chen');
      setDocumentType('PASSPORT');
      setIssuerId('iss_gov_uspass');
      setCalculatedHash('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
      setFilePreviewUrl('/assets/sample_passport.png');
      setSelectedFile(new File(['sample-passport-content'], 'alex_chen_us_passport.pdf', { type: 'application/pdf' }));
    } else if (presetKey === 'valid_degree') {
      setDocumentTitle('Master of Science Degree - Stanford');
      setDocumentType('ACADEMIC_DEGREE');
      setIssuerId('iss_univ_stanford');
      setCalculatedHash('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
      setFilePreviewUrl('/assets/sample_diploma.png');
      setSelectedFile(new File(['sample-degree-content'], 'stanford_ms_degree_alex.pdf', { type: 'application/pdf' }));
    } else {
      setDocumentTitle('California Driver License (Tampered Sample)');
      setDocumentType('DRIVER_LICENSE');
      setIssuerId('iss_gov_dmv_ca');
      setCalculatedHash('4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a');
      setFilePreviewUrl('/assets/sample_dl_tampered.png');
      setSelectedFile(new File(['sample-tampered-dl-content'], 'california_driver_license_front.png', { type: 'image/png' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !calculatedHash) return;

    onUploadComplete({
      title: documentTitle || 'Verification Document',
      documentType,
      issuerId: issuerId || undefined,
      originalFilename: selectedFile?.name || 'document_upload.pdf',
      fileSizeBytes: selectedFile?.size || 1542000,
      mimeType: selectedFile?.type || 'application/pdf',
      fileDataUrl: filePreviewUrl || undefined,
      sha256Hash: calculatedHash || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    });
  };

  return (
    <div id="file-upload-container" className="space-y-6">
      {/* Quick Test Document Selector */}
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Or Load a Ready-to-Verify Test Document</span>
            </h4>
            <p className="text-xs text-slate-400">Instantly test genuine and tampered scenarios with pre-calculated hashes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => loadDemoPreset('valid_passport')}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-slate-750 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mt-0.5">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">US Passport (Authentic)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">High trust score, valid MRZ, 0 tamper flags</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => loadDemoPreset('valid_degree')}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-slate-750 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 mt-0.5">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Stanford Degree (Authentic)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Academic registrar match, digital seal verified</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => loadDemoPreset('tampered_license')}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-rose-900/40 hover:border-rose-500/60 hover:bg-slate-800/80 transition-all text-left group"
          >
            <div className="p-2 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-rose-200 group-hover:text-rose-300">Driver License (Tampered)</div>
              <div className="text-[11px] text-rose-400/80 mt-0.5">Font mismatch & pixel splice on expiry date</div>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Drop Zone */}
        <div
          id="dropzone-area"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01]' 
              : selectedFile 
              ? 'border-emerald-500/60 bg-emerald-950/10' 
              : 'border-slate-750 hover:border-slate-600 bg-slate-850/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="file-input-control"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.tiff"
            onChange={handleFileInputChange}
          />

          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              selectedFile ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/60' : 'bg-slate-800 text-cyan-400 border border-slate-700'
            }`}>
              {selectedFile ? <FileCheck className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Ready for AI Analysis: {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Type: {selectedFile.type || 'Document'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-200">
                  Drop your document here, or <span className="text-cyan-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-400">
                  Supports PDF, PNG, JPG (Passports, IDs, Diplomas, Certificates, Legal docs up to 25MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Real Cryptographic Hash Indicator */}
        {calculatedHash && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-900/40 flex items-start gap-3 text-xs">
            <Hash className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Client-Side SHA-256 Digest Computed</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Immutable</span>
              </div>
              <p className="font-mono text-[11px] text-cyan-300/90 break-all mt-1 bg-slate-950/80 p-2 rounded border border-slate-800">
                {calculatedHash}
              </p>
            </div>
          </div>
        )}

        {/* Form Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Document Title / Identifier
            </label>
            <input
              type="text"
              id="doc-title-input"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g. US Passport - Alexandria Chen"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Document Classification
            </label>
            <select
              id="doc-type-select"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="PASSPORT">Passport (ICAO 9303)</option>
              <option value="DRIVER_LICENSE">Driver License / State ID</option>
              <option value="NATIONAL_ID">National Identity Card</option>
              <option value="ACADEMIC_DEGREE">Academic Degree / Diploma</option>
              <option value="PROFESSIONAL_CERTIFICATE">Professional Certificate</option>
              <option value="BANK_STATEMENT">Bank Statement / Proof of Funds</option>
              <option value="UTILITY_BILL">Utility Bill / Proof of Address</option>
              <option value="LEGAL_CONTRACT">Legal Contract / Notarized Affidavit</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Known / Claimed Issuing Authority
            </label>
            <select
              id="doc-issuer-select"
              value={issuerId}
              onChange={(e) => setIssuerId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="">-- Let AI Pipeline Auto-Detect Issuer --</option>
              {issuers.map((iss) => (
                <option key={iss.id} value={iss.id}>
                  {iss.name} ({iss.category} • Trust Score: {iss.trustScore}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="start-verification-btn"
            disabled={(!selectedFile && !calculatedHash) || isUploading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
              (!selectedFile && !calculatedHash) || isUploading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/25 hover:scale-[1.02]'
            }`}
          >
            <span>{isUploading ? 'Uploading & Initializing AI Pipeline...' : 'Run AI Forensic Verification'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
