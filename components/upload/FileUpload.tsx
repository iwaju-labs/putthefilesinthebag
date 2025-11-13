import { useState } from "react";

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

    setFile(file);
    onFileSelect(file);
  };

  return (
    <div
      className={`border-4 border-dashed rounded-xl p-12 text-center transition-all ${
        dragging ? "border-purple-500 bg-purple-50" : "border-gray-300"
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
        <div className="space-y-2">
          <p className="text-xl font-bold">✓ {file.name}</p>
          <p className="text-sm text-gray-500">
            {file.type.startsWith("image/") ? "🖼️ Image" : "🎥 Video"} •{" "}
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      ) : (
        <div>
          <p className="text-2xl mb-4">📁 Drop your file here</p>
          <label
            htmlFor="ptfitb-file-input"
            className="cursor-pointer text-blue-500 hover:text-blue-700"
          >
            or click to browse
          </label>
        </div>
      )}
    </div>
  );
}
