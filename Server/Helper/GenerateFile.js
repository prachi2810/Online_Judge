const fs=require("fs");
const path=require("path");
const { v4: uuidv4 } = require('uuid'); 

const DirCodes=path.join(__dirname,"codes");

if(!fs.existsSync(DirCodes)){
    fs.mkdirSync(DirCodes,{recursive:true}); //if we don't get path again make folder
}




const GenerateFile=async(language,code)=>{
   const JobID=uuidv4();
   const FileName=`${JobID}.${language}`;
   console.log("filename",FileName);
   const FilePath=path.join(DirCodes,FileName);

   await fs.writeFileSync(FilePath,code);

   return FilePath;
}

module.exports={
    GenerateFile
}