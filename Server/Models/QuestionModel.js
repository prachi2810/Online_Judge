const mongoose=require("mongoose");


const Question=new mongoose.Schema(
    {

      Title:{
        type:String,
        required:true,
        unique:true,
      },
      Description:{
        type:String,
        required:true,
      },
      Level:{
        type:Number,
        required:true,
      },
      TestCase:[{
        Input: {
            type: String,
        },
        Output: {
            type: String,
        }
      }],
      Constraints:{
        type:String,
        required:true,
      },
      Topic:{
        type:Number
      }

    }
)

module.exports=mongoose.model('Question',Question);