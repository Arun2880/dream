import axios from "axios";

import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Swal from "sweetalert";

const Erika_Billing = () => {
  const [clientno, setClientno] = useState("");
  const [products, setProducts] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [ gstt, setgst] = useState(false);



  const handleWithGst=()=>{
    setgst(!gstt);
    recalculateTotals();  
  }
  console.log("gst", gstt); 
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    recalculateTotals();
  };
 console.log("ischecked", isChecked);

  const [initialFormData, setInitialFormData] = useState({
    _id: "",
    name: "",
    email: "",
    gstNumber: "",
    state: "",
    city: "",
    phone: "",
    address: "",
  });
  const [shipTo, setShipTo] = useState({
    shipToGstno: "",
  shipToPhone: "",
  shipToEmail: "",
  shipToCompanyName: "",
  shipTopincode: "",
  shipToState: "",
  shipToName: "",
  shipToCity: "",


  });
  
  // State for storing the PDF path
  const [pdfPath, setPdfPath] = useState("");

  // Fetch all products
  async function fetchAllProducts() {
    try {
      const response = await axios.get(
        "https://crm.dreambytesolution.com/erika/productlist"
      );
      setProducts(response.data.data[0]);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);
  
  




  const recalculateTotals = () => {
    const updatedProductDetails = productDetails.map((product) => {
      const price = parseFloat(product.price || 0);
      const quantity = parseInt(product.quantity || 0, 10);
      const gst = isChecked ? (gstt ? product.gst : 0) : product.gst; // Apply GST or not based on isChecked and gstt

      const baseTotal = price * quantity;
      const gstAmount = (baseTotal * gst) / 100;
      const total = baseTotal + gstAmount;

      return { ...product, total, gst }; // Update product with new total
    });

    setProductDetails(updatedProductDetails);  // Set updated product details
  };




  const [productDetails, setProductDetails] = useState([
    { productName: "", price: "", quantity: "", gst: 18, total: 0 },
  ]);

  // Fetch client data when client number changes
  async function fetchClient(newQuery) {
    try {
      const url = `https://crm.dreambytesolution.com/dream/getuniclient/${newQuery}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      setInitialFormData(response.data.data[0]);
      setShipTo(response.data.data[0]);
    } catch (error) {
      console.error("API request failed:", error);
    }
  }
  

  useEffect(() => {
    if (clientno) {
      fetchClient(clientno);
    }
  }, [clientno]);     

  // Handle client number input change
  const handleInputChange = (e) => {
   const newQuery = e.target.value;
    setClientno(newQuery);
  };

  // Handle form input changes for client details
  const handleClientChange = (e) => {
    const { name, value } = e.target
    setInitialFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle product input changes dynamically
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProductDetails = [...productDetails];
    
    // Update the product details
    newProductDetails[index][name] = value;
  
    // If the product name changes, we need to update the price and GST
    if (name === "productName") {
      // Find the selected product by its name
      const selectedProduct = products.find(
        (product) => product.productname === value
      );
  
      if (selectedProduct) {
        // Set price and gst based on the selected product
        newProductDetails[index].price = selectedProduct.price;
        newProductDetails[index].gst = isChecked ? (gstt ? selectedProduct.gst : 0) : selectedProduct.gst;
      }
    }
  
    // Recalculate the total if price, quantity, or gst is changed
    const price = parseFloat(newProductDetails[index].price || 0);
    const quantity = parseInt(newProductDetails[index].quantity || 0, 10);
    const gst = parseFloat(isChecked ? (gstt ? newProductDetails[index].gst : 0) : newProductDetails[index].gst);
    
    const baseTotal = price * quantity;
    const gstAmount = (baseTotal * gst) / 100;
    newProductDetails[index].total = baseTotal + gstAmount;
  
    setProductDetails(newProductDetails);
  };
  
  // Add a new product input field
  const handleAddProduct = () => {
    setProductDetails([
      ...productDetails,
      { productName: "", price: "", quantity: "", gst: 18, total: 0 },
    ]);
  };

  // Remove a product input field
  const handleRemoveProduct = (index) => {
    const newProductDetails = productDetails.filter((_, i) => i !== index);
    setProductDetails(newProductDetails);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      const billingData = {
        client: initialFormData,
       shipTo,
        products: productDetails.map((product) => ({
          productName: product.productName,
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity, 10),
          gst: parseFloat(product.gst),
        })),
      };
  
      // Send POST request to generate the PDF
      const response = await axios.post(
       "https://crm.dreambytesolution.com/erika/createbill", 
        billingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200 && response.data) {
        Swal({
          title: "Success!",
          text: "Your bill has been created successfully.",
          icon: "success",
        });
  
        console.log("PDF path received:", response.data.pdfPath);

      
        setPdfPath(response.data.pdfPath);
        
      }
  
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal({
        title: "Error",
        text: "There was an error generating the bill.",
        icon: "error"
      });
    }
  };
  const handleSubmitQuotation = async (e) => {
    e.preventDefault();
  
    try {
      
      const billingData = {
        client: initialFormData,
       shipTo,
        products: productDetails.map((product) => ({
          productName: product.productName,
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity, 10),
          gst: parseFloat(product.gst),
        })),
      };


      console.log("product details:", productDetails);
      
     
  
      // Send POST request to generate the PDF
      const response = await axios.post(
       "https://crm.dreambytesolution.com/erika/createquotation", 
        billingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200 && response.data) {
        Swal({
          title: "Success!",
          text: "Your bill has been created successfully.",
          icon: "success",
        });
  
        console.log("PDF path received:", response.data.pdfPath);

      
        setPdfPath(response.data.pdfPath);
        
      }
  
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal({
        title: "Error",
        text: "There was an error generating the bill.",
        icon: "error"
      });
    }
  };


 

  // Handle PDF Download
  const handleDownload = () => {
    if (pdfPath) {
      const link = document.createElement("a");
      link.href = `https://crm.dreambytesolution.com/${pdfPath}`;
      link.target = "_blank"; // Use the PDF path stored in state
      link.download = "invoice.pdf"; // You can set a custom name for the file
      link.click(); // Trigger the download
       window.location.reload();
    }
  };
  

  return (
    <Container fluid className="contain">
      <div className="header1">
        <div className="head">
          <div className="head1">
            <h1>Billing</h1>
          </div>
          <div className="head2">
            <p>
              Client<a href="/">/Billing</a>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Form.Group controlId="searchQuery">
              <Form.Label>Search Client</Form.Label>
              <Form.Control
                type="text"
                value={clientno}
                onChange={handleInputChange}
                placeholder="Enter Client No."
              />
            </Form.Group>
          </div>
        </div>

        {/* Client Details Form */}
        <Form className="row">
        <div className="col-md-6">
            <Form.Group>
              <Form.Label> Client Id</Form.Label>
              <Form.Control
                type="text"
                name="_id"
                value={initialFormData._id}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
          
          <div className="col-md-6">
            <Form.Group>
              <Form.Label> Client Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={initialFormData.name}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={initialFormData.email}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Gst Number</Form.Label>
              <Form.Control
                type="text"
                name="gstNumber"
                value={initialFormData.gstno}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={initialFormData.State}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={initialFormData.City}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={initialFormData.phone}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
          <div className="col-md-6">
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={initialFormData.addressLine1}
                onChange={handleClientChange}
              />
            </Form.Group>
          </div>
        </Form>

        {/* Product Details Section */}
        <div className="product-section">
          <p style={{display:'flex', justifyContent: 'space-between', marginRight:'20px', fontWeight:'600' }}><h2>Product Details</h2> <span > Do you want to generate quotation?
          <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          style={{marginLeft:'10px'}}
        /><br></br>{
          isChecked? <div  style={{display:'flex',  justifyContent: 'space-between'}}><div> With Gst <input
          type="checkbox"
          checked={gstt}
          onChange={handleWithGst}
          style={{marginLeft:'10px'}}
        /> </div></div>:""
        }
             </span>
            
           </p>
          {productDetails.map((product, index) => (
            <div key={index} className="product-input-group">
              <div className="row">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      as="select"
                      name="productName"
                      value={product.productName}
                      onChange={(e) => handleProductChange(index, e)}
                      placeholder="Enter product name"
                    >
                      <option value="">Select Product</option>
                      {products.map((productItem, idx) => (
                        <option key={idx} value={productItem.productname}>
                          {productItem.productname}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={product.price || ''}
                      onChange={(e) => handleProductChange(index, e)}
                      placeholder="Enter price"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={product.quantity }
                      onChange={(e) => handleProductChange(index, e)}
                      placeholder="Enter quantity"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>GST (%)</Form.Label>
                    <Form.Control
                      type="number"
                      name="gst"
                      value={isChecked? !gstt ? 0:  product.gst:  product.gst }
                      onChange={(e) => handleProductChange(index, e)}
                      placeholder="Enter GST %"
                    />
                  </Form.Group>
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => handleRemoveProduct(index)}
                className="remove-product-btn"
              >
                Remove
              </Button>
              
              <div className="product-total">
                <strong>Total: </strong> {product.total.toFixed(2)}
              </div>
            </div>
          ))}
          <Button
            variant="primary"
            onClick={handleAddProduct}
            className="add-product-btn"
          >
            Add Product
          </Button>
        </div>
        { !isChecked?
        <Button variant="success" onClick={handleSubmit}>
          Generate Bill
        </Button>:
        <Button variant="success" onClick={handleSubmitQuotation}>
        Generate Quotation
      </Button>
}

        {/* Display the download button if the PDF path is available */}
        {pdfPath && (
          <Button variant="info" onClick={handleDownload} className="mt-3">
            Download PDF
          </Button>
        )}
      </div>
    </Container>
  );
};

export default Erika_Billing;
