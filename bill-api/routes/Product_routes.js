const express=require('express');

const router=express.Router();

const {Addproduct,Allproducts,Getsingleproduct,Updateproduct,Deleteproduct}=require('../controller/Add_Product');
const {upload}=require('../config/multerconfig');
const { createBilling } = require('../controller/Erika_Billing');
const { createQuotation } = require('../controller/Erika_quotation');
const { updateBillingByGST, fetchAllBills } = require('../controller/Erika_update_billing');
const { updateQuotation, fetchAllQuotation } = require('../controller/Erika_update_quotation');


router.post('/addproduct',upload.single('image'), Addproduct);
router.get('/productlist',Allproducts);
router.get('/product/:id',Getsingleproduct);
router.put('/updatepro/:id',Updateproduct);
router.delete('/delpro/:id',Deleteproduct);


router.post('/createbill', createBilling);
router.post('/createquotation', createQuotation);
router.put('/updatebill', updateBillingByGST );
router.get('/fetchAllBills', fetchAllBills );
router.put('/updateQuotation', updateQuotation );
router.get('/fetchAllQuotation', fetchAllQuotation );

module.exports=router;