import React, { useState } from "react";
import { Dropdown, Col, Row, Form, Button, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Css/stepper.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Step4 = () => {
  const navigate = useNavigate();

  const [clientId, setClientId] = useState(
    sessionStorage.getItem("client id") || ""
  );
  const [createdAt, setCreatedAt] = useState(
    sessionStorage.getItem("Date") || ""
  );
  const [pdfPath, setPdfPath] = useState("");
  const [text, setText] = useState(false);
  const [type, setType] = useState("");
  const [includeGST, setIncludeGST] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setText(true);

    try {
      const url = `https://crm.dreambytesolution.com/dream/genratebill`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const requestBody = {
        clientId: clientId,
        date: createdAt,
        includeGST: includeGST === "true", // Convert to boolean
        type: type
      };

      const response = await axios.post(url, requestBody, { headers });
      const dataarray = response.data.data.newDocument.services;
      const newpdfPath = response.data.data.pdfPath;

      setPdfPath(newpdfPath);

      // Use navigate to redirect
      navigate("/Admin/Billing", { state: { data: dataarray } });
      sessionStorage.setItem("pdf", newpdfPath);

      // Show success alert
      Swal.fire({
        title: "Success!",
        text: "Bill generated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setText(false);
    } catch (error) {
      console.error(error);
      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "An error occurred while generating the bill.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setText(false); // Stop loading animation even if error occurs
    }
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleGSTChange = (event) => {
    setIncludeGST(event.target.value);
  };

  return (
    <Container>
      <h2 className="text-center">Billing Form</h2>
      <p>Data from URL1: {sessionStorage.getItem("client no")}</p>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formClientId">
              <Form.Label>Client Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="Client ID"
                name="clientId"
                value={clientId}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the date"
                name="date"
                value={createdAt}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={handleTypeChange}
              >
                <option value="">Choose...</option>

                <option value="Bill">Bill</option>
                <option value="Quotation">Quotation</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formIncludeGST">
              <Form.Label>Include GST</Form.Label>
              <Form.Control
                as="select"
                value={includeGST}
                onChange={handleGSTChange}
              >
                <option value="">Choose...</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="text-center mt-3">
          <Button type="submit" className="btn btn-primary">
            {text ? "Generating..." : "Generate Pdf"}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Step4;
