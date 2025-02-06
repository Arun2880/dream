const express = require('express');
const router = express.Router();

// const clientController = require('../controller/client_controller');
const serviceController = require('../controller/service_controller');
const billController = require('../controller/billing_controller');
const registerController = require('../controller/registerController');
const loginController = require('../controller/loginController');
const { protect } = require('../middlewares/authMiddleware');
const { EmployeeData, GetEmployee, GetEmployeeById, UpdateEmpData, DeleteEmp } = require('../controller/Employee_controller');
const { createClient, GetClientData, updateClient, deleteClient, getClientByClientNo } = require('../controller/clinet_controller');
const ClientData=require('../controller/clinet_controller');
const createBill=require('../controller/billing_controller');
const {createDocument, updateDocument,getPaginatedDocuments} = require('../controller/billing_controller');
const createServices = require('../controller/service_controller');
const {Addtask,Getalltask,Getsingletask,Updatetask}=require('../controller/task_controller');
const calculateRevenue=require('../controller/revenue_cotroller');
const {AddSubclient,Getallsubclient,Getsinglesubclient,getSubclientsByClient}=require('../controller/sub_client_controller');
const { getChartData } = require('../controller/home_controller');

const { Login, register, logout, authMiddleware } = require('../controller/auth_controller');

// router.post('/register', registerController.register);
// router.post('/login', loginController.login);


router.post('/addemp', EmployeeData);
router.get('/getemp', GetEmployee);
router.put('/updateemp/:id', UpdateEmpData);
router.get('/getuniqueemp/:id', GetEmployeeById);
router.delete('/delemp/:id', DeleteEmp);
router.get('/getuniclient/:clientno',getClientByClientNo);


// router.post('/bills', protect, billController.createBill);
router.post('/clients', createClient);

// Get all clients
router.get('/getclients', GetClientData);

// Get a specific client by client number
router.get('/singleclients/:clientno', getClientByClientNo);

// Update a client
router.put('/updateclients/:id', updateClient);

// Delete a client (soft delete)
router.delete('/clients/:id', deleteClient);
router.post('/services', createServices);
// router.post('/genratebill',createBill);
router.post('/genratebill', createDocument);

router.post('/register', register);
router.post('/login', Login);
router.post('/logout', logout);





router.post('/addtask',Addtask);

router.get('/gettasks',Getalltask);
router.get('/singletask/:id',Getsingletask);
router.put('/updatetask/:id',Updatetask);



router.post('/genraterevenu',calculateRevenue);


router.post('/addsubclient',AddSubclient);
router.get('/allsubclients',Getallsubclient);
router.get('/subsingleclient/:id',Getsinglesubclient);
router.get('/getallsubclients/:clientId',getSubclientsByClient);
router.put('/updateBilling/:_id', updateDocument);
router.get('/fetchBilling',getPaginatedDocuments);
router.get('/getChart',getChartData);
router.get('/checkauth', authMiddleware, (req,res)=>{
  const user = req.user;
  res.status(200).json({
    success : true,
    message: 'User is authenticated',
    user,

    
  })
})

 
 



module.exports = router;