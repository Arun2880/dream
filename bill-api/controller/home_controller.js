const Billing = require('../models/billing_model');  // Billing model

// Controller function to fetch chart data 
const getChartData = async (req, res) => {
  try {
    // Aggregating total revenue per month for Bar Chart
    const barChartData = await Billing.aggregate([
      {
        $group: {
          _id: { $month: '$date' },  // Group by month of the date field
          totalRevenue: { $sum: '$totalAmount' },  // Sum up totalAmount for each month
        },
      },
      {
        $project: {
          month: '$_id',  // Rename _id to month
          totalRevenue: 1,  // Keep totalRevenue field
          _id: 0,  // Exclude _id field from result
        },
      },
      { $sort: { month: 1 } },  // Sort by month in ascending order
    ]);

    // Aggregating number of bills issued per month for Line Chart
    const lineChartData = await Billing.aggregate([
      {
        $group: {
          _id: { $month: '$date' },  // Group by month of the date field
          billCount: { $sum: 1 },  // Count the number of bills for each month
        },
      },
      {
        $project: {
          month: '$_id',  // Rename _id to month
          billCount: 1,  // Keep billCount field
          _id: 0,  // Exclude _id field from result
        },
      },
      { $sort: { month: 1 } },  // Sort by month in ascending order
    ]);

    // Calculate total revenue across all months
    const totalRevenue = await Billing.aggregate([
      {
        $group: {
          _id: null,  // We are not grouping by anything, we just want the total sum
          totalRevenue: { $sum: '$totalAmount' },  // Sum up the totalAmount across all records
        },
      },
      {
        $project: {
          totalRevenue: 1,  // Keep totalRevenue field
          _id: 0,  // Exclude _id field
        },
      },
    ]);

    // Calculate total bill count across all months
    const totalBillCount = await Billing.aggregate([
      {
        $count: "totalBills"  // Count all documents (bills)
      }
    ]);

    // If total revenue is available, extract the value
    const totalRevenueAmount = totalRevenue[0] ? totalRevenue[0].totalRevenue : 0;

    // If total bill count is available, extract the value
    const totalBills = totalBillCount[0] ? totalBillCount[0].totalBills : 0;

    // Send the data as response
    res.json({
      barChartData,
      lineChartData,
      totalRevenueAmount,  // Add total revenue to the response
      totalBills  // Add total bill count to the response
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};

module.exports = {
  getChartData,
};
