import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onUpload: (url: string, file?: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  currentFile?: string;
}
const url: string = window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin;

export default function FileUpload({
  onUpload,
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  currentFile,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("uploadFile", file);

      const res = await fetch(`${url}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error("Upload failed or invalid response");
      }

      onUpload(data.url, file); // Pass uploaded file URL to parent
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${dragActive ? "border-primary bg-primary-50" : "border-gray-300 hover:border-primary"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 text-sm">
          Drag and drop a file here or{" "}
          <label className="text-blue-600 underline cursor-pointer">
            click to browse
            <input
              type="file"
              accept={accept}
              onChange={handleInputChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max size: {(maxSize / (1024 * 1024)).toFixed(1)} MB
        </p>
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
      </div>

      {currentFile && (
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <img
              src={currentFile}
              alt="Uploaded"
              className="w-12 h-12 rounded object-cover border"
            />
            <span className="truncate max-w-[180px] text-sm text-gray-700">{currentFile}</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUpload("")}
          >
            <X className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )}
    </div>
  );
}