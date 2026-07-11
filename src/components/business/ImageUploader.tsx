import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectSquare?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Image',
  aspectSquare = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploading(true);
    // Simulate compression & upload progress to Supabase Storage / public URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        onChange(reader.result as string);
        setUploading(false);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</label>}
      
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all relative overflow-hidden ${
          dragOver ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:border-emerald-500'
        }`}
      >
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Upload preview"
              className={`w-full object-cover rounded-xl ${aspectSquare ? 'h-36' : 'h-48'}`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="px-3 py-1.5 bg-white text-zinc-900 rounded-lg text-xs font-bold cursor-pointer hover:bg-zinc-100 transition-colors">
                Change
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center py-6">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
                <span className="text-xs font-medium text-zinc-500">Compressing & uploading...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                  Drag & drop image here, or <span className="text-emerald-600 dark:text-emerald-400 underline">browse</span>
                </p>
                <p className="text-[10px] text-zinc-400">PNG, JPG, WEBP up to 10MB</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
};
