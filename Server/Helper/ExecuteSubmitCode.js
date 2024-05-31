const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the output directory exists
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

const executeCommand = async (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

const ExecuteSubmitCode = async (filepath, testcases) => {
    const JobID = path.basename(filepath, path.extname(filepath));
    const OutputDir = path.join(__dirname, 'output');
    const OutPath = path.join(OutputDir, `${JobID}.out`);
    const InputFile = path.join(__dirname, 'input.txt');

    const fileExtension = path.extname(filepath);
    console.log("ext", fileExtension);

    // Ensure the output directory exists
    ensureDirectoryExists(OutputDir);

    let compileCommand = null;
    let runCommand = null;

    if (fileExtension === '.cpp') {
        compileCommand = `g++ ${filepath} -o ${OutPath}`;
        runCommand = `${OutPath} < ${InputFile}`;
    } else if (fileExtension === '.js') {
        console.log("inside javascript....");
        compileCommand = null; // No compilation needed for JavaScript
        runCommand = `node ${filepath} < ${InputFile}`;
    } else if (fileExtension === '.python') {
        console.log("inside python");
        compileCommand = null; // No compilation needed for Python
        runCommand = `python3 ${filepath} < ${InputFile}`;
    } else {
        return testcases.map((testcase) => ({
            testcase,
            success: false,
            error: 'Unsupported file extension'
        }));
    }

    // Compile the code if necessary
    if (compileCommand) {
        try {
            await executeCommand(compileCommand);
        } catch (error) {
            return testcases.map((testcase) => ({
                testcase,
                success: false,
                error: `Compilation failed: ${error.message}`
            }));
        }
    }

    const Results = [];

    for (let testcase of testcases) {
        const { Input, Output } = testcase;

        fs.writeFileSync(InputFile, Input);

        try {
            const result = await executeCommand(runCommand);
            if (result.trim() === Output.trim()) {
                Results.push({
                    testcase,
                    success: true,
                    result: result.trim()
                });
            } else {
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

module.exports = { ExecuteSubmitCode };
