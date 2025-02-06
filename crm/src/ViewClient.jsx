import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";

const ViewClient = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    company_name: "",
    addressLine1: "",
    City: "",
    State: "",
    pincode: "",
    gstno: "",
  });

  const handleUpdate = (clientId, clientNo) => {
    fetchClient(clientId, clientNo);
    setShowModal(true);
  };

  const fetchClient = async (clientId, clientNo) => {
    console.log("adsfghjhgfds: ", clientNo);
    try {
      const url = `https://bill.dreambytesolution.com/dream/singleclients/${clientNo}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      const clientData = response.data.data[0];

      // Update editClient state with fetched client data
      setEditClient({
        _id: clientData._id,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        company_name: clientData.company_name,
        addressLine1: clientData.addressLine1,
        City: clientData.City,
        State: clientData.State,
        pincode: clientData.pincode,
        gstno: clientData.gstno,
      });
    } catch (error) {
      console.error("Error fetching client:", error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditClient((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    viewClient();
  }, []);

  const viewClient = async () => {
    try {
      const url = "https://bill.dreambytesolution.com/dream/getclients";
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      const viewData = response.data.data;

      setClients(viewData); // Set clients state with fetched data
    } catch (error) {
      console.error("Error connecting to API", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = `https://bill.dreambytesolution.com/dream/updateclients/${editClient._id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      console.log("edit client id", editClient._id);
      const requestBody = {
        name: editClient.name,

        email: editClient.email,
        phone: editClient.phone,
        company_name: editClient.company_name,
        addressLine1: editClient.addressLine1,
        City: editClient.City,
        State: editClient.State,
        pincode: editClient.pincode,
        gstno: editClient.gstno,
      };

      const response = await axios.put(url, requestBody, { headers });
      if(response.data){
        Swal.fire({
          title: "Success!",
          text: "Your client has been updated successfully.",
          icon: "success",
        });
        setShowModal(false);

     
        viewClient();
      }

      
     
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };
  // --------------------------------delete function---------------------------------//
  const navigate = useNavigate();
  const handleDelete = async (clientId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          removeClient(clientId);
          viewClient();

          naviga();
        } catch (error) {
          console.error("error", error);
        }
      }
    });
  };
  const removeClient = async (clientId) => {
    try {
      const url = `https://bill.dreambytesolution.com/dream/clients/${clientId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      console.log("delete id ", clientId);
      const response = await axios.delete(url, headers);
      console.log("Delete client response:", response);
    } catch (error) {
      console.error("error", error);
    }
  };
  const naviga = () => {
    navigate("/Admin/ViewClient");
  };

  return (
    <Container fluid className="contain">
      <div className="header1">
        <div className="head">
          <div className="head1">
            <h3>View Client</h3>
          </div>
          <div className="head2">
            <p>
              Client<a href="/">/ View Client</a>
            </p>
          </div>
        </div>

        {/* Table to display client data */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Client No.</th>

              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company Name</th>

              <th>City</th>

              <th>GST Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={client._id}>
                <td>{index + 1}</td>
                <td>{client.clientno}</td>

                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.company_name}</td>

                <td>{client.City}</td>

                <td>{client.gstno}</td>
                <td>
                  <a onClick={() => handleUpdate(client._id, client.clientno)}>
                    <i className="fa-solid fa-pen-to-square upd"></i>
                  </a>{" "}
                  {/* You might need to adjust this icon according to your font-awesome library */}
                  <a onClick={() => handleDelete(client._id)}>
                    <i className="fa fa-trash del"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal for updating client data */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Update Client</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editClient.name}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editClient.email}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={editClient.phone}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
              <Form.Group controlId="company_name">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="company_name"
                  value={editClient.company_name}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="addressLine1"
                  value={editClient.addressLine1}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
              <Form.Group controlId="formCity">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="City"
                  value={editClient.City}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
              <Form.Group controlId="formState">
                <Form.Label>State</Form.Label>
                <Form.Control
                  as="select"
                  name="State"
                  value={editClient.State}
                  onChange={handleChange} // Update state on change
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
              <Form.Group controlId="formPincode">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={editClient.pincode}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
              <Form.Group controlId="formGst">
                <Form.Label>GST Number</Form.Label>
                <Form.Control
                  type="text"
                  name="gstno"
                  value={editClient.gstno}
                  onChange={handleChange} // Update state on change
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default ViewClient;
