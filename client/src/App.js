import React, { useState } from 'react';
import './app2.css';
import axios from 'axios';
import DragAndDrop from './components/DragAndDrop';
import Message from './components/Message';
import Progress from './components/Progress';
import Gallery from './components/Gallery';

function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(10);
  const fileInput = React.createRef();
  const [ress, setRess] = useState({});
  const fileHandler = event => {

    let files = [...event.target.files];

    if (files && files.length > 0) {
      const existingFiles = data.fileList.map(f => f.name)
      files = files.filter(f => !existingFiles.includes(f.name) && f.type.match(/image[/][a-z]*/))
      dispatch({ type: 'ADD_FILE_TO_LIST', files });
    }
    setMessage('');
    setUploadPercentage(0);
  }
  const uploadHandler = async event => {
    event.preventDefault();
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
        ));
        
        // Clear percentage
        setTimeout(() => {
          setUploadPercentage(0);
          setMessage('');
        }, 4000);

        
      }
    })
    setMessage('File Uploaded');
    setRess(res.data);
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
        <input type="submit" value="Upload" className="submitBtn" />
        
      </form>
      <Gallery data={ress}/>
      


      <ol className="dropped-files">
        {data.fileList.map(f => {
          return (
            <li key={f.name}>{f.name}</li>
          )
        })}
      </ol>
    </div>
  );
}

export default App;
