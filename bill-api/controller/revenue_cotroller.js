const Billing=require('../models/billing_model');


const calculateRevenue = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // Validate date inputs
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required.',
            });
        }

        const query = {
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            },
        };

        // Aggregate to sum the totalAmount
        const revenueData = await Billing.aggregate([
            { $match: query },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to calculate revenue',
            error: error.message,
        });
    }
}


module.exports=calculateRevenue;