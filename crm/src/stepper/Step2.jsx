import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import "../Css/stepper.css";
import Swal from "sweetalert2";
import "../Css/Addclient.css"; 
import { useNavigate } from 'react-router-dom';

const Step2 = () => {
  const navigate = useNavigate();
  const [clientno, setClientno] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(true);

  const handleToggle = () => {
    setIsExistingUser(!isExistingUser);
  };

  const handleExistance = async (clientno) => {
    console.log("Client No:", clientno);
    try {
        const url = `https://crm.dreambytesolution.com/dream/getuniclient/${clientno}`;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        console.log("Client ID submitted:", clientno);
        const response = await axios.get(url, { headers });
        console.log("API response:", response.data); 
        

        // Check if response.data is an array and has elements
        if (Array.isArray(response.data.data) > 0) {
            
            const fetch = response.data.data[0]; // Accessing first element in the array
            console.log("Client Data:", fetch);
            // navigate(`/Billing?data=${fetch.clientno}`);
            const setUser = fetch.clientno;
            sessionStorage.setItem("client no", setUser)
            
            
           

            if (fetch.name) {
                 // Show success alert with client information
                Swal.fire({
                    title: fetch.name,
                    text: `Company Name: ${fetch.company_name}`,
                });
                
               
             
            } else {
                // Show error alert if client does not have a name
                Swal.fire({
                    icon: "error",
                    title: "Client does not exist",
                    text: "Please enter the correct client number or add a new client.",
                });
            }
        } else {
            // Handle case where response.data is empty or not an array
            Swal.fire({
                icon: "error",
                title: "Client does not exist",
                text: "Please enter the correct client number or add a new client.",
            });
        }
    } catch (error) {
        console.error("API request failed:", error);
        // Show error alert if the API request fails
        Swal.fire({
            icon: "error",
            title: "Client does not exist",
            text: "Please enter the correct client number or add a new client.",
        });
    }
};
  

  

  return (
    <div className='maincon '>
      <div className='new'>
        <h2>Existing Client</h2>
        <Link to="/AddClient">
        <button onClick={handleToggle} className='button'>
         Add New Client
        </button>
           
          </Link>
        
       
      </div>
      <div>  
      <div className="client"> 
        <label htmlFor="clientno">Client No</label>
        <input
          type="text"
          name='clientno'
          placeholder='Client No.'
          value={clientno}
          onChange={(e) => setClientno(e.target.value)}
        />
      </div>
      <div className='btn'>      
        <button onClick={() => handleExistance(clientno)} className='button'>Submit</button>
      </div>
    </div>
      
    </div>
  );
}

export default Step2;
