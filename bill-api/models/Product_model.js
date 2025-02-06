const mongoose=require('mongoose');

const ProductSchema=new mongoose.Schema({

productname:{
    type:String,
    require:true
},
image:{
    type:String,
    require:true
},
price:{
    type:String,
    require:true
},

brand:{
    type:String,
},
gst:{
    type:Number,
    require:true
},
is_deleted:{
    type:Boolean,
    default:0
},



});

module.exports=mongoose.model('product',ProductSchema);