const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const Jimp = require('jimp');
var mongoose = require('mongoose');
const Photo = require("./Photo");
router = express.Router();
var photos = mongoose.model('Photos');


router.post('/upload', (req, res) => {

    console.log('upload api');
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if (files == undefined) {
            return res.status(400).json({ msg: 'No file uploaded' });

        } else {

            if (Array.isArray(files.arrayOfFilesName)) {
                 files.arrayOfFilesName.map(async file => {
                    var oldpath = file.path;
                    var newpath = `${__dirname}/../client/public/uploads/original/${file.name}`;

                    fileRename(oldpath, newpath);
                    const photo = new Photo({
                        fileName: file.name
                    });
                    photo.save(function(error){
                        if(error){ 
                          throw error;
                        } 
                        //res.redirect('/?msg=1');
                     });

                });
                files.arrayOfFilesName.map(async file => {
                    var newpath = `${__dirname}/../client/public/uploads/original/${file.name}`;
                    var newpath720 = `${__dirname}/../client/public/uploads/image720/${file.name}`;
                    var newpath240 = `${__dirname}/../client/public/uploads/image240/${file.name}`;

                    imageRendition(newpath, 720, 100, newpath720);
                    imageRendition(newpath, 240, 100, newpath240);

                });
            }
            else {
                var oldpath = files.arrayOfFilesName.path;
                var newpath = `${__dirname}/../client/public/uploads/original/${files.arrayOfFilesName.name}`;
                var newpath720 = `${__dirname}/../client/public/uploads/image720/${files.arrayOfFilesName.name}`;
                var newpath240 = `${__dirname}/../client/public/uploads/image240/${files.arrayOfFilesName.name}`;
                fileRename(oldpath, newpath);
                
                const photo = new Photo({
                    fileName: files.arrayOfFilesName.name
                });
                photo.save(function(error){
                    if(error){ 
                      throw error;
                    } 
                    //res.redirect('/?msg=1');
                 });

                imageRendition(newpath, 720, 100, newpath720);
                imageRendition(newpath, 240, 100, newpath240);

            }

        }
        console.log('Uploaded');
        return res.status(200).json({ msg: 'File uploaded' });
    });
});

router.get('/images',paginatedResults(photos),(req,res) => {
    // let groupedResults = groupBy(res.paginatedResults.results, (result) => moment(result['createdAt'], 'YYYY-MM-DD').startOf('date').format('DD MMM YYYY'));
    // console.log(groupedResults);
    res.status(200).json( { title: 'Files', msg:req.query.msg, photolist : res.paginatedResults.results, morePage: res.paginatedResults.next===undefined ? false : true});
    //return res.status(200).json({msg:'OK'});
//     photos.find({}, ['fileName','createdAt'], {sort:{ createdAt: -1} }, function(err, phts) {
//         if(err) throw err;
//         //console.log(phts);
//         res.status(200).json( { title: 'Files', msg:req.query.msg, photolist : phts });
//    });
});

const imageRendition = (path, type, quality, writepath) => {
    Jimp.read(path).then(file => {
        var w = file.bitmap.width;
        var h = file.bitmap.height;
        if (w > h) {
            h = type;
            w = Jimp.AUTO;

        } else {
            w = type;
            h = Jimp.AUTO;
        }
        try {
            fs.unlinkSync(writepath)
        } catch (err) {

        } finally {
            return file.resize(w, h).quality(quality).write(writepath);
        }

    }).catch(err => {
        console.error(err);
    });
}
 function fileRename(oldpath, newpath) {
    try {
        fs.unlinkSync(newpath)
    } catch (err) {

    } finally {
        const s =  fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
        });
    }

}

function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }else{
          results.next = undefined;
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await model.find({},['fileName','createdAt'],{sort:{ createdAt: -1} }).limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }
module.exports = router;