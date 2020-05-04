import React from 'react';

const DragAndDrop = props => {

  const { data, dispatch, onClick } = props;

  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth + 1 });
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth - 1 });
    if (data.dropDepth > 0) return
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = 'copy';
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();

    let files = [...e.dataTransfer.files];

    if (files && files.length > 0) {
      const existingFiles = data.fileList.map(f => f.name)
      files = files.filter(f => !existingFiles.includes(f.name) && f.type.match(/image[/][a-z]*/))

      dispatch({ type: 'ADD_FILE_TO_LIST', files });
      dispatch({ type: 'SET_DROP_DEPTH', dropDepth: 0 });
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
    }
  };

  return (

    <div className={data.inDropZone ? 'drag-drop-zone inside-drag-area' : 'drag-drop-zone'}
      onDrop={e => handleDrop(e)}
      onDragOver={e => handleDragOver(e)}
      onDragEnter={e => handleDragEnter(e)}
      onDragLeave={e => handleDragLeave(e)}
      onClick ={onClick}
    >
      <p>Drag files here or click to upload (only Images)</p>
    </div>
  );
};

export default DragAndDrop;