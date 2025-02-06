import React from 'react'
import { Button, Form } from 'react-bootstrap'
import './subclient.css'

const SubClient = () => {
  return (
    <div className='subclient'>
     <h1>Sub Client</h1>
     <Form>
      <Form.Group controlId='forName' className='input1'>
        <Form.Label>Name</Form.Label>
        <Form.Control
         type='text' 
          placeholder='Enter name' />

      </Form.Group>
      <Form.Group controlId='forId'className='input1' >
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
        type='number'
        placeholder='Enter Phone Number' />
      </Form.Group>
      <Form.Group controlId='forId' className='input1'>
        <Form.Label>Email</Form.Label>
        <Form.Control
        type='email'
        placeholder='Enter Email' />
      </Form.Group>
      <Form.Group controlId='forId' className='input1'>
        <Form.Label>Refferal code</Form.Label>
        <Form.Control
        type='string'
        placeholder='Enter Refferal code' />
      </Form.Group>

     </Form>
     <Button variant='primary' type='submit'>  Add a Sub Client</Button>
    </div>
  )
}

export default SubClient
