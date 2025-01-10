import { useEffect, useState } from 'react';
import FileUpload from '../../components/onedrive/FileUpload';

export default function Home() {
  

  return (
    <div className="container mx-auto p-4">
    
        <FileUpload  />
      
    </div>
  );
}