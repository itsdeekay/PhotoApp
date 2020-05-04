import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {

  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const fileInput = React.createRef();
  const [files,setFiles] = useState([]);
  const fileHandler = event => {
    setFiles(event.target.files);
    setMessage('');
    setUploadPercentage(0);
  }
  const uploadHandler = async event => {
    event.preventDefault();
    console.log(files);
    const formData = new FormData();
    [...files].forEach(img => {
      formData.append("arrayOfFilesName", img)
  })
  setFiles([]);
    const res = await axios({
      method: "POST",
      url:  "/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }, onUploadProgress: progressEvent => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );

        // Clear percentage
        setTimeout(() => setUploadPercentage(0), 10000);
      }
    })

      setMessage('File Uploaded');
  }

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
         <form onSubmit={uploadHandler}>
       <input type="file"  name="uploadedFiles" accept="image/*"
        multiple="multiple" onChange={fileHandler} ref={fileInput}/>

        <input type="submit" value="Upload" onClick={() => fileInput.current.click()} />
      </form>

        <Progress percentage={uploadPercentage} />

    </Fragment>
  );
};

export default FileUpload;