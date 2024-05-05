const {exec}=require("child_process");
const fs=require("fs");
const path=require("path");
// const { stdout, stderr } = require("process");

const OutputPath=path.join(__dirname,"outputs");

if(!fs.existsSync(OutputPath)){
    fs.mkdirSync(OutputPath,{recursive:true}); //if we don't get path again make folder
}


const ExecuteCpp=async(filepath)=>{
   const JobID=path.basename(filepath.split(".")[0]);
   const OutPath=path.join(OutputPath,`${JobID}.exe`);

   return new Promise((resolve, reject) => {
    // Run g++ filename then store output in outpath then go to output folder run output file
    exec(`g++ ${filepath} -o ${OutPath} && cd ${OutputPath} && ./${JobID}.exe`, (error, stdout, stderr) => {
        if (error) {
            reject(error);
        }
        if (stderr) {
            reject(stderr);
        }
        resolve(stdout);
    });
});
   

};

module.exports={
    ExecuteCpp
}