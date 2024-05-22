const mongoose=require('mongoose');

const Submission=new mongoose.Schema({

    QuestionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true

    },
    SubmittedAt:{
        type:Date,
        default: Date.now
    },
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    Status: {
        type: String,
        enum: ['Accepted', 'Failed'],
        required: true
    }

});

module.exports=mongoose.model('Submission',Submission);