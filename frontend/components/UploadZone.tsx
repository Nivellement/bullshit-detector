"use client";

import { useState } from "react";
import { uploadFile } from "@/services/api";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function UploadZone({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadFile(file);
      onUploadSuccess();
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'analyse du fichier.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white hover:border-blue-500 transition-colors group">
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <div className="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
          {isUploading ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
        </div>
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-slate-700">
            {isUploading ? "Analyse en cours..." : "Cliquez pour uploader un transcript"}
          </p>
          <p className="text-sm text-slate-500">Fichiers .txt uniquement pour le moment</p>
        </div>
        <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isUploading} />
      </label>
    </div>
  );
}