const router = require('express').Router()
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')
const CryptoJS = require('crypto-js')
const User = require('../models/User')


//Update
router.put("/:id",verifyTokenAndAuthorization,async (req,res)  =>{
    
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()    
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
            $set:req.body
            },{
                new:true
            });

        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err.toString())
    }

});


//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{

    try{
            const deletedUser = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})


//Get user stats

router.get('/stats',verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    
    try{
        const data = await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project :{
                    month:{$month:"$createdAt"}
                }
            },
            
            {
                $group:{
                    _id: "$month",
                    total:{$sum:1}
                }
            }
        ])

            res.json(data)
    }catch(err){

    }
})

//Get All users
router.get("/", verifyTokenAndAdmin, async (req,res)=>{

    const query = parseInt(req.query.paginate)
    try{
           const users =  query ? await User.find().sort({_id:-1}).limit(query) : await User.find().sort({_id:-1})
           res.status(200).json(users)
    }catch(err){
        res.status(500).json(err)
    }
})

//Get
router.get("/:id", verifyTokenAndAdmin, async (req,res)=>{

    try{
           const user =  await User.findById(req.params.id)
           const {password,...others} = user._doc
            res.status(200).json(others)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router