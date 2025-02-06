import React from 'react';
import { Col, Row, Form, Button, Container, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const Step5 = () => {

  const location = useLocation();
  const newdata = location.state?.data || []; 
  const pdf= sessionStorage.getItem("pdf");
  console.log(newdata);
  console.log(pdf);

  





  const handleDownload = async () => {
    try {
      // URL of the file to be downloaded
      const fileUrl = `https://crm.dreambytesolution.com/${pdf}`;
      
      // Fetch the file from the URL
      const response = await fetch(fileUrl);
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a temporary URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'filename.pdf'; // Set the default file name
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up and remove the temporary link and URL
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <>  
    <h1>Invoice</h1>
    <Table>
      <thead>
        <tr>
          <th>
            Sr.No.
          </th>
          <th>
            Id 
          </th>
          <th>
            Service Name
          </th>
          <th>Service Id</th>
          <th>Price</th>
          <th>Gst </th>
          
        </tr>
      </thead>
      <tbody>
       {newdata.map((bill, index)=>(
        <tr key={index}>
          <td>{index+1}</td>  
          <td>{ bill._id}</td>
          <td>{bill.name}</td>
          <td>{bill.serviceId}</td>
          <td>{ bill.price}</td>
          <td> {bill.cgst}</td>
        </tr>
       ))}
      </tbody>
    </Table>
    
    <button onClick={handleDownload}>
      Download File
    </button>
    </>

  );
};

export default Step5;
