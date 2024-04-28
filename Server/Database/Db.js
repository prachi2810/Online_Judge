
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();


const DbConnection=async()=>{ 
    mongoose.connect(process.env.MongoDB_URL)
    .then(() => {
        console.log("MongoDB connected...");
        
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });
}

module.exports = {DbConnection};
