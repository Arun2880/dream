const Subclient=require('../models/sub_client_model');
const Client = require('../models/clinet_model');


const AddSubclient = async (req, res) => {
    const { sub_name, sub_phone, sub_email, refrence_number } = req.body;

    try {
        if (!sub_phone || !refrence_number) {
            return res.status(400).json({
                error: true,
                message: "Phone number and reference number are required."
            });
        }

        // Find the client by reference number
        const client = await Client.findOne({ referralCode: refrence_number });

        if (!client) {
            return res.status(404).json({
                error: true,
                message: "Client not found with the given reference number."
            });
        }

        const newSubclient = new Subclient({
            sub_name,
            sub_phone,
            sub_email,
            refrence_number,
            client_name: client.name, // Save client name with subclient
            client_id: client._id // Save client ID with subclient
        });

        await newSubclient.save();

        return res.status(200).json({
            error: false,
            message: "Subclient added successfully",
            data: [newSubclient]
        });

    } catch (error) {
        console.error("Error adding subclient:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};



// ----------------------------------get all sub client------------------------------


const Getallsubclient = async (req, res) => {
    try {
        const getSubclients = await Subclient.find({ is_deleted: { $ne: true } })
            .populate('client_id', 'name'); // Populate client name

        return res.status(200).json({
            error: false,
            message: "All subclients are here",
            data: getSubclients
        });

    } catch (error) {
        console.error("Error fetching subclients:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};

// -------------------------------get single client---------------------
const Getsinglesubclient = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                error: true,
                message: "Subclient ID is required."
            });
        }

        const getSingleSubclient = await Subclient.findById(id)
            .populate('client_id', 'name'); // Populate client name

        if (!getSingleSubclient) {
            return res.status(404).json({
                error: true,
                message: "Subclient not found."
            });
        }

        return res.status(200).json({
            error: false,
            message: "Subclient data is here",
            data: [getSingleSubclient]
        });

    } catch (error) {
        console.error("Error fetching subclient:", error);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
};



// -------------------------------------get all subclient--------------------------

const getSubclientsByClient = async (req, res) => {
    const { clientId } = req.params;

    try {
        // Find the client using clientno or _id
        const client = await Client.findOne({
            $or: [
                { _id: clientId }, // Check for ObjectId
                { clientno: clientId } // Check for clientno
            ]
        });

        if (!client) {
            return res.status(404).json({
                error: true,
                message: 'Client not found'
            });
        }

        // Find all subclients tagged to the found client
        const subclients = await Subclient.find({
            client_id: client._id, // Use client_id to find subclients
            is_deleted: false
        }).populate('client_id', 'name'); // Populate client name

        return res.status(200).json({
            error: false,
            message: `Subclients tagged to client ${client.name}`,
            data: `subclients`
        });
    } catch (error) {
        console.error("Error fetching subclients:", error);
        return res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
    }
};




module.exports={AddSubclient,Getallsubclient,Getsinglesubclient,getSubclientsByClient};