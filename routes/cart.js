const router = require('express').Router()
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require('crypto-js')
const Cart = require('../models/Cart')




//CREATE
router.post("/",verifyToken,async(req,res)=>{
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    }catch(err){
        res.status(500).json(err)
    }
})

//Update
router.put("/:id",verifyTokenAndAuthorization,async (req,res)  =>{
 
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
            $set:req.body
            },{
                new:true
            });

        res.status(200).json(updatedCart)
    }catch(err){
        res.status(500).json(err.toString())
    }

});



//Delete
router.delete("/:id", verifyToken, async (req,res)=>{

    try{

            const deletedCart = await Cart.findByIdAndDelete(req.params.id)
            if(deletedCart == null){
                return res.status(201).json("Cart Not Found")
            }
            return res.status(200).json("Cart has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})


//Get user Carts

router.get("/",verifyToken, async (req,res)=>{
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err)
    }
})

//Get cart 
router.get("/find/:userId", verifyToken,async (req,res)=>{

    try{
           const cart =  await Cart.findOne({userId:req.params.userId})
           if(Cart == null){
               return res.status(201).json("Cart Not Found")
           }
           return res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router