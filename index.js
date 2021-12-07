const express = require('express')
const app = express()
const PORT = 5000;
const cors = require('cors')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config()

mongoose
    .connect(process.env.MONGO_LOCAL_SERVER_URL)
    .then(
        ()=> console.log('Connected')
    )
    .catch((err)=>{
       console.log(err)
});

//bodyparser
app.use(express.json())
app.use(cors())
//routes
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
//route assignment
app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/product/',productRoute)
app.use('/api/cart/',cartRoute)
app.use('/api/order/',orderRoute)

app.get('/',(req,res)=>{
    res.send('404')
});

app.listen(process.env.APP_PORT,()=>{
    console.log("Backend server is running")
});