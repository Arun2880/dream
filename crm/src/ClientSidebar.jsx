import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import logo from "./assets/logo.png";
import {
  BsCart3,
 
  BsPeopleFill,
  BsFillGrid3X3GapFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill
} from "react-icons/bs";
import { BsGrid1X2Fill, BsPerson, BsPersonPlus, BsShare } from 'react-icons/bs';
const ClientSidebar = ({ openSidebarToggle, OpenSidebar }) => {
 
   const [isOpenClient, setIsOpenClient] = useState(false);
  const [isOpenEmployee, setIsOpenEmployee] = useState(false);
  const [isOpenTask, setIsOpenTask] = useState(false);

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
    <Link to="/Client/Profile">
      <BsPerson className="icon" /> Profile
    </Link>
  </li>
  <li className="sidebar-list-item">
    <Link to="/Client/SubClient">
      <BsPersonPlus className="icon" /> Add Sub Client
    </Link>
  </li>
  <li className="sidebar-list-item">
    <Link to="/Client/Refferal">
      <BsShare className="icon" /> Refferal
    </Link>
  </li>
</ul>
    </aside>
  )
}

export default ClientSidebar
