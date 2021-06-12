import React from 'react';
import UploadToExpress from './components/UploadToExpress';
import UploadToS3Multi from './components/UploadToS3Multi';
import S3Single from './components/S3Single';
import S3SignleDirectUpload from './components/S3SignleDirectUpload';

function App() {
  return (
    <div>
      <UploadToExpress />
      <S3Single />
      <S3SignleDirectUpload />
      <UploadToS3Multi />
    </div>
  );
}

export default App;
