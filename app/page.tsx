'use client'

import React, { useState } from 'react';

const UploadImagePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    setError(null);
    setPublicId(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/image-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Upload failed');
        return;
      }

      const data = await response.json();
      setPublicId(data.publicId);
    } catch (err) {
      console.log(err)
      setError('An unexpected error occurred.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 text-white rounded ${
          uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {publicId && (
        <div className="mt-6">
          <p className="font-medium">Upload successful! Public ID:</p>
          <code className="block bg-gray-100 p-2 rounded text-sm mt-2">
            {publicId}
          </code>
          <img
            src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`}
            alt="Uploaded"
            className="mt-4 max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default UploadImagePage;
