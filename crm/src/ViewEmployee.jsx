import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import "./Css/Addclient.css"; 

const ViewEmployee = () => {
  const design = {
    margin: "5px",
  };
  const [employee, setEmployee] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [display, setDisplay] = useState(false);
  const [unique, setUnique] = useState({
    emp_id: "",
    emp_name: "",
    emp_address: "",
    emp_phone: "",
    email: "",
    department: "",
    designation: "",
    joining_date: "",
    salary: "",
    bank_name: "",
    bank_account: "",
  });
  const handleCloseModal1 = () => setDisplay(false);
  {/* update the employee data*/}
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnique((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleUpdate = async (employeeId) => {
    try {
      setDisplay(true);

      const url = `https://bill.dreambytesolution.com/dream/getuniqueemp/${employeeId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const response = await axios.get(url, { headers });
      const viewres = response.data.data;

      
      if (viewres) {
        setUnique(viewres);
      } else {
        console.error("No data found for the employee");
      }
      
    } catch (error) {
      console.error(error);
    }
  };
  

  const updateEmployee= async()=>{
    try {
      const url = `https://bill.dreambytesolution.com/dream/updateemp/${unique._id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      console.log("ididididid", unique._id);
      const requestBody={
        emp_id: unique.emp_id,
        emp_name:unique.emp_name,
        emp_address:unique.emp_address ,
        emp_phone:unique.emp_phone ,
        email:unique.email ,
        department:unique.department,
        designation:unique.designation ,
        joining_date: unique.joining_date,
        salary: unique.salary,
        bank_name: unique.bank_name,
        bank_account: unique.bank_account,
      };
      const response= await axios.put(url, requestBody,headers);
      if(response.data){
        Swal.fire({
          title: "Success!",
          text: "Your client has been updated successfully.",
          icon: "success",
        });
      setDisplay(false);
      viewEmployee();
      }

  } 
  catch(error){
    console.error(error);

  }
}
{/* end of update employee data*/}




  const handleCloseModal = () => setShowModal(false);
  {
    /*show the specific client data */
  }
  const viewAllData = async (employeeId) => {
    try {
      setShowModal(true);
      const url = `https://bill.dreambytesolution.com/dream/getuniqueemp/${employeeId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      const viewres = response.data.data;
      console.log("view rtesponse", viewres);
      console.log("id id id", employeeId);
      console.log("response", response);

      // Check if viewres is not undefined
      if (viewres) {
        setUnique(viewres);
      } else {
        console.error("No data found for the employee");
      }
    } catch (error) {
      console.error("Error fetching employee data", error);
    }
  };

  useEffect(() => {
    viewEmployee();
  }, []);
  {
    /* end of showing specific client data*/
  }

  {
    /* show the all client data */
  }
  const viewEmployee = async () => {
    try {
      const url = "https://bill.dreambytesolution.com/dream/getemp";
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      const viewData = response.data.data;

      setEmployee(viewData);
    } catch (error) {
      console.error("Error connecting to API", error);
    }
  };
  {
    /* end of showing all client data*/
  }


{/*delete the employee data */}
const handleDelete = async (employeeId) => {
   
   
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      
      try {
   
        Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
     removeClient(employeeId);
    
    
   
    }
    catch(error){
      console.error("error",error);
    }
    }
  });
}
const removeClient= async(employeeId)=>{
  
  try{
  
    const url = `https://bill.dreambytesolution.com/dream/delemp/${employeeId}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    console.log("delete id ", employeeId);
    const response = await axios.delete(url,  headers, );
    console.log("Delete client response:", response);
    viewEmployee();
      
    

  }
  catch(error){
    console.error("error",error);
  }
}









  return (
    <Container fluid className="contain">
      <div className="header1">
        <div className="head">
          <div className="head1">
            <h3>View Employee</h3>
          </div>
          <div className="head2">
            <p>
              Employee<a href="/">/ View Employee</a>
            </p>
          </div>
        </div>

        {/* Table to display client data */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((emp, index) => (
              <tr key={emp._id}>
                <td>{index + 1}</td>
                <td>{emp.emp_name}</td>
                <td>{emp.email}</td>
                <td>{emp.emp_phone}</td>

                <td>{emp.emp_address}</td>

                <td>{emp.designation}</td>

                <td>{emp.salary}</td>
                <td>
                  <a style={design} onClick={() => handleUpdate(emp._id)}>
                    <i className="fa-solid fa-pen-to-square upd"></i>
                  </a>
                  <a style={design} onClick={() => handleDelete(emp._id)}>
                    <i className="fa fa-trash del"></i>
                  </a>
                  <a style={design} onClick={() => viewAllData(emp._id)}>
                    <i className="fa fa-eye view"></i>{" "}
                    {/* Changed icon for clarity */}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/*/* Modal for show specific client data client data*/}
        <Modal show={display} onHide={handleCloseModal1}>
          <Modal.Header closeButton>
            <Modal.Title>update Employees all data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {unique ? (
                <>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="emp_name"
                      value={unique.emp_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={unique.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="emp_phone"
                      value={unique.emp_phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="company_name">
                    <Form.Label>Employee Id</Form.Label>
                    <Form.Control
                      type="text"
                      name="emp_id"
                      value={unique.emp_id}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="emp_address"
                      value={unique.emp_address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formCity">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      name="department"
                      value={unique.department}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formState">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={unique.designation}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPincode">
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="joining_date"
                      value={unique.joining_date}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formGst">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="number"
                      name="salary"
                      value={unique.salary}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBankName">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="bank_name"
                      value={unique.bank_name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBankAccount">
                    <Form.Label>Bank Account</Form.Label>
                    <Form.Control
                      type="text"
                      name="bank_account"
                      value={unique.bank_account}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </>
              ) : (
                <p>No employee data available</p>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal1}>
              Close
            </Button>
            <Button variant="primary" onClick={updateEmployee}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for show specific client data client data */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>View Employees all data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {unique ? (
                <>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={unique.emp_name}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={unique.email} readOnly />
                  </Form.Group>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={unique.emp_phone}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="company_name">
                    <Form.Label>Employee Id</Form.Label>
                    <Form.Control type="text" value={unique.emp_id} readOnly />
                  </Form.Group>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={unique.emp_address}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formCity">
                    <Form.Label>Department</Form.Label>
                    <Form.Control
                      type="text"
                      value={unique.department}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formState">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      type="text"
                      value={unique.designation}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formPincode">
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={unique.joining_date}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formGst">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="number"
                      value={unique.salary}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formBankName">
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={unique.bank_name}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formBankAccount">
                    <Form.Label>Bank Account</Form.Label>
                    <Form.Control
                      type="text"
                      value={unique.bank_account}
                      readOnly
                    />
                  </Form.Group>
                </>
              ) : (
                <p>No employee data available</p>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default ViewEmployee;
