import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/Addclient.css";
import { Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Revenue = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);

  const handleChangeStart = (e) => {
    setStartDate(e.target.value);
  };

  const handleChangeEnd = (e) => {
    setEndDate(e.target.value);
  };

  const handleChangeRevenue = async (e) => {
    e.preventDefault();
    try {
      const url = `https://bill.dreambytesolution.com/dream/genraterevenu`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const requestBody = {
        "startDate": startDate,
        "endDate": endDate
      };

      const response = await axios.post(url, requestBody, { headers });
      const data = response.data;

      if (data.success) {
        setTotalRevenue(data.totalRevenue);
      } else {
        console.error("Failed to fetch revenue data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Prepare data for the chart
  const chartData = [
    { name: 'Total Revenue', revenue: totalRevenue }
  ];

  return (
    <div className='contain'>
      <div className="header1">
        <div className="head">
          <div className="head1">
            <h3>Revenue</h3>
          </div>
          <div className="head2">
            <p> Revenue </p>
          </div>
        </div>
        <Form className='row g-3'>
          <Col md={6}>
            <Form.Group controlId='forStartDate'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='Start Date'
                name='startDate'
                value={startDate}
                onChange={handleChangeStart}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='forEndDate'>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='End Date'
                name='endDate'
                value={endDate}
                onChange={handleChangeEnd}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Button variant="primary" type="submit" onClick={handleChangeRevenue}>
              Submit
            </Button>
          </Col>
        </Form>
      </div>

      <div className="header1">
        <h3>Total Revenue: ₹{totalRevenue.toFixed(2)}</h3>
      </div>

      <div className="header1">
        <BarChart
          width={600}
          height={300}
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default Revenue;
