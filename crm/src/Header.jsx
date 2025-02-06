import axios from 'axios';
import React from 'react'
import { Button } from 'react-bootstrap'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';

 

function Header({OpenSidebar}) {
   const navigate = useNavigate(); 

  const handleLogout=async(e)=>{
    e.preventDefault();
    try{
      const response= await axios.post('https://bill.dreambytesolution.com/dream/logout');  
      if(response){
        navigate('/');
      }
    }
    catch(e){
      console.log("internal server error!");
    }

  }






  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            {/* <BsSearch  className='icon'/> */}
        </div>
        <div className='header-right'>
            <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/>
            <BsPersonCircle className='icon'/>
            <Button onClick={handleLogout} style={{marginTop:"3px"}}>Logout</Button>
        </div>
    </header>
  )
}

export default Header