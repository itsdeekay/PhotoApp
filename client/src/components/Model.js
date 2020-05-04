import React from 'react';

const Model = props => {

    const { fileName, closeModel,prevImage,nextImage } = props;

    return (
        <div id="myModal" className="modal">

            <span className="close" onClick={closeModel}>&times;</span>

            <img className="modal-content fade" src={'/uploads/image720/' + fileName} id="img01" alt="" />
            <button type="button" className="prev" onClick={prevImage} >&#10094;</button>
            <button type="button" className="next" onClick={nextImage} >&#10095;</button>
            <div id="caption">{fileName}</div>
        </div>
    );
}
export default Model;