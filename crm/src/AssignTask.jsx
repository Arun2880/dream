import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Css/Addclient.css";
import { Table, Container, Form, Col, Button, Modal } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const AssignTask = () => {
  const [assign, setAssign] = useState([]);
  const [display, setDisplay] = useState(false);
  const [unique, setUnique] = useState({
    Progress: "",
  });

  const handleUpdate = async (employeeId) => {
    try {
      setDisplay(true);

      const url = `https://bill.dreambytesolution.com/dream/singletask/${employeeId}`;
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
      console.error("Error fetching task data", error);
    }
  };

  useEffect(() => {
    viewEmployee();
  }, []);

  const viewEmployee = async () => {
    try {
      const url = "https://bill.dreambytesolution.com/dream/gettasks";
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(url, { headers });
      const viewData = response.data.data;

      setAssign(viewData);
    } catch (error) {
      console.error("Error connecting to API", error);
    }
  };

  const handleCloseModal1 = () => setDisplay(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnique((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProgress = async (assignee) => {
    try {
      const url = `https://bill.dreambytesolution.com/dream/updatetask/${assignee}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const requestBody = {
        Progress: unique.Progress,
      };
      const response = await axios.put(url, requestBody, { headers });
      console.log("response", response);
      Swal.fire("Success!", "Task updated successfully.", "success");
      handleCloseModal1();
      viewEmployee(); // Refresh task list
    } catch (error) {
      console.error("Error updating task progress", error);
      Swal.fire("Error!", "Failed to update task.", "error");
    }
  };

  return (
    <div className="contain">
      <div className="header1">
        <div className="head">
          <div className="head1">
            <h3>Assigned Task</h3>
          </div>
          <div className="head2">
            <p> Assign Task <a href="/">/Assigned Task</a> </p>
          </div>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Project Title</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assign.map((index, sr) => (
              <tr key={index._id}>
                <td>{sr + 1}</td>
                <td>{index.project_title}</td>
                <td>{index.dueDate}</td>
                <td>{index.Status}</td>
                <td>{index.Progress}</td>
                <td>
                  <a href="#" onClick={() => handleUpdate(index._id)}>
                    <i className="fa-solid fa-pen-to-square upd"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={display} onHide={handleCloseModal1}>
          <Modal.Header closeButton>
            <Modal.Title>Update Task Progress</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {unique ? (
                <>
                  <Form.Group controlId="formEmployeeId">
                    <Form.Label>Employee Id</Form.Label>
                    <Form.Control
                      type="text"
                      name="assignee"
                      value={unique.assignee || ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formProjectDescription">
                    <Form.Label>Project Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="project_description"
                      value={unique.project_description || ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formProjectTitle">
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="project_title"
                      value={unique.project_title || ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formDueDate">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="dueDate"
                      value={unique.dueDate || ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formStatus">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type="text"
                      name="Status"
                      value={unique.Status || ""}
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group controlId="formProgress">
                    <Form.Label>Progress</Form.Label>
                    <Form.Control
                      type="text"
                      name="Progress"
                      value={unique.Progress || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </>
              ) : (
                <p>No task data available</p>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal1}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleProgress(unique._id)}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default AssignTask;
