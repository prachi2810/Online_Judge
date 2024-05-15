const fs=require("fs");
const path=require("path");
const { v4: uuidv4 } = require('uuid'); 

const DirCodes=path.join(__dirname,"inputs");

if(!fs.existsSync(DirCodes)){
    fs.mkdirSync(DirCodes,{recursive:true}); //if we don't get path again make folder
}




const GenerateInputFile=async(input)=>{
   const JobID=uuidv4();
   const FileName=`${JobID}.txt`;
   const FilePath=path.join(DirCodes,FileName);

   await fs.writeFileSync(FilePath,input);

   return FilePath;




}

module.exports={
    GenerateInputFile
}