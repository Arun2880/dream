import React, { useState } from "react";
import axios from "axios";
import "../Css/stepper.css";

const Step1 = () => {
  const [isExistingUser, setIsExistingUser] = useState(true);
  const [clientno, setClientno] = useState("");
  const handleChangeExist = (event)=>{
    console.log("input field", event.target.value);
    setClientno(event.target.value);
  }
  const handleToggle = () => {
    setIsExistingUser(prevState => !prevState);
  };

  const handleExistence = async (event) => {
    event.preventDefault(); // Prevent form submission

    try {
      const url = `https://crm.dreambytesolution.com/dream/getuniclient/${exist.clientno}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      console.log("Client ID submitted:", exist.clientno); // Debugging
      const response = await axios.get(url, { headers });
      console.log("API response:", response.data); // Debugging
      setExist(response.data); // Update state with API response
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  

  const ExistingUserForm = () => (
    <form className="form" >
      <div className="form-group">
        <label htmlFor="clientno">Client ID</label>
        <input
          type="text"
          name="clientno"
          id="clientno"
          value={clientno}
          onChange={handleChangeExist}
          placeholder="Enter the client Number"
        
        />
      </div>
      <button type="submit" onClick={handleExistence}>Submit</button>
    </form>
  );

  const NewUserForm = () => (
    <form className="form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your Name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your Email"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your Password"
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );

  return (
    <div className="user-form-container">
      <div className="new">
        <h2>{isExistingUser ? "Existing User Form" : "New User Form"}</h2>
        <button onClick={handleToggle}>
          {isExistingUser ? "Switch to New User" : "Switch to Existing User"}
        </button>
      </div>
      {isExistingUser ? <ExistingUserForm /> : <NewUserForm />}
    </div>
  );
};

export default Step1;
