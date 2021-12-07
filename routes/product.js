const router = require('express').Router()
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require('crypto-js')
const Product = require('../models/Product')




//CREATE
router.post("/",verifyTokenAndAdmin,async(req,res)=>{
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    }catch(err){
        res.status(500).json(err)
    }
})

//Update
router.put("/:id",verifyTokenAndAuthorization,async (req,res)  =>{
 
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
            $set:req.body
            },{
                new:true
            });

        res.status(200).json(updatedProduct)
    }catch(err){
        res.status(500).json(err.toString())
    }

});



//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{

    try{

            const deletedProduct = await Product.findByIdAndDelete(req.params.id)
            console.log(deletedProduct)
            if(deletedProduct == null){
                return res.status(201).json("Product Not Found")
            }
            return res.status(200).json("Product has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})


//Get All Products
router.get("/", async (req,res)=>{

    const queryNew = (req.query.new)

    const queryCatagory = (req.query.catagory)

    console.log(queryCatagory)
    try{
           
        let product;
            if(queryNew && queryCatagory){
                product = await Product.find(
                    {
                        catagories:{
                             $in:[queryCatagory],
                         }
                    }
              ).sort({_id:-1}) 
            }else if(queryCatagory){
                product =  await Product.find(
                    {
                        catagories:{
                             $in:[queryCatagory],
                         }
                    }
              ) 
            }else if(queryNew){
                product =  await Product.find().sort({_id:-1})
            }else{
                 product = await Product.find().sort({_id:-1}); 
            }
        
            if(!product){
                return res.status(201).json("Product Not Found")
            }
           return res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})

//Get 
router.get("/find/:id", async (req,res)=>{

    try{
           const product =  await Product.findById(req.params.id)
           if(!product){
               return res.status(201).json("Product Not Found")
           }
           return res.status(200).json(product)
    }catch(err){
        return res.status(500).json(err)
    }
})


module.exports = router