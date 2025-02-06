import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Pagination,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";

const UpdateBill = () => {
  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    clientId: "",
    date: "",
    includeGST: false,
    type: "Bill",
    services: [],
  });
  const [pdfPaths, setPdfPaths] = useState({}); // To store the PDF path for each document

  const pageSize = 10;

  useEffect(() => {
    fetchDocuments(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchDocuments = async (page) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://bill.dreambytesolution.com/dream/fetchBilling?page=${page}&limit=${pageSize}`
      );
      setDocuments(response.data.data);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalCount: response.data.pagination.totalCount,
      });
    } catch (err) {
      setError("Error fetching documents.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
  if (newPage < 1 || newPage > pagination.totalPages) return;
  setPagination((prev) => ({
    ...prev,
    currentPage: newPage,
  }));
};
const getPageNumbers = () => {
  const { currentPage, totalPages } = pagination;
  const pageNumbers = [];
  const maxPagesToShow = 5; // Maximum number of page numbers to show
  const halfRange = Math.floor(maxPagesToShow / 2); // Half of the range (before and after current page)

  // Start page: should be at least 1
  const startPage = Math.max(currentPage - halfRange, 1);
  // End page: should be at most totalPages
  const endPage = Math.min(currentPage + halfRange, totalPages);

  // Adjust if the range doesn't have enough pages before or after the current page
  if (startPage === 1) {
    // If starting at 1, just fill from start
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  } else if (endPage === totalPages) {
    // If ending at totalPages, just fill to total
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Otherwise, create a range with some pages before and after the current page
    pageNumbers.push(1); // Always show the first page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    pageNumbers.push(totalPages); // Always show the last page
  }

  return pageNumbers;
};

  const handleShowModal = (document) => {
    setSelectedDocument(document);
    setFormData({
      clientId: document.clientId || "",
      date: new Date(document.date).toLocaleDateString(),
      includeGST: document.includeGST,
      type: document.type,
      services: document.services.map((service) => ({
        ...service,
        price: service.price,
        sgst: service.sgst,
        cgst: service.cgst,
      })),
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...formData.services];

    const numericValue = ["price", "sgst", "cgst"].includes(name)
      ? parseFloat(value)
      : value;

    updatedServices[index] = {
      ...updatedServices[index],
      [name]: numericValue,
    };
    setFormData({
      ...formData,
      services: updatedServices,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://bill.dreambytesolution.com/dream/updateBilling/${selectedDocument._id}`,
        formData
      );

      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc._id === selectedDocument._id ? { ...doc, ...formData } : doc
        )
      );

      // Store the PDF path for the updated document
      setPdfPaths((prevPdfPaths) => ({
        ...prevPdfPaths,
        [selectedDocument._id]: response.data.data.pdfPath,
      }));

      fetchDocuments();
      setShowModal(false);
    } catch (err) {
      setError("Error updating document.");
      console.error(err);
    }
  };

  const handleDownload = (documentId) => {
    const path = pdfPaths[documentId];
    if (path) {
      const link = document.createElement("a");
      link.href = `https://bill.dreambytesolution.com/${path}`;
      link.target = "_blank"; // Open in a new tab
      link.download = "updateInvoice.pdf"; // Set a custom name for the file
      link.click(); // Trigger the download
    }
  };

  return (
    <Container fluid>
    <Row>
      <Col>
        <h2 className="my-4 text-center"> Billing Data</h2>

        {loading && (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (
          <div>
            <Table striped bordered hover responsive="sm">
              <thead>
                <tr>
                  <th>Billing Id</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  documents.map((document) => (
                    <tr key={document._id}>
                      <td>{document.clientId}</td>
                      <td>{document.totalAmount.toFixed(2)}</td>
                      <td>{new Date(document.date).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleShowModal(document)}
                          style={{
                            background: "#263043",
                            marginTop: "0px",
                            color: "white",
                          }}
                        >
                          Update
                        </Button>

                        {/* Conditionally render the "Download" button */}
                        {pdfPaths[document._id] && (
                          <Button
                            variant="info"
                            onClick={() => handleDownload(document._id)} // Pass the document ID
                            style={{
                              background: "#263043",
                              color: "white",
                              border: "white",
                              marginLeft: "0px",
                              marginTop: "0px",
                            }}
                          >
                            Download
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                />

                {/* Display the limited number of pages */}
                {getPageNumbers().map((pageNum, index) => (
                  <Pagination.Item
                    key={index}
                    active={pageNum === pagination.currentPage}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                />
              </Pagination>
            </div>
          </div>
        )}
      </Col>
    </Row>
    {/* Modal for updating document and services */}
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Document and Services</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formClientId">
            <Form.Label>Client</Form.Label>
            <Form.Control
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formIncludeGST">
            <Form.Check
              type="checkbox"
              label="Include GST"
              name="includeGST"
              checked={formData.includeGST}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formType">
            <Form.Label>Type</Form.Label>
            <Form.Control
              type="text"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <hr />
          <h4>Services</h4>
          {formData.services.map((service, index) => (
            <div key={index} className="mb-3">
              <h5>Service {index + 1}</h5>
              <Form.Group controlId={`formServiceName-${index}`}>
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={service.name}
                 
                />
              </Form.Group>

              <Form.Group controlId={`formServicePrice-${index}`}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={service.price}
                  onChange={(e) => handleServiceChange(index, e)}
                  required
                />
              </Form.Group>

              {/* <Form.Group controlId={`formServiceSGST-${index}`}>
                <Form.Label>SGST</Form.Label>
                <Form.Control
                  type="number"
                  name="sgst"
                  value={service.sgst}
                  onChange={(e) => handleServiceChange(index, e)}
                  required
                />
              </Form.Group>

              <Form.Group controlId={`formServiceCGST-${index}`}>
                <Form.Label>CGST</Form.Label>
                <Form.Control
                  type="number"
                  name="cgst"
                  value={service.cgst}
                  onChange={(e) => handleServiceChange(index, e)}
                  required
                />
              </Form.Group> */}
              <hr />
            </div>
          ))}

          <Button variant="primary" type="submit">
            Update Document and Services
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  </Container>
  );
};

export default UpdateBill;
