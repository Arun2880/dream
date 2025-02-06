import { Button, Container, Form } from "react-bootstrap";
import "./Css/stepper.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert";


const Erika = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    image: null,  // Make sure the initial value is null instead of "null"
    gst: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    setFormData((prevState) => {
      if (type === "file") {
        return { ...prevState, [name]: files[0] };  // Store the file directly
      } else {
        return { ...prevState, [name]: value };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = "https://bill.dreambytesolution.com/erika/addproduct";

      const formDataToSend = new FormData();

      // Append text fields to FormData
      formDataToSend.append("productname", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("gst", formData.gst);

      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(url, formDataToSend);

      console.log(response.data);
      if(response.data.message === "Product Addedd successfully"){
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
      setFormData({
        name: "",
        price: "",
        brand: "",
        gst: "",
        image: null,
      })
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  console.log("formData", formData);

  return (
    <Container fluid className="contain">
      <div className="header1">
        <div className="head">
          <div className="head1">
            <h1>Add Product</h1>
          </div>
          <div className="head2">
            <p>
              Client<a href="/">/Add Product</a>
            </p>
          </div>
        </div>
        <Form className="row px-5" onSubmit={handleSubmit}>
          <div className="mt-3 col-md-6">
            <Form.Group controlId="formName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                required
              />
            </Form.Group>
          </div>
          <div className="mt-3 col-md-6">
            <Form.Group controlid="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                as="select"
                placeholder="Enter Brand"
                name="brand"
                onChange={handleChange}
                value={formData.brand}
                required
              >
                <option value="">Select Brand</option>
                <option value="erika">Erika</option>
              </Form.Control>
            </Form.Group>
          </div>
          <div className="mt-3 col-md-6">
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                name="price"
                onChange={handleChange}
                value={formData.price}
                required
              />
            </Form.Group>
          </div>

          <div className="mt-3 col-md-6">
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </div>

          <div className="mt-3 col-md-6">
            <Form.Group controlId="formgst">
              <Form.Label>GST</Form.Label>
              <Form.Control
                type="number"
                placeholder="GST"
                name="gst"
                onChange={handleChange}
                value={formData.gst}
              />
            </Form.Group>
          </div>
          <div className="d-flex justify-content-center ">
            <Button variant="primary" type="submit" style={{ width: "150px" }}>
              Add Product
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Erika;
