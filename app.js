
const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const app=express();
console.log(process.env.MongoDB_URL);
mongoose.connect(process.env.MongoDB_URL)
    .then(() => {
        console.log("MongoDB connected...");
        // Start the Express server
        app.listen(process.env.APP_PORT, () => {
            console.log(`App running on port ${process.env.APP_PORT}`);
        });
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });


// module.exports=app.listen(process.env.APP_PORT,()=>{
//     console.log(`App running on port ${process.env.APP_PORT}`);
// })
