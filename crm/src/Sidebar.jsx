import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import logo from "./assets/logo.png";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsPeopleFill,
  BsFillGrid3X3GapFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  // Separate state variables for each dropdown
  const [isOpenClient, setIsOpenClient] = useState(false);
  const [isOpenEmployee, setIsOpenEmployee] = useState(false);
  const [isOpenTask, setIsOpenTask] = useState(false);
  const [isOpenErika, setIsOpenErika] = useState(false);

  // Toggle functions for each dropdown
  const toggleClientDropdown = (e) => {
    e.preventDefault();
    setIsOpenClient(!isOpenClient);
  };

  const toggleEmployeeDropdown = (e) => {
    e.preventDefault();
    setIsOpenEmployee(!isOpenEmployee);
  };

  const toggleTaskDropdown = (e) => {
    e.preventDefault();
    setIsOpenTask(!isOpenTask);
  };
  const toggleErikaDropdown = (e) => {
    e.preventDefault();
    setIsOpenErika(!isOpenErika);
  };


  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <img src={logo} alt="" style={{ height: '100px', width: '200px' }} />
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/Admin/Home">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Dropdown show={isOpenClient} onToggle={toggleClientDropdown}>
            <Dropdown.Toggle
              className="toggle"
              as="a"
              variant="link"
              id="dropdown-client"
              onClick={toggleClientDropdown}
            >
              <BsPeopleFill className="icon" /> Client
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/Admin/AddClient">
                Add Client
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/Admin/ViewClient">
                View Client
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>

        <li className="sidebar-list-item">
          <Dropdown show={isOpenEmployee} onToggle={toggleEmployeeDropdown}>
            <Dropdown.Toggle
              className="toggle"
              as="a"
              variant="link"
              id="dropdown-employee"
              onClick={toggleEmployeeDropdown}
            >
              <BsFillGrid3X3GapFill className="icon" /> Employee
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/Admin/AddEmployee">
                Add Employee
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/Admin/ViewEmployee">
                View Employee
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>


        <li className="sidebar-list-item">
          <Dropdown show={isOpenErika} onToggle={toggleErikaDropdown}>
            <Dropdown.Toggle
              className="toggle"
              as="a"
              variant="link"
              id="dropdown-employee"
              onClick={toggleErikaDropdown}
            >
              <BsFillGrid3X3GapFill className="icon" /> Erika
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/Admin/Erika">
                Add Product
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/Admin/ViewErika">
                View Product
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/Admin/ErikaBilling">
                Billing
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/Admin/ErikaUpdate/Billing">
                View & Update Bills 
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/Admin/ErikaUpdate/Quotation">
                View & Update Quotation 
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>

        <li className="sidebar-list-item">
          <Link to="/Admin/Billing">
            <BsListCheck className="icon" /> Billing & Quotation
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/Admin/update">
            <BsListCheck className="icon" /> Update Bills
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Dropdown show={isOpenTask} onToggle={toggleTaskDropdown}>
            <Dropdown.Toggle
              className="toggle"
              as="a"
              variant="link"
              id="dropdown-task"
              onClick={toggleTaskDropdown}
            >
              <BsMenuButtonWideFill className="icon" /> Assign Task
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/Admin/Quotation">
                Assign Task
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/Admin/AssignTask">
                View Task
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </li>
        <li className="sidebar-list-item">
          <Link to="/Admin/Revenue">
            <BsFillGearFill className="icon" /> Revenue
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
