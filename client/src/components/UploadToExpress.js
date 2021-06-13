import React from 'react';
import axios from 'axios';

function UploadToExpress() {
  const uploadToExpress = async (e) => {
    e.preventDefault();
    // const file = e.target.files[0];
    const file = e.target.avatar.files[0];
    // console.log(file);
    // // if(!file) return setData({...data, err: "No files were uploaded." , success: ''})

    // // if(file.size > 1024 * 1024)
    // //     return setData({...data, err: "Size too large." , success: ''})

    // // if(file.type !== 'image/jpeg' && file.type !== 'image/png')
    // //     return setData({...data, err: "File format is incorrect." , success: ''})

    let formData = new FormData();
    formData.append('avatar', file);
    formData.append('textInput', e.target.textInput.value);
    const res = await axios.post('/api/express', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    });
    console.log(res);
    console.log(e.target.files);
  };
  return (
    <form className="App" onSubmit={uploadToExpress}>
      <p>
        upload single image to <strong>express</strong>
      </p>
      <input
        type="file"
        name="avatar"
        id="expressFile"
        // onChange={uploadToExpress}
      />
      <label htmlFor="textInput">
        Name the file (We are sending text here)
      </label>
      <input type="text" id="textInput" name="textFromInput" />
      <button type="submit">Send</button>
    </form>
  );
}

export default UploadToExpress;
