
const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const LoginRoutes=require("./Routes/LoginRoutes");
const QuestionRoutes=require("./Routes/QuestionsRoutes");
const {AuthAccessToken}=require("./Middlerware/Auth");
dotenv.config();
const cookieParser = require("cookie-parser");
const {DbConnection}=require("./Database/Db");
const cors = require("cors");

const app=express();


app.use(cors());
app.use(express.json());//if json body is coming
app.use(express.urlencoded({extended:true})) //if formdata is coming
app.use(cookieParser());

DbConnection();

app.listen(process.env.APP_PORT,()=>{
    console.log(`App running on port ${process.env.APP_PORT}`);
})

app.get("/",AuthAccessToken, (req, res) => {
    res.send("Hello, world!");
});

app.use('/api',LoginRoutes);
app.use('/api',QuestionRoutes);
