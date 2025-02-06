import * as React from 'react';
import "./billing.css";
import Stepper from "./stepper/Stepper.jsx";
import { Container, Form, Col, Button } from "react-bootstrap";
import "./Css/Addclient.css"; // Your custom CSS file
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Swal from "sweetalert";
import Step1 from "./stepper/Step1.jsx";
import Step2 from "./stepper/Step2.jsx";
import Step3 from './stepper/Step3.jsx';
import Step4 from './stepper/Step4.jsx';
import Step5 from './stepper/Step5.jsx';









const Checkout_steps=[
  {
    name: "customer info",
    Component: ()=><div>
      <Step2 />
    </div>
  },
  {
    name: "user  info",
    Component: ()=><div><Step3/></div>
  },
  {
    name: "employee info",
    Component: ()=><div><Step4/></div>
  },
  {
    name: "comfirm info",
    Component: ()=><div><Step5/></div>
  }
]



const Billing = () => {
  return (
    
    <div className='header1'>
      <h2>Checkout</h2>
     <Stepper stepsconfig={Checkout_steps}/>
    </div>
  )
}

export default Billing
