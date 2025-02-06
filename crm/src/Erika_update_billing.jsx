import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Pagination, Spinner, Modal, Form } from 'react-bootstrap';

const Erika_update_billing = () => {

  const [bills, setBills] = useState([]);
  const [totalBills, setTotalBills] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState('');
  const [updatedBills, setUpdatedBills] = useState([]);
  const [revenue, setRevenue]= useState(0);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Modal form fields state
  const [updatedClientName, setUpdatedClientName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedProducts, setUpdatedProducts] = useState([]);

  // Fetch all bills from the server
  const fetchBills = async (page = 1) => {
    try {
      setLoading(true);
      const limit = 10; // Set the number of records per page
      const response = await axios.get(`https://crm.dreambytesolution.com/erika/fetchAllBills/?page=${page}&limit=${limit}`);
      console.log("response", response);
      setBills(response.data.bills);
      setTotalBills(response.data.totalBills);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
      setRevenue(response.data.totalRevenue);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching billing records:', error);
      setLoading(false);
    }
  };

  // Handle page change
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Open Modal with the selected bill for update
  const handleUpdateClick = (bill) => {
    setSelectedBill(bill);
    setUpdatedClientName(bill.client.name);
    setUpdatedEmail(bill.client.email);
    setUpdatedProducts(bill.products);  // Populate product details
    setShowModal(true);
  };

  // Handle modal form submission to update the bill
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
  
    const updatedClient = {
      name: updatedClientName,
      email: updatedEmail,
    };
  
    // Construct the updated products array
    const updatedProductsData = updatedProducts.map((product) => ({
      ...product,
      price: product.price,
      quantity: product.quantity,
      gst: product.gst,
    }));
  
    const updatedBill = {
      id: selectedBill._id,
      updatedClient,
      updatedProducts: updatedProductsData,
    };
  
    try {
      const response = await axios.put(
        `https://crm.dreambytesolution.com/erika/updatebill`,
        updatedBill
      );
  
      // If successful, update the bills in the table and close the modal
      const updatedBillsList = bills.map((bill) =>
        bill._id === selectedBill._id ? response.data.data : bill
      );
      setPdfPath(response.data.pdfPath);
      setBills(updatedBillsList);
  
      // Add the updated bill's ID to the updatedBills state
      setUpdatedBills((prev) => [...prev, selectedBill._id]);
  
      setShowModal(false);
    } catch (error) {
      console.error('Error updating the bill:', error);
    }
  };
  

  // Close the modal
  const handleCloseModal = () => setShowModal(false);

  // Call the fetchBills function on initial render or when page changes
  useEffect(() => {
    fetchBills(currentPage);
  }, [currentPage]);


  const handleDownload = () => {
    if (pdfPath) {
      const link = document.createElement("a");
      link.href = `https://crm.dreambytesolution.com/${pdfPath}`;
      link.target = "_blank"; // Use the PDF path stored in state
      link.download = "updateInvoice.pdf"; // You can set a custom name for the file
      link.click(); // Trigger the download
      
    }
  };

  return (
    <div className="container mt-5">
    <h3 style={{display:"flex", justifyContent:"space-between"}}><span >Billing Records </span> <span> Total Revenue: {revenue.toFixed(2)}</span></h3>

    {/* Show loading spinner while fetching data */}
    {loading ? (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    ) : (
      <>
        {/* Billing Table */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Invoice No</th>
              <th>Client Name</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Bill Date</th>
              <th>Actions</th> {/* Add Actions column */}
            </tr>
          </thead>
          <tbody>
  {bills.map((bill, index) => (
    <tr key={bill._id}>
      <td>{(currentPage - 1) * 10 + index + 1}</td>
      <td>{bill._id}</td>
      <td>{bill.client.name}</td>
      <td>{bill.client.email}</td>
      <td>{bill.totalAmount.toFixed(2)}</td>
      <td>{new Date(bill.billDate).toLocaleDateString()}</td>
      <td>
        <Button
          variant="warning"
          onClick={() => handleUpdateClick(bill)}
          style={{ background: '#263043', marginTop: '0px', color: 'white' }}
        >
          Update
        </Button>
        
        {/* Show the Download button only for updated bills */}
        {updatedBills.includes(bill._id) && pdfPath && (
          <Button 
            variant="info" 
            onClick={handleDownload} 
            className="mt-3" 
            style={{ background: '#263043', color: 'white', border: 'white',marginLeft:'0px' }}
          >
            Download
          </Button>
        )}
      </td>
    </tr>
  ))}
</tbody>

        </Table>

        {/* Pagination Controls: Only Prev and Next buttons */}
        <Pagination>
          <Pagination.Prev
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          />
          <Pagination.Next
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </>
    )}

    {/* Modal for Updating the Bill */}
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Update Billing Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdateSubmit}>
          <Form.Group controlId="clientName">
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              type="text"
              value={updatedClientName}
              onChange={(e) => setUpdatedClientName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
          </Form.Group>

          <h5>Products</h5>
          {updatedProducts.map((product, index) => (
            <div key={index} className='row'>
              <div className='col-md-6'>
              <Form.Group controlId={`productName-${index}`}>
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={product.productName}
                  onChange={(e) => {
                    const newProducts = [...updatedProducts];
                    newProducts[index].price = e.target.value;
                    setUpdatedProducts(newProducts);
                  }}
                />
              </Form.Group>
              </div>
              <div className='col-md-3'>
              <Form.Group controlId={`productPrice-${index}`}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={product.price}
                  onChange={(e) => {
                    const newProducts = [...updatedProducts];
                    newProducts[index].price = e.target.value;
                    setUpdatedProducts(newProducts);
                  }}
                />
              </Form.Group>
              </div>
               <div className='col-md-3'>
                   
              <Form.Group controlId={`productQuantity-${index}`}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={product.quantity}
                  onChange={(e) => {
                    const newProducts = [...updatedProducts];
                    newProducts[index].quantity = e.target.value;
                    setUpdatedProducts(newProducts);
                  }}
                />
              </Form.Group>
              </div>

              
            </div>
          ))}

          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
    
  </div>
  );
}

export default Erika_update_billing
