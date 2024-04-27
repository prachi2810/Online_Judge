
const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const loginroutes=require("./Routes/LoginRoutes");
const {AuthAccessToken}=require("./Middlerware/Auth");
// const {LoginController} =require("./Controller/LoginController");
dotenv.config();
const cookieParser = require("cookie-parser");

const app=express();


app.use(express.json());//if json body is coming
app.use(express.urlencoded({extended:true})) //if formdata is coming
app.use(cookieParser());

mongoose.connect(process.env.MongoDB_URL)
    .then(() => {
        console.log("MongoDB connected...");
        
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });


app.listen(process.env.APP_PORT,()=>{
    console.log(`App running on port ${process.env.APP_PORT}`);
})

app.get("/",AuthAccessToken, (req, res) => {
    res.send("Hello, world!");
});

app.use('/api',loginroutes);

// module.exports = async (app) => {
//     LoginController(app);
// }