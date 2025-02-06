const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    services: [
        {
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Service',
                required: true
            },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            tax: { type: Number },
            sgst: { type: Number },
            cgst: { type: Number },
            gstLabel: { type: String }
        }
    ],
    totalRate: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['Bill', 'Quotation'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    includeGST: { type: Boolean, required: true },
    pdfPath: { type: String }
});

module.exports = mongoose.model('Billing', billingSchema);