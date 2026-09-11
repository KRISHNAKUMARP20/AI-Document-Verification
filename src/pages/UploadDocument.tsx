import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, ArrowRight } from 'lucide-react';
import { IssuerRecord } from '../types/Document';

interface UploadDocumentPageProps {
  issuers: IssuerRecord[];
  onUploadAndVerify: (docData: any) => Promise<void>;
  isUploading?: boolean;
  pipelineStage?: number;
  onAnalyzeDirect?: () => void;
}

export const UploadDocumentPage: React.FC<UploadDocumentPageProps> = ({
  issuers,
  onUploadAndVerify,
  onAnalyzeDirect
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      setFileSizeStr((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      const reader = new FileReader();
      reader.onload = () => setFileDataUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      setFileSizeStr((file.size / (1024 * 1024)).toFixed(1) + ' MB');
      const reader = new FileReader();
      reader.onload = () => setFileDataUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (onAnalyzeDirect) {
      onAnalyzeDirect();
    } else {
      onUploadAndVerify({
        title: selectedFileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        documentType: 'CERTIFICATE',
        originalFilename: selectedFileName,
        fileSizeBytes: 2516582,
        mimeType: 'image/jpeg',
        fileDataUrl: fileDataUrl || undefined
      });
    }
  };

  return (
    <div id="upload-document-screen" className="max-w-3xl mx-auto space-y-6">
      {/* Page Title & Subtitle matching Screen 4 */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Upload Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload your certificate or document to verify
        </p>
      </div>

      {/* Main Upload Box with Dashed Border matching Screen 4 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`p-10 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 ${
          isDragOver
            ? 'border-blue-500 bg-blue-950/20'
            : 'border-slate-700 bg-[#0e172e] hover:border-slate-600'
        }`}
      >
        {/* Cloud Upload Icon */}
        <div className="w-14 h-14 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">Drag & Drop your file here</h3>
          <p className="text-xs text-slate-500">or</p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Choose File Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          Choose File
        </button>

        <p className="text-[11px] text-slate-500">
          Supports PDF, JPG, PNG, JPEG (Max 10MB)
        </p>
      </div>

      {/* Selected File Card & Analyze Button matching Screen 4 */}
      {selectedFileName && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-950/60 border border-red-800/40 text-red-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{selectedFileName}</p>
                <p className="text-[10px] text-slate-400">{fileSizeStr}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedFileName('')}
              className="text-slate-400 hover:text-white p-1"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Solid Blue Analyze Document Button */}
          <button
            id="btn-analyze-document"
            onClick={handleAnalyze}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Analyze Document</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
