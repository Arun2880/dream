const multer=require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`);
    },
});


const upload=multer({
    storage:storage,

    fileFilter:(req,file,cb)=>{
        const fileTypes=/jpeg|jpg|png|gif/;
        const extName=fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
        const mimeType=fileTypes.test(file.mimetype);

        if(extName && mimeType){
            cb(null,true);
        }else{
            cb(new Error("Only image files allowed !"));
        }
    },
})
module.exports = {upload};
