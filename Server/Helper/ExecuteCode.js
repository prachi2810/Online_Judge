const {exec}=require("child_process");
const fs=require("fs");
const path=require("path");
// const { stdout, stderr } = require("process");

const OutputPath=path.join(__dirname,"outputs");

if(!fs.existsSync(OutputPath)){
    fs.mkdirSync(OutputPath,{recursive:true}); //if we don't get path again make folder
}


const ExecuteCpp=async(filepath,inputpath)=>{
   const JobID=path.basename(filepath.split(".")[0]);
   const OutPath=path.join(OutputPath,`${JobID}.out`);

   return new Promise((resolve, reject) => {
    // Run g++ filename then store output in outpath then go to output folder run output file
    exec(`g++ ${filepath} -o ${OutPath} && cd ${OutputPath} && ./${JobID}.out < ${inputpath}`, (error, stdout, stderr) => {
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

const ExecuteJava = (filepath, inputpath) => {
    const jobID=path.basename(filepath.split(".")[0]);
    // console.log
    const OutPath=path.join(OutputPath,`${jobID}.out`);
    console.log("javaa");
    const className = jobID;
    return new Promise((resolve, reject) => {
        exec(`javac ${filepath} -d ${OutPath} && cd ${OutputPath} && java ${className} < ${inputpath}`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error);
            } else {
                resolve(stdout);
            }
        });
    });
};

const ExecutePython = (filepath, inputpath) => {
    const JobID=path.basename(filepath.split(".")[0]);
   const OutPath=path.join(OutputPath,`${JobID}.out`);
    return new Promise((resolve, reject) => {
        exec(`python3 ${filepath} < ${inputpath}`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error);
            } else {
                resolve(stdout);
            }
        });
    });
};

const ExecuteJavaScript = (filepath, inputpath) => {
    console.log(`Executing JavaScript file: ${filepath} with input: ${inputpath}`); // Additional log
    return new Promise((resolve, reject) => {
        exec(`node ${filepath} < ${inputpath}`, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error);
            } else {
                resolve(stdout);
            }
        });
    });
};


const ExecuteCode = async (language, filepath, inputpath) => {
    console.log(`Language received: ${language}`);  // Add this log
    console.log(`Filepath received: ${filepath}`);  // Add this log
    console.log(`Inputpath received: ${inputpath}`); 
    switch (language.toLowerCase()) {
        case 'cpp':
            return ExecuteCpp(filepath, inputpath);
        case 'java':
            return ExecuteJava(filepath, inputpath);
        case 'python':
            return ExecutePython(filepath, inputpath);
        case 'javascript':
        case 'js':
            return ExecuteJavaScript(filepath, inputpath);
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
};

module.exports={
    ExecuteCode
}