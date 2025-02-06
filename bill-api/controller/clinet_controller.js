const Client = require('../models/clinet_model');
const generateClientNumber = require('../utils/clientNumber');
const generateReferralCode = require('../utils/generateReferralCode'); 

// Create Client
const createClient = async (req, res) => {
    const {
        name,
        email,
        phone,
        gstno,
       
        addressLine1,
        City,
        State,
        pincode,
        company_name,
        isSameClient,
        shipToName,
        shipToaddressLine1,
        shipToCity,
        shipToState,
        shipTopincode,
        shipToEmail,
        shipToPhone,
        shipToGstno,
        shipToCompanyName
    } = req.body;

    try {
        // Validation: If isSameClient is false, make sure "Ship To" details are provided
        if (!isSameClient) {
            if (!shipToName || !shipToEmail || !shipToPhone || !shipToCompanyName || !shipToaddressLine1 || !shipToCity || !shipToState || !shipTopincode) {
                return res.status(400).json({
                    error: true,
                    message: "Please provide all 'Ship To' details when 'Bill To' and 'Ship To' are different."
                });
            }
        }

        const clientNumber = generateClientNumber();
        const referralCode = generateReferralCode();

        const clientData = new Client({
            name,
            clientno: clientNumber,
            loginid: clientNumber, // Save client number as loginid
            password: clientNumber, // Save client number as password
            company_name,
            City,
            State,
            addressLine1,
            pincode,
            email,
            phone,
            gstno,
           
            isSameClient,
            shipToName: isSameClient ? name : shipToName,
            shipToEmail: isSameClient ? email : shipToEmail,
            shipToPhone: isSameClient ? phone : shipToPhone,
            shipToGstno: isSameClient ? gstno : shipToGstno,
            shipToaddressLine1: isSameClient ? addressLine1 : shipToaddressLine1,
            shipToCity: isSameClient ? City : shipToCity,
            shipToState: isSameClient ? State : shipToState,
            shipTopincode: isSameClient ? pincode : shipTopincode,
            shipToCompanyName: isSameClient ? company_name : shipToCompanyName,
            referralCode
        });

        await clientData.save();

        return res.status(200).json({
            error: false,
            message: "Data saved successfully",
            data: [clientData]
        });

    } catch (error) {
        console.error("Internal server error", error);  // Log the error for debugging
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

// Get All Clients
const GetClientData = async (req, res) => {
    try {
        // Fetching all clients that are not deleted
        const getclientdata = await Client.find({
            is_deleted: { $ne: true }
        });

        // Counting the total number of clients (excluding deleted ones)
        const totalClients = await Client.countDocuments({
            is_deleted: { $ne: true }
        });

        return res.status(200).json({
            error: false,
            data: getclientdata,
            totalClients: totalClients  // Add the total client count to the response
        });
    } catch (error) {
        return res.status(404).json({
            error: true,
            message: "No data available",
            data: [],
            totalClients: 0  // If there's an error, also return totalClients as 0
        });
    }
};


// Get Specific Client by Client Number
const getClientByClientNo = async (req, res) => {
    const clientNo = req.params.clientno; // Extract client number from the request parameters

    try {
        const clientData = await Client.findOne({ clientno: clientNo });

        if (!clientData) {
            return res.status(404).json({
                error: true,
                message: "Client not found",
                data: []
            });
        }

        return res.status(200).json({
            error: false,
            data: [clientData]
        });

    } catch (error) {
        console.error("Error fetching client:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

// Update Client
const updateClient = async (req, res) => {
    try {
        const clientId = req.params.id;
        const {
            name,
            email,
            phone,
            gstno,
            company_name,
            City,
            State,
            pincode,
            addressLine1,
            
            isSameClient,
            shipToName,
            shipToEmail,
            shipToPhone,
            shipToGstno,
            shipToCompanyName
        } = req.body;

        // Validation: If isSameClient is false, make sure "Ship To" details are provided
        // if (!isSameClient) {
        //     if (!shipToName || !shipToEmail || !shipToPhone || !shipToCompanyName) {
        //         return res.status(400).json({
        //             error: true,
        //             message: "Please provide all 'Ship To' details when 'Bill To' and 'Ship To' are different."
        //         });
        //     }
        // }

        const updatedClient = {
            name,
            email,
            phone,
            gstno,
            company_name,
            City,
            State,
            pincode,
            addressLine1,
            company_name,
            isSameClient,
            shipToName: isSameClient ? null : shipToName,
            shipToEmail: isSameClient ? null : shipToEmail,
            shipToPhone: isSameClient ? null : shipToPhone,
            shipToGstno: isSameClient ? null : shipToGstno,
            shipToCompanyName: isSameClient ? null : shipToCompanyName
        };

        const client = await Client.findByIdAndUpdate(clientId, updatedClient, { new: true });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);

    } catch (error) {
        console.error("Error updating client:", error);
        res.status(500).json({ message: 'Error updating client' });
    }
};


// Delete Client (Soft Delete)
const deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        const updateClient = await Client.findByIdAndUpdate(
            id,
            { is_deleted: true },
            { new: true }
        );

        if (!updateClient) {
            return res.status(404).json({
                error: true,
                message: "Client not found"
            });
        }

        return res.status(200).json({
            error: false,
            message: "Client deleted successfully",
            data: [updateClient]
        });

    } catch (error) {
        console.error("Error deleting client:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

module.exports = { createClient, GetClientData, updateClient, deleteClient, getClientByClientNo };