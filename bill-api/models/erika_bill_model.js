// models/Billing.js

const mongoose = require('mongoose');

// Define the product schema with gst field
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },   // Price of a single unit
  quantity: { type: Number, required: true }, // Quantity purchased
  gst: { type: Number, default: 18 },         // GST percentage (default is 18%)
  total: { type: Number, required: true },    // Total price (price * quantity + GST)
});

// Define the billing schema
const billingSchema = new mongoose.Schema({
  client: {
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    gstno: { type: String },
    state: { type: String },
    city: { type: String },
    phone: { type: String },
    addressLine1: { type: String },
  },
  products: [productSchema], // Array of products
  totalAmount: { type: Number, required: true }, // Sum of all product totals including GST
  billDate: { type: Date, default: Date.now }, // Date when the bill is created
});

// Method to calculate the total for each product including GST
productSchema.methods.calculateTotal = function () {
  const price = this.price || 0;
  const quantity = this.quantity || 0;
  const gstRate = this.gst || 18; // Default GST is 18%

  // Calculate the base total: price * quantity
  const baseTotal = price * quantity;
  
  // Calculate the GST amount for the product
  const gstAmount = (baseTotal * gstRate) / 100;
  
  // Calculate the final total (including GST)
  this.total = baseTotal + gstAmount;
  return this.total;
};

// Create a method to calculate the total amount for the bill including all products
billingSchema.methods.calculateTotalAmount = function () {
  this.totalAmount = this.products.reduce((sum, product) => {
    return sum + product.total; // Add each product's total (including GST)
  }, 0);
  return this.totalAmount;
};

// Create the model
const Billing = mongoose.model('ErikaBilling', billingSchema);

module.exports = Billing;
