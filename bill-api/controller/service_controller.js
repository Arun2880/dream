const Service = require('../models/service_model');
const Client = require('../models/clinet_model');

const createServices = async (req, res) => {
    const { clientno, services } = req.body;

    if (!clientno) {
        return res.status(400).json({
            error: true,
            message: "Client ID is required",
            data: []
        });
    }

    if (Array.isArray(services) && services.length > 0) {
        try {
            const client = await Client.findOne({ clientno });

            if (!client) {
                return res.status(404).json({
                    error: true,
                    message: "Client not found. Please add the client first.",
                    data: []
                });
            }

            const newServices = [];

            for (const service of services) {
                const { Servicename, price } = service;

                if (Servicename && price) {
                    const newService = new Service({
                        client: client._id,
                        Servicename,
                        price,
                        createdAt: new Date() // Ensure createdAt is set
                    });

                    await newService.save();
                    newServices.push(newService);
                } else {
                    return res.status(400).json({
                        error: true,
                        message: "Each service must have a name and price",
                        data: []
                    });
                }
            }

            return res.status(200).json({
                error: false,
                message: "Services added successfully.",
                data: newServices,
                Date
            });

        } catch (error) {
            console.error("Internal server error", error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error"
            });
        }
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid services array",
            data: []
        });
    }
};

module.exports = createServices;