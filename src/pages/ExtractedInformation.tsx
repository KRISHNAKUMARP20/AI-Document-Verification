import React, { useState } from 'react';
import { Edit2, Check, ArrowRight } from 'lucide-react';
import { CertificateDocument } from '../components/certificate/CertificateDocument';
import { DocumentRecord } from '../types/Document';
import { OCRResultData } from '../types/Verification';

interface ExtractedInformationProps {
  document?: DocumentRecord | null;
  ocrData?: OCRResultData | null;
  onNext?: () => void;
}

export const ExtractedInformationPage: React.FC<ExtractedInformationProps> = ({
  document,
  ocrData,
  onNext
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({
    name: (ocrData?.extractedFields?.fullName as string) || (document?.title || 'Unknown Name'),
    certificateId: (ocrData?.extractedFields?.documentNumber as string) || 'Pending...',
    institution: (ocrData?.extractedFields?.issuingAuthority as string) || 'Pending...',
    course: 'Document Verification', // Default as it's not extracted explicitly by AI
    issueDate: (ocrData?.extractedFields?.dateOfIssue as string) || 'Pending...',
    documentType: document?.documentType || 'Certificate'
  });

  const pdfBlobUrl = React.useMemo(() => {
    if (!document?.fileDataUrl?.startsWith('data:application/pdf')) return null;
    try {
      const base64 = document.fileDataUrl.split(',')[1];
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (e) {
      return null;
    }
  }, [document?.fileDataUrl]);

  return (
    <div id="extracted-information-screen" className="max-w-4xl mx-auto space-y-6">
      {/* Header matching Screen 6 */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Extracted Information
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Information extracted from your document using AI OCR
        </p>
      </div>

      {/* 2-Column Layout matching Screen 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Certificate Preview Document */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#0e172e] p-2 flex items-center justify-center min-h-[300px]">
          {document?.fileDataUrl ? (
            document.fileDataUrl.startsWith('data:application/pdf') ? (
              <iframe src={pdfBlobUrl || ''} title="PDF Preview" className="w-full h-[500px] rounded-xl bg-white border-0" />
            ) : (
              <img src={document.fileDataUrl} alt="Uploaded document" className="w-full h-auto rounded-xl object-contain max-h-[600px] bg-white" />
            )
          ) : (
            <CertificateDocument
              name={details.name}
              course={details.course}
              institution={details.institution}
              certificateId={details.certificateId}
              issueDate={details.issueDate}
              compact={true}
            />
          )}
        </div>

        {/* Right: Extracted Details Card matching Screen 6 */}
        <div className="p-6 rounded-2xl bg-[#0e172e] border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold text-white">Extracted Details</h2>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                {isEditing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            {/* Extracted Fields List */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-slate-700 text-white text-xs"
                  />
                ) : (
                  <p className="font-semibold text-white text-sm">{details.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Certificate ID</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={details.certificateId}
                    onChange={(e) => setDetails({ ...details, certificateId: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-slate-700 text-white text-xs font-mono"
                  />
                ) : (
                  <p className="font-medium text-slate-200 font-mono">{details.certificateId}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Institution</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={details.institution}
                    onChange={(e) => setDetails({ ...details, institution: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-slate-700 text-white text-xs"
                  />
                ) : (
                  <p className="font-medium text-slate-200">{details.institution}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Course</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={details.course}
                    onChange={(e) => setDetails({ ...details, course: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-slate-700 text-white text-xs"
                  />
                ) : (
                  <p className="font-medium text-slate-200">{details.course}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Issue Date</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={details.issueDate}
                    onChange={(e) => setDetails({ ...details, issueDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080e1e] border border-slate-700 text-white text-xs"
                  />
                ) : (
                  <p className="font-medium text-slate-200">{details.issueDate}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Document Type</label>
                <p className="font-medium text-slate-200">{details.documentType}</p>
              </div>
            </div>
          </div>

          {/* Next Button matching Screen 6 */}
          <button
            id="btn-extracted-next"
            onClick={onNext}
            className="w-full py-2.5 mt-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
