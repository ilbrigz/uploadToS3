import React from 'react';
import UploadToExpress from './components/UploadToExpress';
import UploadToS3Multi from './components/UploadToS3Multi';
import UploadToExpressS3Multi from './components/UploadToExpressS3Multi';
import DropZone from './components/DropZone';
import S3Single from './components/S3Single';
import S3SignleDirectUpload from './components/S3SignleDirectUpload';

function App() {
  return (
    <div>
      <UploadToExpress />
      <S3Single />
      <S3SignleDirectUpload />
      <UploadToExpressS3Multi />
      <UploadToS3Multi />
      <DropZone />
      <h3>notes</h3>
      <ul>
        <li>
          <strong>multiple</strong> tag is added to input to make it accept
          moret than 1 file
        </li>
        <li>
          we are using aws-s3 and multer or aws-s3 and express-fileupload
          (preferred)
        </li>
        <li>
          text input and other data can be appended to formdata and then sent to
          the server
        </li>
      </ul>
    </div>
  );
}

export default App;
