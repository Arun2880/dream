const express = require('express');
const cors = require('cors');
const path = require('path');
const allroutes = require('./routes/all_routes.js');
const erika_routes = require('./routes/Product_routes.js');
require('./db/conn');
const cookieParser = require('cookie-parser');


const app = express();

app.use(cookieParser());

// CORS Configuration for Cookie Handling
const corsOptions = {
  origin: 'https://crm.dreambytesolution.com/',  // Replace with your frontend URL (localhost for development)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allow cookies to be sent with requests
};

// Apply the CORS middleware globally with the configuration
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file routes (e.g., invoices, public files)
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use('/quationinvoices', express.static(path.join(__dirname, 'quationinvoices')));
app.use('/generated_pdfs', express.static(path.join(__dirname, 'generated_pdfs')));
app.use('/Erika_quotation', express.static(path.join(__dirname, 'Erika_quotation')));
app.use("/uploads", express.static("uploads"));
app.use("/public", express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Route handling
app.use('/dream', allroutes);
app.use('/erika', erika_routes);

const port = process.env.PORT || 4500;

// Start the server
app.listen(port, () => {
  console.log(`Server running successfully on port ${port}`);
});
