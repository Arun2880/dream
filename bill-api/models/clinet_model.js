const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    clientno: { type: String },
    company_name: { type: String },
    email: { type: String, required: false },
    phone: { type: Number, required: true },
    loginid: { type: String }, // Added loginid field
    password: { type: String },
    referralCode: { type: String, unique: true },
    gstno: { type: String },
    
    addressLine1:{
        type:String,
    },
    City:{

        type:String,
        require:true,
    },
    State:{
        type:String,
        require:true
    },
    pincode:{
        type:Number,
        require:true,
        minlength:6,
        mixlength:6
    },
    is_deleted: { type: Boolean, default: false },

    // Indicates if "Bill To" and "Ship To" clients are the same
    isSameClient: { type: Boolean, default: true },

    // "Ship To" Fields (used if isSameClient is false)
    shipToName: { type: String },
    shipToaddressLine1:{
        type:String,
    },
    shipToCity:{

        type:String,
        require:true,
    },
    shipToState:{
        type:String,
        require:true
    },
    shipTopincode:{
        type:Number,
        require:true,
        minlength:6,
        mixlength:6
    },
    shipToCompanyName: { type: String },
    shipToEmail: { type: String },
    shipToPhone: { type: Number },
    shipToGstno: { type: String },
    
});

module.exports = mongoose.model('Client', clientSchema);