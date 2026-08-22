"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, X } from "lucide-react";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentId?: string;
  onUploadSuccess?: () => void;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  shipmentId,
  onUploadSuccess,
}: DocumentUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [docType, setDocType] = useState<string>("BILL_OF_LADING");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      // Simulate AI Parsing Agent upload and extraction pipeline
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUploadSuccess(true);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => {
        onClose();
        setFiles([]);
        setUploadSuccess(false);
        setIsUploading(false);
      }, 1200);
    } catch {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-surface-muted/50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-bold text-ink">AI Document Ingestion & Parser Agent</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Document Category</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-surface-muted border border-border rounded-xl font-medium text-ink focus:outline-none focus:border-brand"
            >
              <option value="BILL_OF_LADING">Bill of Lading (BOL / Ocean / Air Waybill)</option>
              <option value="COMMERCIAL_INVOICE">Commercial Invoice</option>
              <option value="PACKING_LIST">Packing List</option>
              <option value="PROOF_OF_DELIVERY">Proof of Delivery (POD)</option>
              <option value="CARRIER_INVOICE">Freight Rate Confirmation / Invoice</option>
              <option value="ENTRY_SUMMARY">CBP Customs Entry 7501</option>
            </select>
          </div>

          {/* Drag & Drop Box */}
          <div className="border-2 border-dashed border-border hover:border-brand rounded-2xl p-6 text-center space-y-3 bg-surface-muted/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-ink">
                Drag & drop trade PDFs or image files here, or <label className="text-brand hover:underline cursor-pointer">browse</label>
              </p>
              <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" id="doc-file-input" />
              <p className="text-[10px] text-ink-muted mt-1">Supports PDF, PNG, JPG up to 25MB. AI agent automatically extracts fields and bounding boxes.</p>
            </div>
          </div>

          {/* Selected File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">Selected Files ({files.length}):</span>
              {files.map((f, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-border bg-surface-muted flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-4 h-4 text-brand shrink-0" />
                    <span className="font-semibold text-ink truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] text-ink-muted font-mono shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                </div>
              ))}
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Document successfully parsed and attached to shipment workspace!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-end space-x-2 bg-surface-muted/30">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-ink hover:bg-white">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand-hover disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isUploading ? "AI Extracting..." : "Upload & Parse"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
