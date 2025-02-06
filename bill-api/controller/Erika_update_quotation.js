const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const Billing = require('../models/Erika_quotation_model');
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

exports.updateQuotation = async (req, res) => {
  try {
    const { id, updatedClient, updatedProducts } = req.body;
    const generateInvoice = generateInvoiceNumber();

    // Validate the required fields
    if (!id || (!updatedClient && !updatedProducts)) {
      return res.status(400).json({ message: 'GST Number and either client or product data are required to update.' });
    }

    // Find the billing record by GST number
    const billingRecord = await Billing.findOne({ '_id': id });
    
    
    if (!billingRecord) {
      return res.status(404).json({ message: 'Billing record with the provided GST Number not found.' });
    }

    // Update client details if provided
    if (updatedClient) {
      billingRecord.client = { ...billingRecord.client, ...updatedClient }; 
    }

    // Update product details if provided
    if (updatedProducts && updatedProducts.length > 0) {
      
      const updatedProductsWithTotals = updatedProducts.map((product) => {
        const price = product.price;
        const quantity = product.quantity;
        const gst = product.gst || 18;

        const baseTotal = price * quantity;
        const gstAmount = (baseTotal * gst) / 100;
        const total = baseTotal + gstAmount;

        return { ...product, total }; // Include recalculated total with GST
      });

      // Update the products array in the billing record
      billingRecord.products = updatedProductsWithTotals;

      // Recalculate the total amount for the bill
      billingRecord.totalAmount = updatedProductsWithTotals.reduce((sum, product) => sum + product.total, 0);
    }

    await billingRecord.save();




     const htmlContent = await ejs.renderFile(path.join(__dirname, '../views/updated_quotation.ejs'), {
          billingRecord,
          generateInvoice,
          
          
        });



    const pdfPath = path.join(__dirname, '../Erika_quotation', `updatedQuotation_${id}.pdf`);

    const options = {
      format: 'A4',
      orientation: 'portrait',
      
      type: 'pdf',
      quality: '100',
      renderDelay: 1000, 
    };
     pdf.create(htmlContent, options).toFile(pdfPath, (err, result) => {
          if (err) {
            console.error('Error generating PDF:', err);
            return res.status(500).json({ message: 'Error generating PDF', error: err.message });
          }
    
          // Send the response with the path to the generated PDF
          res.status(200).json({
            message: 'Billing PDF created successfully!',
            pdfPath: `/Erika_quotation/updatedQuotation_${id}.pdf`,
            data: billingRecord,
          });
        });
    // res.status(200).json({
    //   message: 'Billing record updated successfully.',
    //   updatedBilling: billingRecord,
    // });
  } catch (error) {
    console.error('Error updating billing record:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




// -------------------------------- fetch all the quotation -----------------------------------------------//


// Controller to fetch all billing records
exports.fetchAllQuotation = async (req, res) => {
  try {
    // Optional: Add pagination support (limit and skip)
    const { page = 1, limit = 10 } = req.query; // Default to page 1, limit to 10 records

    const skip = (page - 1) * limit; // Skip for pagination

    // Find all billing records with pagination (if needed)
    const bills = await Billing.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ billDate: -1 }); // Sort by billDate descending (most recent first)

    // Find the total number of bills for pagination
    const totalBills = await Billing.countDocuments();

    // Return the result with pagination information
    res.status(200).json({
      message: 'All billing records fetched successfully.',
      totalBills,
      totalPages: Math.ceil(totalBills / limit), 
      currentPage: Number(page),
      bills,
    });
  } catch (error) {
    console.error('Error fetching billing records:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

