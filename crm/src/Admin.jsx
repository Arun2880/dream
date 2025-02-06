import { useState } from "react";
import "./App.css";
import Header from "./Header";

import Home from "./Home";

import Sidebar from "./Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddClient from "./AddClient";
import ViewClient from "./ViewClient";
import ViewEmployee from "./ViewEmployee";
import AddEmployee from "./AddEmployee";
import Quotation from "./Quotation";
import Billing from "./Billing";
import Refferal from "./Refferal";
import Step2 from "./stepper/Step2";
import AssignTask from "./AssignTask";
import Revenue from "./Revenue";
import Erika from "./Erika";
import Viewerika from "./View_erika";
import Erika_BIlling from "./Erika_BIlling";
import Erika_update_billing from "./Erika_update_billing";
import Erika_update_quotation from "./Erika_update_quotation";
import UpdateDocumentForm from "./updateBill";

const Admin = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
   
      <div className="grid-container">
        <Header OpenSidebar={OpenSidebar} />
        
        <Sidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
        {/* <Home/> */}
        <Routes>
        <Route path="/Home" element={<Home/>} />
        <Route path="/AddClient" element={<AddClient/>} />
        <Route path="/ViewClient" element={<ViewClient/>} />
        <Route path="/ViewEmployee" element={<ViewEmployee/>} />
        <Route path="/AddEmployee" element={<AddEmployee/>} />
        <Route path="/Refferal" element={<Refferal/>}/>
        <Route path="/Revenue" element={<Revenue/>}/>
        <Route path="/Quotation" element={<Quotation/>}/>
        <Route path="/AssignTask" element={<AssignTask/>}/>
        <Route path="/Billing" element={<Billing/>}/>
        <Route path="/stepper/Step2" element={<Step2/>}/>
        <Route path="/Erika" element={<Erika/>}/>
        <Route path="/ViewErika" element={<Viewerika/>}/>
        <Route path="/ErikaBilling" element={<Erika_BIlling/>}/>
        <Route path="/ErikaUpdate/Billing" element={<Erika_update_billing/>}/>
        <Route path="/ErikaUpdate/Quotation" element={<Erika_update_quotation/>}/>
        <Route path="/update" element={<UpdateDocumentForm/>}/>
       
      </Routes>
      </div>
      
   
  );
}

export default Admin
