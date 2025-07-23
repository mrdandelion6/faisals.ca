import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdf_endpoint: string;
}
const PDFViewer: React.FC<PDFViewerProps> = ({ pdf_endpoint }) => {
  const [pdfData, setPdfData] = useState<string | null>(null);
  // store the blob for download
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPDF = async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      console.log(`endpoint: ${API_BASE_URL}api/pdf/${pdf_endpoint}`)
      try {
        if (!API_BASE_URL) {
          throw new Error('API_BASE_URL environment variable is not set');
        }

        const response = await fetch(`${API_BASE_URL}api/pdf/${pdf_endpoint}`, {
          headers: {
            'Accept': 'application/pdf'
          }
        });


        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText} `);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/pdf')) {
          throw new Error('Response is not a PDF file');
        }

        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // basic validation
        const pdfHeader = new TextDecoder().decode(uint8Array.slice(0, 4));
        if (pdfHeader !== '%PDF') {
          throw new Error('Response is not a valid PDF file');
        }

        const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
        if (blob.size < 1000) {
          throw new Error('PDF file appears to be too small');
        }

        // store both the url for viewing and blob for downloading
        const url = URL.createObjectURL(blob);
        setPdfData(url);
        setPdfBlob(blob);

      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, []);

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdf_endpoint}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      // note: we don't revoke this url immediately since the new tab needs it
    }
  };

  const onDocumentLoadSuccess = (pdf: any): void => {
    setNumPages(pdf.numPages);
  };

  const onDocumentLoadError = (error: Error): void => {
    console.error('PDF load error:', error);
    setError('Failed to load PDF document');
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8 text-lg">Loading PDF...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center p-8 text-lg text-red-500">[Error] {error}</div>;
  }

  if (!pdfData) {
    return <div className="flex justify-center items-center p-8 text-lg text-gray-500">No PDF data available</div>;
  }

  return (
    <div className="flex flex-col items-center p-8 max-w-full">
      <div className="w-full flex justify-start mb-4 pt-4">
        <div className="flex gap-2">
          <button
            onClick={handleOpenInNewTab}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1.5 px-4 rounded text-sm shadow-sm transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in New Tab
          </button>

          <button
            onClick={handleDownload}
            className="bg-black hover:bg-gray-800 text-white font-medium py-1.5 px-4 rounded text-sm shadow-sm transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download
          </button>
        </div>
      </div>

      <Document
        file={pdfData}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="text-center p-4">Loading PDF document...</div>}
        error={<div className="text-center p-4 text-red-500">Failed to load PDF</div>}
        className="max-w-full"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1} `}
            pageNumber={index + 1}
            scale={1.5}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="mb-8 shadow-lg max-w-full"
          />
        ))}
      </Document>

      {numPages > 0 && (
        <div className="mt-4 text-gray-600 text-sm">
          Total pages: {numPages}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
