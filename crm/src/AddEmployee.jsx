import React, { useState } from "react";
import { Container, Form, Col, Button } from "react-bootstrap";
import "./Css/Addclient.css"; // Your custom CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert";

const AddEmployee = () => {
  const [name, setname] =useState("");
  const handlechange = (event) => {
    setname(event.target.value);
  };

  const [email, setemail] = useState("");
  const handlechangeEmail = (event) => {
    setemail(event.target.value);
  };
  const [mobile, setmobile] = useState("");
  const handlechangeMobile = (event) => {
    setmobile(event.target.value);
  };
  const[department, setDepartment] = useState("");
  const handlechangeDepartment = (event) => {
    setDepartment(event.target.value);
    };
  const [address, setAddress] = useState("");
  const handlechangeAddress = (event) => {
    setAddress(event.target.value);
  };
 const [designation, setDesignation]= useState("");
 const handlechangeDesignation = (event) => {
  setDesignation(event.target.value);
  };
  const [joining_date, setJoining_date]= useState("");
  const handlechangeJoining_date = (event) => {
    setJoining_date(event.target.value);
    };
  const [salary, setSalary]= useState("");
  const handlechangeSalary = (event) => {
    setSalary(event.target.value);
  };
 const [bank_name,setBank_name]= useState("");
 const handlechangeBank_name = (event) => { 
  setBank_name(event.target.value);
  };
  const [bank_account, setBank_account]= useState("");
  const handlechangeBank_account = (event) => {
    setBank_account(event.target.value);
    };

  const addemployee = async (event) => {
    event.preventDefault();
    try {
      const url = "https://crm.dreambytesolution.com/dream/addemp";

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const requestBody = {
        emp_id:  "",
        emp_name: name,
        emp_address: address,
        emp_phone: parseInt(mobile),
        email:email,
        department:department,
        designation:designation,
        joining_date:joining_date,
        salary: parseInt(salary),
        bank_name: bank_name,
        bank_account:bank_account
        
      };

      const response = await axios.post(url, requestBody, {
        headers: headers,
      });
      console.log("request body of get qoute buy", requestBody);
      const data = response.data; 
    
      
      if (data.message==="Employee added successfully"){
        Swal({
          title: "Good job!",
          text: "Your data saved successfully",
          icon: "success"
        });
      }
      else{
        Swal({
          title: "Oops!",
          text: "Something went wrong",
          icon: "error"
          });
      }
      
      
  
    } catch (error) {
      console.error("Error connecting to API", error);
      throw error;
    }
  };

  return (
    <Container fluid className="contain">
      <div className="header1">
        {" "}
        <div className="head">
          <div className="head1">
            <h1>Add Employee</h1>
          </div>
          <div className="head2">
            <p>
              Employee<a href="/">/Add Employee</a>
            </p>
          </div>
        </div>
        <Form className="row g-3">
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={handlechange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={handlechangeAddress}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter phone number"
                value={mobile}
                onChange={handlechangeMobile}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCompanyName">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={handlechangeEmail}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formAddress">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                placeholder="Derpartment"
                value={department}
                onChange={handlechangeDepartment}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCity">
              <Form.Label>Dasignation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Dasignation"
                value={designation}
                onChange={handlechangeDesignation}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formstate">
              <Form.Label>Joining Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Joining Date"
                value={joining_date}
                onChange={handlechangeJoining_date}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPincode">
              <Form.Label>Salary</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Salary"
                value={salary}
                onChange={handlechangeSalary}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formpGst">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Bank Name"
                value={bank_name}
                onChange={handlechangeBank_name}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formpGst">
              <Form.Label>Bank Account</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Bank Account"
                value={bank_account}
                onChange={handlechangeBank_account}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Button variant="primary" type="submit" onClick={addemployee}>
              Submit
            </Button>
          </Col>
        </Form>
      </div>
    </Container>
  );
};

export default AddEmployee;
