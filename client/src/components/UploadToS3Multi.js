import React from 'react';
import axios from 'axios';

function UploadToExpress() {
  const uploadToExpress = async (e) => {
    //todo check each files
    // if(!file) return setData({...data, err: "No files were uploaded." , success: ''})

    // if(file.size > 1024 * 1024)
    //     return setData({...data, err: "Size too large." , success: ''})

    // if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    //     return setData({...data, err: "File format is incorrect." , success: ''})

    let formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      // do the validation here
      formData.append('avatars', e.target.files[i]);
    }
    const res = await axios.post('/api/express/multi', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    console.log(res);
  };
  return (
    <div className="App">
      <p>
        upload <strong>multiple</strong> image to <strong>s3</strong>
      </p>
      <input
        type="file"
        name="avatars"
        id="expressFile"
        multiple
        onChange={uploadToExpress}
      />
    </div>
  );
}

export default UploadToExpress;
