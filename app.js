const express= require('express')
const app=express()
const PORT= process.env.PORT|| 7000
const MONGOURL=require('./config/env')
var cors = require('cors')

const mongoose=require('mongoose')



mongoose.connect(MONGOURL.MONGOURL,{ useUnifiedTopology: true, useNewUrlParser: true })

mongoose.connection.on('connected',()=>{
    console.log("mongo db connnected");
})

mongoose.connection.on('<---mongo db connection error--->',(err)=>{
    console.log('mongo db connection error',err);
})


require('./models/user')
require('./models/post')


app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log('server started at :',PORT);
    console.log('Your Url is',"localhost:"+PORT);
})

