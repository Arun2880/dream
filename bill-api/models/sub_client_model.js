const mongoose = require('mongoose');

const SubclientSchema = new mongoose.Schema({
    sub_name: {
        type: String,
        required: true
    },
    sub_phone: {
        type: String,
        required: true
    },
    sub_email: {
        type: String
    },
    refrence_number: {
        type: String,
        required: true
    },
    client_name: {
        type: String 
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client' // Reference to Client model
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Subclient', SubclientSchema);