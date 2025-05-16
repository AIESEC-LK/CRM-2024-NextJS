'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
    setError('');
    setSuccess('');
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Get access token
      const tokenResponse = await axios.post('/api_new/fileuploadauth');
      const accessToken = tokenResponse.data.access_token;

      console.log('Access token obtained');

      const uniqueFileName = `${uuidv4()}-${file.name}`;
      //file.name = uniqueFileName;
      // Initialize upload session with site ID
      const sessionResponse = await axios.post(


        `https://graph.microsoft.com/v1.0/drive/root:/documents/${uniqueFileName}:/createUploadSession`,
        {
          item: {
            '@microsoft.graph.conflictBehavior': 'replace',
            name: uniqueFileName,
            'file': {}
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        }
      );

      const uploadUrl = sessionResponse.data.uploadUrl;
      const fileContent = await file.arrayBuffer();

      console.log('Upload URL:', uploadUrl);

      // Upload the file
      const uploadResponse = await axios.put(
        uploadUrl,
        fileContent,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': `${file.size}`,
            'Content-Range': `bytes 0-${file.size - 1}/${file.size}`
          },
        }
      );

      if (uploadResponse.status >= 200 && uploadResponse.status < 300) {

        
        const fileUrl = uploadResponse.data.webUrl;

        const fileId = uploadResponse.data.id;  // Get the uploaded file's ID
        console.log('File uploaded:', fileId);
  
        // Create a shareable link for the file (with view permissions)
        const linkResponse = await axios.post(
          `https://graph.microsoft.com/v1.0/drive/items/${fileId}/createLink`,
          {
            type: 'view',  // 'view' for read-only access, 'edit' for editable access
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
          }
        );
  
        const sharedLink = linkResponse.data.link.webUrl;  // The URL of the shareable link
        console.log('Shareable Link:', sharedLink);


        //console.log('File uploaded:', fileUrl);
        setSuccess('File uploaded successfully!');
      } else {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Upload failed: ${err.response?.data?.message || err.message}`);
        console.error('Upload error:', err.response?.data);
      } else if (err instanceof Error) {
        setError(`Upload failed: ${err.message}`);
        console.error('Upload error:', err);
      } else {
        setError('Upload failed: An unknown error occurred.');
        console.error('Upload error:', err);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full"
        disabled={uploading}
      />
      <button
        onClick={uploadFile}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Upload to OneDrive'}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {success && <p className="mt-2 text-green-500">{success}</p>}
    </div>
  );
}