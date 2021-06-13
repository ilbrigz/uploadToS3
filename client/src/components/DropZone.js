import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  position: 'relative',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

export default function Dropzone(props) {
  const [files, setFiles] = useState([]);

  // this forces an update --https://stackoverflow.com/questions/53215285/how-can-i-force-a-component-to-re-render-with-hooks-in-react/58606536#58606536
  const forceUpdate = React.useReducer(() => ({}))[1];

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const removeFile = (fileIdx) => {
    acceptedFiles.splice(fileIdx, 1); // remove the file from the array
    forceUpdate();
    console.log(acceptedFiles);
  };

  const uploadToExpress = (e) => {
    if (!acceptedFiles.length) {
      console.log('chose file');
      return;
    }
    let formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('avatars', file);
    });
    axios
      .post('/api/s3/multi', formData, {
        headers: { 'content-type': 'multipart/form-data' },
      })
      .then((response) => {
        console.log(response);
        acceptedFiles.splice(0, acceptedFiles.length);
        forceUpdate();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const thumbs = acceptedFiles.map((file, idx) => (
    <div style={thumb} key={file.name}>
      <button
        style={{ position: 'absolute', righ: 0, top: 0 }}
        onClick={() => removeFile(idx)}
      >
        x
      </button>
      <div style={thumbInner}>
        {/* <button onClick={file.previewElement.remove}>x</button> */}
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      acceptedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="container">
      <strong>using react-dropzone</strong>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
      <button onClick={uploadToExpress}>Send to Sever</button>
    </section>
  );
}
