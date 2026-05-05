import multer from "multer";

const storage = multer.diskstorage({
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

const upload = multer({storage})
export default upload