const PDFDocument = require('pdfkit');

exports.generatePDF = async (client, services, totalAmount) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        // Header
        doc.fontSize(20).text('DREAMBYTE SOLUTIONS (OPC) PVT. LTD.', { align: 'center' });
        doc.fontSize(10).text('Near Siddhartha Group of Institutions Danda Khudanewala, Sahastradhara Road, Dehradun', { align: 'center' });
        doc.text('city, 248001,Uttarakhand, India', { align: 'center' });
        doc.text('Mobile no.: +91 8279720490', { align: 'center' });
        doc.text('GSTIN : 05AAKCD5928M1Z7', { align: 'center' });

        doc.moveDown();
        doc.fontSize(12).text(`Invoice no.: DB/UK/24-25/003`, 50, 150);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 400, 150);

        // Client Info
        doc.moveDown().moveDown();
        doc.fontSize(12).text(`BILL TO:`, 50, 200);
        doc.fontSize(10).text(`Name: ${client.name}`, 50, 220);
        doc.text(`Email: ${client.email}`, 50, 235);
        doc.text(`Phone: ${client.phone}`, 50, 250);
        doc.text(`Address: ${client.address}`, 50, 265);

        doc.fontSize(12).text(`SHIP TO:`, 300, 200);
        doc.fontSize(10).text(`Name: ${client.name}`, 300, 220);
        doc.text(`Email: ${client.email}`, 300, 235);
        doc.text(`Phone: ${client.phone}`, 300, 250);
        doc.text(`Address: ${client.address}`, 300, 265);

        // Table
        doc.moveDown().moveDown();
        doc.fontSize(12).text('SERVICES', 50, 310);
        doc.text('RATE', 200, 310);
        doc.text('TAX', 300, 310);
        doc.text('AMOUNT', 400, 310);

        let yPosition = 330;
        for (const service of services) {
            doc.fontSize(10).text(service.service.name, 50, yPosition);
            doc.text(service.rate.toFixed(2), 200, yPosition);
            doc.text(service.tax.toFixed(2), 300, yPosition);
            doc.text(service.amount.toFixed(2), 400, yPosition);
            yPosition += 20;
        }

        doc.moveDown().moveDown();
        doc.fontSize(12).text(`SUBTOTAL`, 50, yPosition);
        doc.text(`₹${totalAmount.toFixed(2)}`, 400, yPosition);

        doc.end();
    });
};
