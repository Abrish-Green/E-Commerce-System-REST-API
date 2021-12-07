const router = require('express').Router()
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require('crypto-js')
const Order = require('../models/Order')




//CREATE
router.post("/",verifyToken,async(req,res)=>{
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    }catch(err){
        res.status(500).json(err)
    }
})

//Update
router.put("/:id",verifyTokenAndAdmin,async (req,res)  =>{
 
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
            $set:req.body
            },{
                new:true
            });

        res.status(200).json(updatedOrder)
    }catch(err){
        res.status(500).json(err.toString())
    }

});



//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{

    try{

            const deletedOrder = await Order.findByIdAndDelete(req.params.id)
            if(deletedOrder == null){
                return res.status(201).json("Order Not Found")
            }
            return res.status(200).json("Order has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})


//Get Order 
router.get("/find/:id", verifyToken,async (req,res)=>{

    try{
           const order =  await Order.find({userId:req.params.id})
           if(Order == null){
               return res.status(201).json("Order Not Found")
           }
           return res.status(200).json(order)
    }catch(err){
        res.status(500).json(err.toString())
    }
}) 

//Get user Orders
router.get("/",verifyToken,async (req,res)=>{
    try{
        const orders = await Order.find()
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json(err)
    }
})



//get monthly income

router.get("/income",verifyTokenAndAdmin, async(req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(new Date().setMonth(date.getMonth()-1))
    
    try{
        const income = await Order.aggregate([
            {$match : { createdAt: { $gte: previousMonth }}},
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales:"$amount",
                 }
            },
            {
                $group:{
                    _id: "$month",
                    total:{$sum:"$sales"}
                },
            },
        ]);

        return res.status(201).json(income)
    }catch(err){
        
        return res.status(500).json(err)
    }


})


module.exports = router