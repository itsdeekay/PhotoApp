import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Model from './Model';
import debounce from "lodash.debounce";
import moment from 'moment/moment'
const groupBy = require('lodash.groupby');
//const moment = require('moment');

const Gallery = props => {
    const [activeImage, setActiveImage] = useState('');
    const [activeId, setActiveId] = useState(0);
    const [page, setPage] = useState(1);
    //const [loading, setloading] = useState(false);
    const [morePage, setMorePage] = useState(false);
    const limit = 30;
    const [fileList, setFileList] = useState([]);
    const [listIndex, setListIndex] = useState(0);
    const [groupImages,setGroupImages] = useState({});
    
    window.onscroll = debounce(() => {
      if ( !morePage) return;
      if (window.innerHeight + document.documentElement.scrollTop + 1
        >= document.documentElement.offsetHeight) {
         setPage(page+1);
        setListIndex(listIndex+limit);
      }
    },100);

    const closeModel = () =>{
        setActiveImage('');
        setActiveId(0);
    }
    const prevImage = () =>{
        let aid = activeId-1<0 ? activeId : activeId-1;
        let fileObject = fileList.filter(e => {
            return e.id === aid;
        })
        setActiveImage(fileObject[0].file.fileName)
        setActiveId(aid);
    }
    const nextImage = async() =>{
      if(activeId+1===fileList.length ){
        await setPage(page+1);
        await setListIndex(listIndex+limit);

      }
      let aid = activeId+1===fileList.length ? activeId : activeId+1;
      let fileObject = fileList.filter(e => {
          return e.id === aid;
      })
        setActiveImage(fileObject[0].file.fileName)
        setActiveId(aid);
    }

    // const reducer = (state, action) => {
    //     switch (action.type) {
    //       case 'FETCH_IMAGES':
    //         let concatArray = listIndex===0 ? [] : data.fileList;
    //         return { fileList: concatArray.concat(action.files.map((f,i) => ({
    //                 id:listIndex+i,
    //                 file : f
    //         }))),
    //         morePage : action.pages
    //       };
    //       default:
    //         return state;
    //     }
    //   };
      // const [data, dispatch] = React.useReducer(
      //   reducer, { fileList: [],morePage : false }
      // )


async function fetchImages() {
    try {
      const response = await axios.get(`/images?page=${page}&limit=${limit}`);
      //await dispatch({ type: 'FETCH_IMAGES',files: response.data.photolist,pages : response.data.morePage} );
      const setid = page===1 ? listIndex :listIndex+limit;
      const tempList = fileList.concat(response.data.photolist.map((f, i) => ({
        id: setid + i,
        file: f
      })));
      setMorePage(response.data.morePage); 
      setFileList(tempList);
      setGroupImages(groupBy(fileList, (result) => moment(result.file['createdAt'], 'YYYY-MM-DD').startOf('date').format('DD MMM YYYY')))
      
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(()=>{
    fetchImages();
}, [page])
useEffect(()=>{
  setGroupImages(groupBy(fileList, (result) => moment(result.file['createdAt'], 'YYYY-MM-DD').startOf('date').format('DD MMM YYYY')))
}, [fileList])
  
  return (
    <div className='gallery'>
      <div className="rowBox"  >
        {Object.keys(groupImages).map(element => {
          
          return(
            <div className="row-section">
              <div className="groupHeader">{element}</div>
              <hr/>
              <div className="row">
              {groupImages[element].map(f => {
    return (

      <div className="column">
        <img value={f.id} alt={f.file.fileName} src={'/uploads/image720/' + f.file.fileName} onClick={() => {
          setActiveImage(f.file.fileName);
          setActiveId(f.id);
        }} className="myImages" />
      </div>
    )
  })}       </div>
            </div>
          )
    
})
}

      </div>
      {activeImage ?
        <Model fileName={activeImage} closeModel={closeModel} prevImage={prevImage} nextImage={nextImage} />
        : null
      }

    </div>
  );
};

export default Gallery;