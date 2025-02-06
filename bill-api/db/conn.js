const mongoose=require('mongoose');

mongoose.connect("mongodb://0.0.0.0:27017/Bill-api",{

}).then(()=>{
    console.log("Connect seccfully to mongoDB");
}).catch(()=>{
    console.log("Error come to mongoDb",error)
});
