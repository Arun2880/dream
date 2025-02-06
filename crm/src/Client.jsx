import { useState } from "react";
import "./App.css";
import Header from "./Header";



import ClientSidebar from "./ClientSidebar";
import Profile from "./Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Refferal from "./Refferal";
import SubClient from "./SubClient";


const Client = () => {
 
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
    const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle);
    };
  return (
    <div className="grid-container">
     <Header OpenSidebar={OpenSidebar} />
    
     <ClientSidebar
      openSidebarToggle={openSidebarToggle}
      OpenSidebar={OpenSidebar}
    />
    {/* <Home/> */}
     <Routes>
     <Route path="/Profile" element={<Profile/>} />
     <Route path="/SubClient" element={<SubClient/>} />
     <Route path="/Refferal" element={<Refferal/>} />
    
   
     </Routes>
  </div>

  )
}

export default Client
