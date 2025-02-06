const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const Billing = require('../models/erika_bill_model');  // Assuming you have a Billing model
const Client = require('../models/clinet_model');


function generateInvoiceNumber() {
  // Get current date
  const currentDate = new Date();
  
  
  // Financial year calculation
  const year = currentDate.getFullYear();
  const financialYearStart = year - 1; // Financial year starts in April
  const financialYearEnd = year; // End of financial year
  const financialYear = `${financialYearStart.toString().slice(-2)}-${financialYearEnd.toString().slice(-2)}`;
  
  // Format the date (DD/MM/YYYY)
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dateFormatted = `${day}/${month}/${year}`;
  
  // Invoice number part (this would typically be incremented from a database)
  const invoiceNumber = 1; // This would be dynamically incremented from the database
  
  // Format invoice number as 4 digits (e.g., 0001)
  const formattedInvoiceNumber = invoiceNumber.toString().padStart(4, '0');

  // Combine the parts to generate the invoice number
  const invoiceNo = `DB/UK/${financialYear}/${formattedInvoiceNumber}`;

  return {invoiceNo, dateFormatted};
}

exports.createBilling = async (req, res) => {
  try {
    const { client, products ,shipTo} = req.body;
    const generateInvoice = generateInvoiceNumber(); 


   console.log("products", products);
    
    // Validation checks
    if (!client || !client.name || !client.email || !products || products.length === 0) {
      return res.status(400).json({ message: 'Client and product information are required.' });
    }
    

    // Map the products and calculate the total, GST, etc.
    const updatedProducts = products.map((product) => {
      const price = product.price;
      const quantity = product.quantity;
      const gst = product.gst || 0; 

      const baseTotal = price * quantity;
      const gstAmount = (baseTotal * gst) / 100;
      const total = baseTotal + gstAmount;

      return { ...product, total };
    });

    // Calculate the total amount for the invoice
    const totalAmount = updatedProducts.reduce((sum, product) => sum + product.total, 0);

    // Generate HTML content from EJS template
    const htmlContent = await ejs.renderFile(path.join(__dirname, '../views/billing_template.ejs'), {
      client,
      products: updatedProducts,
      shipTo,
      totalAmount,
      generateInvoice,
      
    });

    // Log HTML content to debug
    

    // Save the billing record to the DB (optional)
    const newBilling = new Billing({
      client,
      products: updatedProducts,
      totalAmount
    });
    await newBilling.save();

    // Define the file path to save the PDF
    const pdfPath = path.join(__dirname, '../generated_pdfs', `bill_${newBilling._id}.pdf`);

    // Options for html-pdf (adjust margins and format)
    const options = {
      format: 'A4',
      orientation: 'portrait',
      
      type: 'pdf',
      quality: '100',
      renderDelay: 1000, 
    };

    // Try to generate the PDF
    pdf.create(htmlContent, options).toFile(pdfPath, (err, result) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).json({ message: 'Error generating PDF', error: err.message });
      }

      // Send the response with the path to the generated PDF
      res.status(200).json({
        message: 'Billing PDF created successfully!',
        pdfPath: `/generated_pdfs/bill_${newBilling._id}.pdf`,
      });
    });

  } catch (error) {
    console.error('Error generating billing PDF:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
