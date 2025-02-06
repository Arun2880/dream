import React, { useState } from "react";
import { Container, Form, Col, Button } from "react-bootstrap";
import "./Css/Addclient.css"; // Your custom CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert";

const AddClient = () => {
  const [name, setname] =useState("");
  const [isChecked, setIsChecked] = useState(false);

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
  const [companyName, setcompanyName] = useState("");
  const handlechangeCompany = (event) => {
    setcompanyName(event.target.value);
  };
  const [address, setAddress] = useState("");
  const handlechangeAddress = (event) => {
    setAddress(event.target.value);
  };
  const [city, setcity] = useState("");
  const handlechangeCity = (event) => {
    setcity(event.target.value);
  };
  const [state, setState] = useState("");
  const handlechangeState = (event) => {
    setState(event.target.value);
  };
  const [pincode, setPincode] = useState("");
  const handlechangePincode = (event) => {
    setPincode(event.target.value);
  };
  const [gst, setGst] = useState("");
  const handlechangeGst = (event) => {
    setGst(event.target.value);
  };

  

  const handlechangechecked=(event)=>{
    setIsChecked(event.target.checked);
  }
  const [shipToName, setshipToName]= useState("");
  const handlechangeshipName=(event)=>{
    setshipToName(event.target.value);
  }
  const [shipToaddressLine1, setshipToaddressLine1]= useState("");
  const handlechangeshipAddress=(event)=>{
    setshipToaddressLine1(event.target.value);
  }
  const [shipToCity, setshipToCity]= useState("");
  const handlechangeshipCity=(event)=>{
    setshipToCity(event.target.value);
  }
  const [shipToState, setshipToState]= useState("");
  const handlechangeshipState=(event)=>{
    setshipToState(event.target.value);
  }
  const [shipTopincode, setshipTopincode]= useState("");
  const handlechangeshipPincode=(event)=>{
    setshipTopincode(event.target.value);
  }
  const [shipToEmail, setshipToEmail]= useState("");
  const handlechangeshipEmail=(event)=>{
    setshipToEmail(event.target.value);
  }
  const [shipToPhone, setshipToPhone]= useState("");
  const handlechangeshipMobile=(event)=>{
    setshipToPhone(event.target.value);
  }
 
  const [shipToGstno, setshipToGstno]= useState("");
  const handlechangeshipgstno=(event)=>{
    setshipToGstno(event.target.value);
  }

  



  const [shipToCompanyName, setshipToCompanyName]= useState("");
  const handlechangeshipCompany=(event)=>{
    setshipToCompanyName(event.target.value);
  }
 
 
  const addclient = async (event) => {
    event.preventDefault();
    try {
      const url = "https://crm.dreambytesolution.com/dream/clients";

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const requestBody = {
        name: name,
        clientno: "",

        email: email,
        phone: parseInt(mobile),
        company_name: companyName,
        addressLine1: address,
        City: city,
        State: state,
        pincode: parseInt(pincode),
        gstno: gst,
       
        isSameClient: isChecked,
        shipToName:shipToName,
        shipToaddressLine1:shipToaddressLine1,
        shipToCity: shipToCity,
        shipToState:shipToState,
        shipTopincode:shipTopincode,
        shipToEmail:shipToEmail,
        shipToPhone:shipToPhone,
        shipToGstno:shipToGstno,
        
        shipToCompanyName:shipToCompanyName
      };

      const response = await axios.post(url, requestBody, {
        headers: headers,
      });
      console.log("request body of get qoute buy", requestBody);
      const data = response.data; 
      
      if (data.message==="Data saved successfully"){
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
      setshipToCompanyName("");
      setshipToGstno("");
      setshipToPhone("");
      setshipToEmail("");
      setshipTopincode("");
      setshipToState("");
      setshipToCity("");
      setshipToaddressLine1("");
      setshipToName("");
      
      
      setGst("");
     
      setPincode("");
      setState("");
      setAddress("");
      setmobile("");
      setemail("");
      setname("");
      setcity("");
      setcompanyName("");


     



      
      
  
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
            <h1>Add Client</h1>
          </div>
          <div className="head2">
            <p>
              Client<a href="/">/Add Client</a>
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
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handlechangeEmail}
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
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={handlechangeCompany}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={handlechangeAddress}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={handlechangeCity}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formstate">
              <Form.Label>State</Form.Label>
              <Form.Control
                as="select"
                placeholder="Select State"
                value={state}
                onChange={handlechangeState}
              >
                <option value="">Select State...</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
<option value="Arunachal Pradesh">Arunachal Pradesh</option>
<option value="Assam">Assam</option>
<option value="Bihar">Bihar</option>
<option value="Chhattisgarh">Chhattisgarh</option>
<option value="Goa">Goa</option>
<option value="Gujarat">Gujarat</option>
<option value="Haryana">Haryana</option>
<option value="Himachal Pradesh">Himachal Pradesh</option>
<option value="Jharkhand">Jharkhand</option>
<option value="Karnataka">Karnataka</option>
<option value="Kerala">Kerala</option>
<option value="Madhya Pradesh">Madhya Pradesh</option>
<option value="Maharashtra">Maharashtra</option>
<option value="Manipur">Manipur</option>
<option value="Meghalaya">Meghalaya</option>
<option value="Mizoram">Mizoram</option>
<option value="Nagaland">Nagaland</option>
<option value="Odisha">Odisha</option>
<option value="Punjab">Punjab</option>
<option value="Rajasthan">Rajasthan</option>
<option value="Sikkim">Sikkim</option>
<option value="Tamil Nadu">Tamil Nadu</option>
<option value="Telangana">Telangana</option>
<option value="Tripura">Tripura</option>
<option value="Uttar Pradesh">Uttar Pradesh</option>
<option value="Uttarakhand">Uttarakhand</option>
<option value="West Bengal">West Bengal</option>


               
                </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPincode">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Pincode"
                value={pincode}
                onChange={handlechangePincode}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formpGstno">
              <Form.Label>Gst Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Gst Number"
                value={gst}
                onChange={handlechangeGst}
              />
            </Form.Group>
          </Col>
          
          <Col md={12}>
             
            <Form.Group controlId="formp">
            <p> Is Bill Shipping Addresss Same:</p>
              
              <Form.Check
                type="checkbox"
                
                checked={isChecked}
                onChange={handlechangechecked}
              />
            </Form.Group>
          </Col><br></br>
          <Col md={6} className={isChecked?" checkbox":""}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={shipToName}
                onChange={handlechangeshipName}
              />
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?" checkbox":""}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={shipToEmail}
                onChange={handlechangeshipEmail}
              />
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?" checkbox":""}>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter phone number"
                value={shipToPhone}
                onChange={handlechangeshipMobile}
              />
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?"checkbox":""}>
            <Form.Group controlId="formCompanyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Company Name"
                value={shipToCompanyName}
                onChange={handlechangeshipCompany}
              />
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?"checkbox":""}>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={shipToaddressLine1}
                onChange={handlechangeshipAddress}
              />
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?"checkbox":""}>
            <Form.Group controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter City"
                value={ shipToCity}
                onChange={handlechangeshipCity}
              />
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?"checkbox":""}>
            <Form.Group controlId="formstate">
              <Form.Label>State</Form.Label>
              <Form.Control
               as="select"
                placeholder="Enter State"
                value={shipToState}
                onChange={handlechangeshipState}
              >
                <option value="">Select State...</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
<option value="Arunachal Pradesh">Arunachal Pradesh</option>
<option value="Assam">Assam</option>
<option value="Bihar">Bihar</option>
<option value="Chhattisgarh">Chhattisgarh</option>
<option value="Goa">Goa</option>
<option value="Gujarat">Gujarat</option>
<option value="Haryana">Haryana</option>
<option value="Himachal Pradesh">Himachal Pradesh</option>
<option value="Jharkhand">Jharkhand</option>
<option value="Karnataka">Karnataka</option>
<option value="Kerala">Kerala</option>
<option value="Madhya Pradesh">Madhya Pradesh</option>
<option value="Maharashtra">Maharashtra</option>
<option value="Manipur">Manipur</option>
<option value="Meghalaya">Meghalaya</option>
<option value="Mizoram">Mizoram</option>
<option value="Nagaland">Nagaland</option>
<option value="Odisha">Odisha</option>
<option value="Punjab">Punjab</option>
<option value="Rajasthan">Rajasthan</option>
<option value="Sikkim">Sikkim</option>
<option value="Tamil Nadu">Tamil Nadu</option>
<option value="Telangana">Telangana</option>
<option value="Tripura">Tripura</option>
<option value="Uttar Pradesh">Uttar Pradesh</option>
<option value="Uttarakhand">Uttarakhand</option>
<option value="West Bengal">West Bengal</option>
                </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?" checkbox":""}>
            <Form.Group controlId="formPincode">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Pincode"
                value={shipTopincode}
                onChange={handlechangeshipPincode}
              />
            </Form.Group>
          </Col>
          <Col md={6} className={isChecked?" checkbox":""}>
            <Form.Group controlId="formgst no">
              <Form.Label>Gst No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter GST No."
                value={shipToGstno}
                onChange={handlechangeshipgstno}
              />
            </Form.Group>
          </Col>


          






        
         
          
          <Col md={12}>
            <Button variant="primary" type="submit" onClick={addclient}>
              Submit
            </Button>
          </Col>
        </Form>
      </div>
    </Container>
  );
};

export default AddClient;
