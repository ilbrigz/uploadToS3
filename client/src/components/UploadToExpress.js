import React from 'react';
import axios from 'axios';

function UploadToExpress() {
  const uploadToExpress = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    // if(!file) return setData({...data, err: "No files were uploaded." , success: ''})

    // if(file.size > 1024 * 1024)
    //     return setData({...data, err: "Size too large." , success: ''})

    // if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    //     return setData({...data, err: "File format is incorrect." , success: ''})

    let formData = new FormData();
    formData.append('avatar', file);
    const res = await axios.post('/api/express', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    console.log(res);
    console.log(e.target.files);
  };
  return (
    <div className="App">
      <p>
        upload single image to <strong>express</strong>
      </p>
      <input
        type="file"
        name="avatar"
        id="expressFile"
        onChange={uploadToExpress}
      />
    </div>
  );
}

export default UploadToExpress;
