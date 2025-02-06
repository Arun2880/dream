import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Install axios if not already
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Home() {
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        categories: 0,
        customers: 0,
        alerts: 0,
        revenue: 0,
        barChartData: [],
        lineChartData: [],
    });

    useEffect(() => {
        // Fetch data from your backend API
        const fetchData = async () => {
            try {
                // Fetch dashboard data
                const dashboardResponse = await axios.get('https://crm.dreambytesolution.com/dream/getclients'); // Your API URL for dashboard

                // Fetch chart data
                const chartResponse = await axios.get('https://crm.dreambytesolution.com/dream/getChart'); 

               
                const processedBarChartData = chartResponse.data.barChartData.map(item => ({
                    name: `Month ${item.month}`,
                    revenue: item.totalRevenue,
                }));

                const processedLineChartData = chartResponse.data.lineChartData.map(item => ({
                    name: `Month ${item.month}`,
                    
                    billCount: item.billCount,
                }));

                // Update state with fetched data
                setDashboardData({
                    // products: dashboardResponse.data.products,
                    // categories: dashboardResponse.data.categories,
                    customers: dashboardResponse.data.totalClients,
                    totalBiils: chartResponse.data.totalBills,
                    revenue: chartResponse.data.totalRevenueAmount,
                    barChartData: processedBarChartData,
                    lineChartData: processedLineChartData,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="main-container">
            <div className="main-title">
                <h3>DASHBOARD</h3>
            </div>

            <div className="main-cards">
                <div className="card">
                    <div className="card-inner">
                        <h3>Total Revenue</h3>
                        <BsFillArchiveFill className="card_icon" />
                    </div>
                    <h1>{dashboardData.revenue}</h1>
                </div>
                {/* <div className="card">
                    <div className="card-inner">
                        <h3>CATEGORIES</h3>
                        <BsFillGrid3X3GapFill className="card_icon" />
                    </div>
                    <h1>{dashboardData.categories}</h1>
                </div> */}
                <div className="card">
                    <div className="card-inner">
                        <h3>Clients</h3>
                        <BsPeopleFill className="card_icon" />
                    </div>
                    <h1>{dashboardData.customers}</h1>
                </div>
                <div className="card">
                    <div className="card-inner">
                        <h3>Total Bills</h3>
                        <BsFillBellFill className="card_icon" />
                    </div>
                    <h1>{dashboardData.totalBiils}</h1>
                </div>
            </div>

            <div className="charts">
                {/* Bar Chart for Monthly Revenue */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={dashboardData.barChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>

                {/* Line Chart for Number of Bills */}
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={dashboardData.lineChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="billCount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </main>
    );

}

export default Home;
