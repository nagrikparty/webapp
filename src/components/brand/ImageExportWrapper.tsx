

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';

export function ImageExportWrapper({ children, filename }: { children: React.ReactNode, filename: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!containerRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2, // High resolution for Instagram
        useCORS: true,
        backgroundColor: '#F5F1E8'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 group">
      <div ref={containerRef} className="rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
        {children}
      </div>
      <button 
        onClick={handleExport}
        disabled={exporting}
        className="flex items-center gap-2 bg-[#0A0A0A] text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#A11212] transition-colors disabled:opacity-50"
      >
        {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
        {exporting ? 'Generating PNG...' : 'Download for Instagram'}
      </button>
    </div>
  );
}
