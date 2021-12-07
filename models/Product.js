const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
    {
        title: {type:String,requred:true,unique:true},
        desc: {type:String,requred:true},
        img: {type:String,requred:true},
        catagories: {type:Array},
        size: {type:String},
        color: {type:String},
        price: {type:Number,requred:true},
    
    },
    {timestamps:true}
);

module.exports = mongoose.model('Product',ProductSchema)