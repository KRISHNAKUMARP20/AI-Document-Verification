import React from 'react';
import { Award } from 'lucide-react';

interface CertificateDocumentProps {
  name?: string;
  course?: string;
  institution?: string;
  certificateId?: string;
  issueDate?: string;
  signatures?: { left: string; right: string };
  className?: string;
  compact?: boolean;
}

export const CertificateDocument: React.FC<CertificateDocumentProps> = ({
  name = 'Rohan Kumar',
  course = 'Java Programming Course',
  institution = 'ABC INSTITUTE OF TECHNOLOGY',
  certificateId = 'CERT-2023-00125',
  issueDate = '20 Aug 2023',
  signatures = { left: 'Dr. S. Sharma', right: 'Prof. A. Mehta' },
  className = '',
  compact = false
}) => {
  return (
    <div
      className={`relative bg-[#fbf9f4] text-slate-800 rounded-lg shadow-xl overflow-hidden border-[6px] border-[#d8c29d] select-none font-serif ${className}`}
      style={{ aspectRatio: '1.414 / 1' }}
    >
      {/* Ornate Guilloche / Security Pattern Border */}
      <div className="absolute inset-1.5 border border-dashed border-[#b89f74] pointer-events-none rounded" />
      <div className="absolute inset-3 border border-[#d8c29d]/60 pointer-events-none rounded" />

      {/* Decorative Corner Ornaments */}
      <div className="absolute top-2 left-2 text-[#b89f74] text-xs leading-none">❖</div>
      <div className="absolute top-2 right-2 text-[#b89f74] text-xs leading-none">❖</div>
      <div className="absolute bottom-2 left-2 text-[#b89f74] text-xs leading-none">❖</div>
      <div className="absolute bottom-2 right-2 text-[#b89f74] text-xs leading-none">❖</div>

      {/* Watermark in background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Award className="w-64 h-64 text-[#967540]" />
      </div>

      <div className={`relative h-full flex flex-col justify-between items-center text-center ${compact ? 'p-3' : 'p-6 sm:p-8'}`}>
        {/* Top Institution & Header */}
        <div className="space-y-1">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#8c6d3b]">
            {institution}
          </p>
          <h2 className={`${compact ? 'text-base' : 'text-xl sm:text-2xl'} font-serif font-black tracking-wide text-[#2b2416]`}>
            Certificate of Completion
          </h2>
          <p className="text-[9px] sm:text-[11px] italic text-[#635742] font-sans tracking-wide">
            This is to certify that
          </p>
        </div>

        {/* Recipient Name in Calligraphy Style */}
        <div className="my-1 sm:my-2 w-full max-w-sm border-b border-[#b89f74]/40 pb-1">
          <h1 className={`${compact ? 'text-lg' : 'text-2xl sm:text-3xl'} font-serif font-bold text-[#1a140b] tracking-normal`} style={{ fontFamily: 'Georgia, serif' }}>
            {name}
          </h1>
        </div>

        {/* Course Description */}
        <div className="space-y-0.5 max-w-md">
          <p className="text-[9px] sm:text-[10px] text-[#635742] font-sans">
            has successfully completed the
          </p>
          <p className={`${compact ? 'text-xs' : 'text-sm sm:text-base'} font-serif font-bold text-[#3d321d]`}>
            {course}
          </p>
        </div>

        {/* Metadata Row: Issue Date & Certificate ID */}
        <div className="w-full flex justify-between items-center px-4 text-[8px] sm:text-[10px] text-[#635742] font-sans font-medium">
          <div>
            <span className="font-semibold text-[#3d321d]">Issue Date</span>
            <p className="text-[9px] sm:text-[11px] font-mono">{issueDate}</p>
          </div>
          <div className="text-right">
            <span className="font-semibold text-[#3d321d]">Certificate ID</span>
            <p className="text-[9px] sm:text-[11px] font-mono font-bold text-[#8c6d3b]">{certificateId}</p>
          </div>
        </div>

        {/* Bottom Signatures & Embossed Gold Seal */}
        <div className="w-full flex items-end justify-between px-2 pt-1 border-t border-[#d8c29d]/40">
          {/* Left Signatory */}
          <div className="text-center w-28">
            <div className="font-script text-[#334155] italic text-xs sm:text-sm -mb-1 font-serif">
              S. Sharma
            </div>
            <div className="border-t border-slate-400/80 pt-0.5">
              <p className="text-[8px] sm:text-[9px] font-sans font-bold text-[#2b2416]">{signatures.left}</p>
              <p className="text-[7px] sm:text-[8px] text-[#635742] font-sans">Program Director</p>
            </div>
          </div>

          {/* Center Embossed Gold Seal */}
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#f6e27a] via-[#cb9b51] to-[#a67c1e] shadow-md border-2 border-[#fff3a8] flex items-center justify-center text-[#4a3205]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-dashed border-[#5e4308] flex items-center justify-center">
                <span className="text-[7px] font-black uppercase tracking-tighter">OFFICIAL</span>
              </div>
            </div>
            {/* Ribbons */}
            <div className="flex gap-1 -mt-1">
              <div className="w-2 h-3 bg-[#cb9b51] transform -rotate-12 rounded-b-sm shadow-sm" />
              <div className="w-2 h-3 bg-[#a67c1e] transform rotate-12 rounded-b-sm shadow-sm" />
            </div>
          </div>

          {/* Right Signatory */}
          <div className="text-center w-28">
            <div className="font-script text-[#334155] italic text-xs sm:text-sm -mb-1 font-serif">
              A. Mehta
            </div>
            <div className="border-t border-slate-400/80 pt-0.5">
              <p className="text-[8px] sm:text-[9px] font-sans font-bold text-[#2b2416]">{signatures.right}</p>
              <p className="text-[7px] sm:text-[8px] text-[#635742] font-sans">Dean of Academics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
