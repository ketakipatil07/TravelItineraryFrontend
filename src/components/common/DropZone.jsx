import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, FileText, Image } from 'lucide-react';

export default function DropZone({ onFileUpload }) {
  const [preview, setPreview] = useState(null);

  const onDrop = (files) => {
    const file = files[0];
    if (!file) return;
    onFileUpload(file);
    const reader = new FileReader();
    reader.onload = () => setPreview({ name: file.name, size: file.size, url: reader.result, type: file.type });
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg','.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'], 'image/tiff': ['.tiff','.tif'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
      }`}>
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className="text-lg font-medium text-gray-900 mb-1">{isDragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}</p>
        <p className="text-sm text-gray-500">PDF, JPG, PNG, WebP, TIFF (max 10MB)</p>
      </div>
      {preview && (
        <div className="card p-4 flex items-center gap-3">
          {preview.type === 'application/pdf' ? <FileText className="w-8 h-8 text-blue-600" /> : <Image className="w-8 h-8 text-blue-600" />}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{preview.name}</p>
            <p className="text-sm text-gray-500">{Math.round(preview.size / 1024)} KB</p>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      )}
    </div>
  );
}
