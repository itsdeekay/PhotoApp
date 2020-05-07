import React, { useState,useEffect } from 'react';
import './app2.css';
import axios from 'axios';
import DragAndDrop from './components/DragAndDrop';
import Message from './components/Message';
import Progress from './components/Progress';
import Gallery from './components/Gallery';
import { filterAsync } from 'lodasync'
const Jimp = require('jimp');

function App() {
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const fileInput = React.createRef();
  const [ress, setRess] = useState({});

   async function ValidateImg (file){
    let aspectFile =0
    await Jimp.read(window.URL.createObjectURL(file)).then(f => {
      var w = f.bitmap.width;
      var h = f.bitmap.height;
       if(w-500>=0 && h-500>=0){
          aspectFile = w/h;
         
      }
    })
    return aspectFile >= 0.5625 && aspectFile <= 1.7778 ;
}

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        let tempFileList = state.fileList.concat(action.files)
        setWarning(tempFileList.length + ' Files selected')
        return { ...state, fileList: tempFileList };
      default:
        return state;
    }
  };

  const fileHandler = async event => {

    let files = [...event.target.files];

    if (files && files.length > 0) {
      
      
      const existingFiles = data.fileList.map(f => f.name)
      if(files.filter(f => f.type.match(/image[/][a-z]*/)).length !== files.length){
        setWarning('Only Image files are allowed');
        setTimeout(() => {
          setWarning('');
        }, 3000);
        return
      }
      var bb = await filterAsync(async(element) => {
        return ValidateImg(element);
      },files)

      if(bb.length !== files.length){
        setWarning('Only Image with Apect ratio between 9/16 and 16/9 will be uploaded');
        setTimeout(() => {
          setWarning('');
        }, 3000);
        return
      }
      files = files.filter(f => !existingFiles.includes(f.name) && f.type.match(/image[/][a-z]*/) && ValidateImg)
      dispatch({ type: 'ADD_FILE_TO_LIST', files });
    }
    setMessage('');
    setUploadPercentage(0);
  }


  const uploadHandler = async event => {
    event.preventDefault();
    if([...data.fileList].length===0){
      setWarning('Please Select files')
      setTimeout(() => {
        setWarning('');
      }, 3000);
      return
    }
    const formData = new FormData();
    [...data.fileList].forEach(img => {
      formData.append("arrayOfFilesName", img)
    })
    data.fileList=[]
    const res = await axios({
      method: "POST",
      url: "/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }, onUploadProgress: progressEvent => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
        setMessage(parseInt(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        ) + '%');
        
        // Clear percentage
        setTimeout(() => {
          setUploadPercentage(0);
          setMessage('');
        }, 4000);

        
      }
    })
    if (res.status===200){
      setMessage('File Uploaded');
      setRess(res.data);
    }else{ 
      setMessage('Error');
      setRess(res.data);
      console.log('error in uploading')
    }
    
  }
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  const [data, dispatch] = React.useReducer(
    reducer, { dropDepth: 0, inDropZone: false, fileList: [] }
  )
  return (
    <div className="App" onDrop={e => handleDrop(e)} onDragOver={e => handleDragOver(e)}>
      {message ? <div><Message msg={message} /> <Progress percentage={uploadPercentage}/> </div>  : null}
      <form onSubmit={uploadHandler}>
        <input type="file" style={{ display: 'none' }} name="uploadedFiles"
          multiple="multiple" onChange={fileHandler} ref={fileInput} />

        <DragAndDrop data={data} dispatch={dispatch} onClick={() => fileInput.current.click()} />
        <span id="warning">{warning ? warning :null}</span>
        <input type="submit" value="Upload" className="submitBtn" />
        
      </form>
      <Gallery data={ress}/>
      

{/* 
      <ol className="dropped-files">
        {data.fileList.map(f => {
          return (
            <li key={f.name}>{f.name}</li>
          )
        })}
      </ol> */}
    </div>
  );
}

export default App;
