const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
const Document = require('../models/billing_model');
const Client = require('../models/clinet_model');
const Service = require('../models/service_model');
const numberToWords = require('number-to-words');

// Function to generate invoice number
const generateInvoiceNumber = async (type) => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const sessionYear = `${currentYear.toString().slice(-2)}-${nextYear.toString().slice(-2)}`;
    const prefix = type === 'Bill' ? 'DB/UK' : 'QU/UK';

    const lastDoc = await Document.findOne({
        invoiceNumber: new RegExp(`^${prefix}/${sessionYear}/`)
    }).sort({ createdAt: -1 }).exec();

    let newInvoiceNumber = `${prefix}/${sessionYear}/001`;

    if (lastDoc && lastDoc.invoiceNumber) {
        const lastInvoiceNumber = lastDoc.invoiceNumber;
        const parts = lastInvoiceNumber.split('/');
        if (parts.length === 4 && parts[2] === sessionYear) {
            const newNum = parseInt(parts[3], 10) + 1;
            const newNumPadded = newNum.toString().padStart(3, '0');
            newInvoiceNumber = `${prefix}/${sessionYear}/${newNumPadded}`;
        }
    }

    return newInvoiceNumber;
};

const createDocument = async (req, res) => {
    const { clientId, date, includeGST, type } = req.body;

    try {
        // Check if the client exists
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ error: true, message: 'Client not found' });
        }

        // Validate that the date is provided and is in a correct format
        if (!date) {
            return res.status(400).json({ error: true, message: 'Date is required' });
        }

        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ error: true, message: 'Invalid date and time format' });
        }

        // You can use the provided date directly without modifying its time part
        const startDate = new Date(dateObj); // Keep the original time
        const endDate = new Date(dateObj);

        // If you want to calculate endDate with the exact time, do the following
        endDate.setHours(23, 59, 59, 999); // endDate at the very last moment of the provided date

        let totalRate = 0;
        let totalTax = 0;
        const serviceDetails = [];

        // Fetch services created within the provided date range (with time)
        const services = await Service.find({
            client: clientId,
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Iterate over the services and calculate prices and taxes
        for (const service of services) {
            const { _id, Servicename, price } = service;

            let tax = 0;
            let sgst = 0;
            let cgst = 0;
            let gstLabel = '';

            if (includeGST) {
                tax = price * 0.05;
                if (client.State.toLowerCase() === 'uttarakhand') {
                    sgst = tax / 2;
                    cgst = tax / 2;
                    gstLabel = 'SGST/CGST';
                } else {
                    gstLabel = 'GST';
                }
                totalTax += tax;
            }

            totalRate += price;

            serviceDetails.push({
                serviceId: _id,
                name: Servicename,
                price,
                tax,
                sgst,
                cgst,
                gstLabel
            });
        }

        const totalAmount = totalRate + totalTax;
        const amountInWords = numberToWords.toWords(totalAmount);
        const invoiceNumber = await generateInvoiceNumber(type);

        // Create a new document
        const newDocument = new Document({
            clientId: client,
            services: serviceDetails,
            totalAmount,
            totalRate,
            invoiceNumber,
            date: startDate, // Save the full date with time
            includeGST,
            type
        });

        await newDocument.save();

        // Path for the invoice PDF
        const pdfPath = path.join(__dirname, '..', 'invoices', `invoice-${newDocument._id}.pdf`);

        // Render the EJS template and create PDF
        ejs.renderFile(path.join(__dirname, '..', 'views', type === 'Bill' ? 'invoice.ejs' : 'quationinvoice.ejs'), {
            client,
            services: serviceDetails,
            totalRate,
            totalTax,
            totalAmount,
            amountInWords,
            invoiceNumber: newDocument.invoiceNumber,
            date: newDocument.date ? newDocument.date.toLocaleString() : new Date().toLocaleString(),
            includeGST
        }, (err, html) => {
            if (err) {
                console.error('Error rendering EJS template', err);
                return res.status(500).json({ error: true, message: 'Error rendering EJS template' });
            }

            pdf.create(html).toFile(pdfPath, async (err) => {
                if (err) {
                    console.error('Error creating PDF', err);
                    return res.status(500).json({ error: true, message: 'Error creating PDF' });
                }

                newDocument.pdfPath = pdfPath;
                await newDocument.save();

                return res.status(201).json({
                    error: false,
                    message: `${type} created successfully`,
                    data: {
                        newDocument,
                        pdfPath: `/invoices/invoice-${newDocument._id}.pdf`,
                        amountInWords
                    }
                });
            });
            console.log("new id of billing pdf:", newDocument._id);
        });

    } catch (error) {
        console.error('Internal server error', error);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};
 


// _____________________________ Update Billing___________________________________/

const updateDocument = async (req, res) => {
    const { documentId, services, includeGST, date } = req.body;
    const _id = req.params;  

    try {
        // Check if the document exists
        const document = await Document.findById(_id);
        if (!document) {
            return res.status(404).json({ error: true, message: 'Document not found' });
        }

        // Fetch the client based on the document's clientId
        const client = await Client.findById(document.clientId);
        if (!client) {
            return res.status(404).json({ error: true, message: 'Client not found' });
        }

        let totalRate = 0;
        let totalTax = 0;
        const serviceDetails = [];

        // Process each service and update totals
        for (const service of services) {
            const { serviceId, price } = service;

            // Ensure price is treated as a number
            const priceNumber = parseFloat(price); // Convert price to number
            if (isNaN(priceNumber)) {
                return res.status(400).json({ error: true, message: `Invalid price for service ID ${serviceId}` });
            }

            // Fetch the service details
            const serviceDetailsFromDb = await Service.findById(serviceId);
            if (!serviceDetailsFromDb) {
                return res.status(404).json({ error: true, message: `Service with ID ${serviceId} not found` });
            }

            const { Servicename } = serviceDetailsFromDb;
            let tax = 0;
            let sgst = 0;
            let cgst = 0;
            let gstLabel = '';

            if (includeGST) {
                tax = priceNumber * 0.18;  // Calculate tax based on price
                if (client.State.toLowerCase() === 'uttarakhand') {
                    sgst = tax / 2;
                    cgst = tax / 2;
                    gstLabel = 'SGST/CGST';
                } else {
                    gstLabel = 'GST';
                }
                totalTax += tax;  // Accumulate total tax
            }

            totalRate += priceNumber;  // Accumulate total rate

            // Push service details to serviceDetails array
            serviceDetails.push({
                serviceId: serviceDetailsFromDb._id,
                name: Servicename,
                price: priceNumber,
                tax,
                sgst,
                cgst,
                gstLabel
            });
        }

        // Calculate total amount
        const totalAmount = totalRate + totalTax;
        const amountInWords = numberToWords.toWords(totalAmount);

        // Update the document fields
        document.services = serviceDetails;
        document.totalAmount = totalAmount;
        document.totalRate = totalRate;
        document.includeGST = includeGST;
        // document.date = updatedDate; // Update the date if provided

        // Re-generate invoice number only if the type is 'Bill'
        if (document.type === 'Bill' && !document.invoiceNumber) {
            document.invoiceNumber = await generateInvoiceNumber('Bill');
        }

        // Save the updated document
        await document.save();

        // PDF Path for the updated invoice
        const pdfPath = path.join(__dirname, '..', 'invoices', `invoice-${document._id}.pdf`);
       

        // Render the EJS template for the PDF
        ejs.renderFile(path.join(__dirname, '..', 'views', document.type === 'Bill' ? 'invoice.ejs' : 'quationinvoice.ejs'), {
            client,
            services: serviceDetails,
            totalRate,
            totalTax,
            totalAmount,
            amountInWords,
            invoiceNumber: document.invoiceNumber,
            date: document.date ? document.date.toLocaleDateString() : new Date().toLocaleDateString(),
            includeGST
        }, (err, html) => {
            if (err) {
                console.error('Error rendering EJS template', err);
                return res.status(500).json({ error: true, message: 'Error rendering EJS template' });
            }

            // Create the updated PDF
            pdf.create(html).toFile(pdfPath, async (err) => {
                if (err) {
                    console.error('Error creating PDF', err);
                    return res.status(500).json({ error: true, message: 'Error creating PDF' });
                }

                document.pdfPath = pdfPath;
                await document.save();

                return res.status(200).json({
                    error: false,
                    message: 'Document services updated successfully',
                    data: {
                        document,
                        pdfPath: `/invoices/invoice-${document._id}.pdf`,
                        amountInWords
                    }
                });
            });
        });

    } catch (error) {
        console.error('Internal server error', error);
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};





const getPaginatedDocuments = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;  
    try { 
        const documents = await Document.find()
            .skip((page - 1) * limit)  
            .limit(parseInt(limit))  
            .sort({ date: -1 });  
        
        const totalCount = await Document.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            error: false,
            message: 'Documents fetched successfully',
            data: documents,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount
            }
        });
    } catch (error) {
        console.error('Error fetching documents', error);
        res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};









module.exports = { createDocument, updateDocument , getPaginatedDocuments};
