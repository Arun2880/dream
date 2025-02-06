import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Form, Button, Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/stepper.css";
import axios from 'axios';
import Swal from "sweetalert2";

const Step3 = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [name, setName] = useState({
    name: "",
    email: "",
    phone: "",
    City: "",
    State: "",
    addressLine1: "",
    clientno: "",
    company_name: "",
    gstno: "",
  });

  const [dynamicInputs, setDynamicInputs] = useState([]);
  const [clientno, setClientno] = useState(sessionStorage.getItem("client no") || '');

  // Handler to add a new input field
  const addInputField = (e) => {
    e.preventDefault();
    setDynamicInputs([...dynamicInputs, { Servicename: '', price: '' }]);
  };

  // Handler to update the value of a dynamic input field
  const handleInputChange = (index, field, value) => {
    const newDynamicInputs = [...dynamicInputs];
    newDynamicInputs[index][field] = value;
    setDynamicInputs(newDynamicInputs);
  };

  // Handler to remove a dynamic input field
  const removeInputField = (index, e) => {
    e.preventDefault();
    const newDynamicInputs = dynamicInputs.filter((_, i) => i !== index);
    setDynamicInputs(newDynamicInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with inputs:', dynamicInputs);
    // Example of sending data to server
    try {
      const url = `https://bill.dreambytesolution.com/dream/services`;
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
      const response = await axios.post(url, { clientno, services: dynamicInputs }, { headers });
      sessionStorage.setItem("Date", response.data.data[0].createdAt);
  
      console.log(response);
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your services have been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log("Response not successful", response.status);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Something went wrong! Status Code: ${response.status}`,
        });
      }
    } catch (error) {
      console.error("API request failed:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the API request!",
      });
    }
  };
  
  useEffect(() => {
    const toy = sessionStorage.getItem("client no");
    handleExistance(toy);
  }, []);

  //----------------------------fetching the data-------------------------------//
  const handleExistance = async (toy) => {
    console.log("Client No:", toy);
    try {
      const url = `https://bill.dreambytesolution.com/dream/getuniclient/${toy}`;
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };

      const response = await axios.get(url, { headers });
      console.log("API response:", response.data); // Debugging 
      const fetch1 = response.data.data[0]; 
      console.log("Client Data:", fetch1);   
      console.log("Client Datafefew:", fetch1.name);   
      setName(fetch1);
      console.log(fetch1._id);
      sessionStorage.setItem("client id" , fetch1._id);
      
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  return (
    <Container>
      <h2 className="text-center">Billing Form</h2>
      <p>Data from URL1: {sessionStorage.getItem("client no")}</p>
     
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={name.name}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={name.email}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCompany">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your company name"
                name="company"
                value={name.company_name}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formGst">
              <Form.Label>GST Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your GST number"
                name="gst"
                value={name.gstno}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                name="address"
                value={name.addressLine1}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formState">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your state"
                name="state"
                value={name.State}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your city"
                name="city"
                value={name.City}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formContact">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your contact number"
                name="contact"
                value={name.phone}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formClientNo">
              <Form.Label>Client Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Client Number"
                name="clientno"
                value={clientno}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <div className="dynamic-inputs">
              <Button onClick={addInputField} type="button">Add Services</Button>
              {dynamicInputs.map((input, index) => (
                <div key={index} className="input-container">
                  <div className='newinput'>
                    <Form.Control
                      type="text"
                      value={input.Servicename}
                      placeholder="Enter the Service Name"
                      className="input-field newinput1"
                      onChange={(e) => handleInputChange(index, 'Servicename', e.target.value)}
                    />
                    <Form.Control
                      type="number"
                      value={input.price}
                      placeholder="Enter the cost of the service"
                      className="input-field newinput1"
                      onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                    />
                  
                  <Button 
                    onClick={(e) => removeInputField(index, e)} 
                    className="remove-button"
                    type="button"
                  >
                    Remove
                  </Button>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <Form.Group className="text-center mt-3">
          <Button type="submit" className="btn btn-primary">Submit</Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Step3;
