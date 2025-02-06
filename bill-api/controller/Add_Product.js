const Product = require("../models/Product_model");

// ---------------------------add product----------------

const Addproduct = async (req, res) => {
  const { productname, price, brand, gst } = req.body;

  try {
    if (!price || !productname || !gst) {
      return res.status(404).json({
        error: true,
        message: "Missing required feild",
      });
    }

    if (!req.file) {
        return res.status(400).json({
          error: true,
          message: "Image is required",
        });
      }
    const Newproduct = new Product({
      productname,
      image: req.file.path,
      price,
      brand,
      gst,
    });

    await Newproduct.save();
    return res.status(200).json({
      error: false,
      message: "Product Addedd successfully",
      data: [Newproduct],
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


// ----------------------------get product list-------------------

const Allproducts=async(req,res)=>{


try{
const products=await Product.find({is_deleted:{$ne:1}});
if(products.lenght===0 || !products ){
  return res.status(404).json({
    error:true,
    message:"No products found"
  })
}

return res.status(200).json({
  error:false,
  message:"Product list..",
  data:[products]
})
  
}
catch(error){
  return res.status(500).json({
    error:true,
    message:"Internal server error"
  })
}


}


// ----------------------------single product-----------------------

const Getsingleproduct=async(req,res)=>{
  const {id}=req.params;

  try{

    if(!id){
      return res.status(404).json({
        error:true,
        message:"Id is require"
      })
    }

    const getproduct=await Product.findById(id);
    if(getproduct.lenght===0){
      return res.status(400).json({
        error:true,
        message:"product not found"
      })
    }

    return res.status(200).json({
      error:false,
      message:"Product data",
      data:[getproduct]
    })


  }catch(error){
    return res.status(500).json({
      error:true,
      message:"Intenal server error"
    })
  }
}


// ----------------------------update product---------------------


const Updateproduct=async(req,res)=>{

  const {id}=req.params;
const {productname,price,gst,brand}=req.body;
  try{

    if(!id){
      return res.status(404).json({
        error:true,
        message:"Id is required"
      })
    }
    if(!price || !productname){

      return res.status(400).json({
        error:true,
        message:"missing required feild"
      })
    }

    const updatedata={
      productname,
      price,
      gst,
      brand
    };

    const updateproduct = await Product.findByIdAndUpdate(id, updatedata, { new: true });

    return res.status(200).json({
      error:false,
      message:"Product updated successfully",
      data:[updateproduct]
    })




  }catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal server error"
    })
  }
}

// -----------------------------------Delete product-------------------

const Deleteproduct=async(req,res)=>{

  const {id}=req.params;

  try{


    if(!id){
      return res.status(404).json({
        error:true,
        message:"Id is required"
      })
    }

    const delpro=await Product.findByIdAndUpdate(id,{is_deleted:1},{new:true});

    return res.status(200).json({
        error:false,
        message:"Product deleted successfully.",
        data:[delpro]
    })
  }
  catch(error){
    return res.status(500).json({
      error:true,
      message:"Internal server error"
    })
  }
}



module.exports = { Addproduct,Allproducts,Getsingleproduct,Updateproduct,Deleteproduct };