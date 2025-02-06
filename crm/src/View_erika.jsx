import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import Swal from "sweetalert";

const Viewerika = () => {
  const [products, setProducts] = useState([]); 
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [editProduct, setEditProduct] = useState(null); // Holds the product being edited

  async function fetchAllProducts() {
    try {
      const response = await axios.get("https://bill.dreambytesolution.com/erika/productlist");
      setProducts(response.data.data[0]); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // UseEffect to run the fetchAllProducts when the component mounts
  useEffect(() => {
    fetchAllProducts();
  }, []); // Empty dependency array ensures this runs only once

  // Handle opening the modal
  const handleEditClick = (product) => {
    setEditProduct(product); // Set the selected product
    setShowModal(true); // Show the modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null); // Clear the selected product when closing the modal
  };

  // Handle form submission (e.g., for saving edited product data)
  const handleSaveProduct = async(id) => {
   try{
    const responseData = {
      productname: editProduct.productname,
      price: editProduct.price,
      gst : editProduct.gst,
      brand: editProduct.brand,
    }
    const url = `https://bill.dreambytesolution.com/erika/updatepro/${id}`;
    const headers={
      'Content-Type': 'application/json',
      Accept : 'application/json'
    }
    const response = await axios.put(url, responseData, {headers: headers});
    if(response.data){
    Swal({
      title: "Good job!",
      text: "Your data saved successfully",
      icon: "success"
    });
  }
    
    
    fetchAllProducts();
    handleCloseModal();
   }
   catch(e){
    console.log(e);
   }
   
  };

  const handleDelete = async(id)=>{
    try{
      const response = await axios.delete(`https://bill.dreambytesolution.com/erika/delpro/${id}`)
      if(response.data){
        Swal({
          title: "Good job!",
          text: "Your data deleted successfully",
          icon: "success"
        })
        fetchAllProducts();
      }
    }
    catch(e){
      console.log(e);
    }

  }

  

  return (
    <Container fluid className="contain">
      <div className="header1">
        <div className="head">
          <div className="head1">
            <h1>View Product</h1>
          </div>
          <div className="head2">
            <p>
              Erika <a href="/">View Product</a>
            </p>
          </div>
        </div>
        <div className="mt-3 row">
          {/* Map through the products array */}
          {products.length > 0 ? (
            products.map((prod) => (
              <div className="col-md-3 mt-3 px-2 " key={prod.id}>
                <div className='d-flex justify-content-center'>
                  <img
                    src={`https://bill.dreambytesolution.com/${prod.image}`} 
                    alt={prod.productname} 
                    style={{ width: "auto", height: "150px" }} 
                  />
                </div>
                <div className='d-flex justify-content-between mx-5'>
                  <h5>{prod.productname}</h5>
                  <h5>Price: {prod.price}</h5>
                </div>
                <p className='mx-5'>Brand: {prod.brand}</p>

                <div className='d-flex justify-content-between mx-5 '>
                  <Button 
                    type='button' 
                    variant='primary' 
                    onClick={() => handleEditClick(prod)}
                  >
                    Edit
                  </Button>
                  <Button type='button' variant='danger' onClick={()=>handleDelete(prod._id)}>Delete</Button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available</p> // Display this message if there are no products
          )}
        </div>
      </div>

      {/* Modal for editing product */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editProduct && (
            <Form >
              <Form.Group controlId="productName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editProduct.productname}
                  onChange={(e) => setEditProduct({...editProduct, productname: e.target.value})}
                />
              </Form.Group>
              <Form.Group controlId="productBrand">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  value={editProduct.brand}
                  onChange={(e) => setEditProduct({...editProduct, brand: e.target.value})}
                />
              </Form.Group>
              <Form.Group controlId="productPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                />
              </Form.Group>
              <Form.Group controlId="productImage">
                <Form.Label>Gst</Form.Label>
                <Form.Control
                  type="Number"
                  value={editProduct.gst}
                  onChange={(e) => setEditProduct({...editProduct, gst: e.target.value})}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>handleSaveProduct(editProduct._id)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Viewerika;
