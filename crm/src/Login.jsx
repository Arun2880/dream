import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import Swal from "sweetalert";


axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); 
  const navigate = useNavigate();  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://bill.dreambytesolution.com/dream/login', {
        email,
        password,
        withCredentials: true,
      });

      if (response.data.success) {
        Swal({
          title: "Good job!",
          text: "You logged in successfully",
          icon: "success"
        });
        
        navigate('/admin/home'); 
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://bill.dreambytesolution.com/dream/register', {
        username,
        email,
        password,
      });

      if (response.data.success) {
        Swal({
          title: "Good job!",
          text: "Your data was saved successfully",
          icon: "success"
        });

        
        setActiveTab('login');
      }
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} sm={12}>
          <div className="text-center mb-4">
            <h2>Login or Register</h2>
            <p>Please choose an option to log in or create a new account.</p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs 
            activeKey={activeTab} // Set active tab based on the state
            onSelect={(key) => setActiveTab(key)} // Update active tab on tab switch
            id="login-register-tabs" 
            className="mb-3"
          >
            {/* Login Tab */}
            <Tab eventKey="login" title="Login">
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} block>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            </Tab>

            {/* Register Tab */}
            {/* <Tab eventKey="register" title="Register">
              <Form onSubmit={handleRegister}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} block>
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Form>
            </Tab> */}
          </Tabs>

          <div className="mt-3 text-center">
            <p>
              {loading ? '' : (
                <>
                  Already have an account? <a href="/login">Login</a> |{' '}
                  <a href="/register">Register</a>
                </>
              )}
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
