import React, { useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/Addclient.css";
import { Container, Form, Col, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const Quotation = () => {
  const [employee, setEmployee]= useState([]);
  const [project_title, setproject_title] = useState('');
  const [project_description, setproject_description] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [Status, setStatus] = useState('');



  const handleChangetask = (e) => setproject_title(e.target.value);
  const handleChangeDescription = (e) => setproject_description(e.target.value);
  const handleChangeAssign = (e) => setAssignee(e.target.value);
  const handleChangeDuedate = (e) => setDueDate(e.target.value);
  const handleChangeStatus = (e) => setStatus(e.target.value);


  const assignTask = async (e) => {
    e.preventDefault();
    try{

      const url = `https://crm.dreambytesolution.com/dream/addtask`
      const header={
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const data = {
        project_title: project_title,
        project_description: project_description,
        assignee: assignee,
        dueDate: dueDate,
        Status: Status
      };
      
      const response = await axios.post(url, data, header);

      console.log(response.data);
      if(response.status=== 200){
        Swal.fire({
          title: "Good job!",
          text: "Your task has been successfully assigned to the employee!",
          icon: "success"
        });

      }
      else
      {
        console.log("something went wrong");
      }

    }
    catch(error){
      console.error(error);
    }
  }



  
  
  
  
  
  
  
  
  
  
  
  useEffect(() => {
    viewEmployee();
  }, []);


  const viewEmployee = async () => {
    try {
      const url = "https://crm.dreambytesolution.com/dream/getemp";
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


  










  return (
    
      <Container fuid className="contain">
        <div className="header1">
          {""}
          <div className="head">
            <div className="head1">
              <h3>Assign Task</h3>
            </div>
            <div className="head2">
              <p> Assign Task <a href="/">/Task</a> </p>
            </div>

          </div>
          <Form className='row g-3' onSubmit={assignTask}>
          <Col md={6}>
           <Form.Group controlId="formtitle">
            <Form.Label>Project Title</Form.Label>
            <Form.Control type="text" 
            placeholder="Enter Project Title"
            name='project_title'
            value={project_title}
            onChange={handleChangetask} />

           </Form.Group>
          </Col>
          <Col md={6}>
           <Form.Group controlId="formDescription">
            <Form.Label>Project Description</Form.Label>
            <Form.Control type="text" 
            placeholder="Enter Project Description"
            name="project_description"
            value={project_description}
            onChange={handleChangeDescription} 
             />

           </Form.Group>
          </Col>

          <Col md={6}>
           <Form.Group controlId="formTo">
            <Form.Label>Assign To</Form.Label>
            <Form.Control 
            as="select" 
            placeholder="Enter Employee Name"
            name="assignee"
            
            onChange={handleChangeAssign} 
             >
              
             <option value="">Select Employee...</option>
             {employee.map((index)=>(
              <option key={index._id} value={index._id}>{index.emp_name}</option>
              
             
              


             )
             

             )}
             
             
             </Form.Control>

           </Form.Group>
          </Col>

          <Col md={6}>
           <Form.Group controlId="formtitle">
            <Form.Label>Due Date</Form.Label>
            <Form.Control type="date" 
            placeholder="Enter Project Due Date" 
            name="dueDate"
            value={dueDate}
            onChange={handleChangeDuedate}/>

           </Form.Group>
          </Col>

          <Col md={6}>
           <Form.Group controlId="formtitle">
            <Form.Label>Status</Form.Label>
            <Form.Control type="text" 
            placeholder="Enter Project status" 
            name="Status"
            value={Status}
            onChange={handleChangeStatus} />

           </Form.Group>
          </Col>

          <Col md={12}>
            <Button variant="primary" type="submit" >
              Submit
            </Button>
          </Col>


        </Form>

        </div>
       

      </Container>
    )
    
}

export default Quotation
