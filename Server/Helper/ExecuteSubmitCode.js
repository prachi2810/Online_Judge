const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the output directory exists
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};



const ExecuteSubmitCode = async (filepath, testcases) => {
    const JobID = path.basename(filepath, path.extname(filepath));
    const OutputDir = path.join(__dirname, 'output');
    const OutPath = path.join(OutputDir, `${JobID}.out`);
    const InputFile = path.join(__dirname, 'input.txt');

    // Ensure the output directory exists
    ensureDirectoryExists(OutputDir);

    // Compile the code once
    try {
        await executeCommand(`g++ ${filepath} -o ${OutPath}`);
    } catch (error) {
        return testcases.map((testcase) => ({
            testcase,
            success: false,
            error: `Compilation failed: ${error.message}`
        }));
    }
    const Results=[];

    for (let testcase of testcases) {
        const { Input, Output } = testcase;

        fs.writeFileSync(InputFile, Input);

        try {
            const result = await executeCommand(`${OutPath} < ${InputFile}`);
            if (result.trim() === Output.trim()) {
                Results.push({
                    testcase,
                    success:true,
                    result:result.trim()
                })
            }
            else{
                Results.push({
                    testcase,
                    success: false,
                    result: result.trim(),
                    expected: Output.trim()
                });
            }
        } catch (error) {
            Results.push({
                testcase,
                success: false,
                error: `Execution failed: ${error.message}`
            });
        }
    }
    return Results; 
};

const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
};

module.exports = { ExecuteSubmitCode };
