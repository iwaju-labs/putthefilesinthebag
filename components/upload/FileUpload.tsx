import { useState } from "react";
import { FiUpload, FiImage, FiVideo } from "react-icons/fi";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragging, setDragging] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const validTypes = ["image/", "video/"];
    const isValid = validTypes.some((type) => file.type.startsWith(type));

    if (!isValid) {
      alert("Please upload an image or video file");
      return;
    }

    // Check file size limits
    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 100 : 50; // MB
    const fileSizeMB = file.size / 1024 / 1024;

    if (fileSizeMB > maxSize) {
      alert(`File too large. Maximum size for ${isVideo ? 'videos' : 'images'} is ${maxSize}MB`);
      return;
    }

    setFile(file);
    onFileSelect(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        dragging 
          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-400" 
          : "border-gray-300 dark:border-gray-700"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="ptfitb-file-input"
        className="hidden"
        accept="image/*,video/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {file ? (
        <div className="flex items-center justify-center gap-3">
          {file.type.startsWith("image/") ? (
            <FiImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <FiVideo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {file.type.startsWith("image/") ? "Image" : "Video"} • {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div>
          <FiUpload className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drop your file here
          </p>
          <label
            htmlFor="ptfitb-file-input"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer font-medium"
          >
            or click to browse
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Max: 50MB (images) • 100MB (videos)
          </p>
        </div>
      )}
    </div>
  );
}
