import { useParams } from "react-router-dom";
import UseAxiosPrivate from "../../Hooks/useAxiosPrivate";
import { useEffect, useState, useRef } from "react";
import axiosUsePrivate from '../../api/axios';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

import './Compiler.css';

function Compiler() {
    const [question, setQuestion] = useState({});
    const [code, setCode] = useState(`
    #include <iostream> 
    using namespace std;
    // Define the main function
    int main() { 
        // Declare variables
        int num1, num2, sum;
        // Prompt user for input
        cin >> num1 >> num2;  
        // Calculate the sum
        sum = num1 + num2;  
        // Output the result
        cout << "The sum of the two numbers is: " << sum;  
        // Return 0 to indicate successful execution
        return 0;  
    }
    `);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const axiosPrivate = UseAxiosPrivate(axiosUsePrivate);
    const levels = ['Low', 'Medium', 'High'];
    const outputTabRef = useRef(null);

    const { id } = useParams();

    const getQuestion = async () => {
        try {
            const response = await axiosPrivate.get(`/getquestion/${id}`);
            setQuestion(response.data.question);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                language: 'cpp',
                code,
                input
            };
            const response = await axiosPrivate.post(`/run`, JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response);
            setOutput(response.data.output);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getQuestion();
    }, [id]);

    return (
        <div className="question-container">
            {question &&
                <div className="row">
                    <div className="col-md-6">
                        <div className="question-header">
                            <h5>{question.Title}</h5>
                            <p className="level" style={{ color: question.Level === 1 ? 'green' : question.Level === 2 ? '#EF9819' : question.Level === 3 ? 'red' : 'black' }}>{levels[question.Level - 1]}</p>
                        </div>
                        <hr />
                        <div className="question-description">
                            <p>{question.Description}</p>
                        </div>
                        {question.TestCase && question.TestCase.map((test, index) => (
                            <div key={index} className="test-case">
                                <h6>Example Test Case {index + 1}:</h6>
                                <div className="test-input">
                                    <p><strong>Input:</strong> {test.Input}</p>
                                </div>
                                <div className="test-output">
                                    <p><strong>Output:</strong> {test.Output}</p>
                                </div>
                            </div>
                        ))}
                        <div className="question-constraints">
                            <h4>Constraints:</h4>
                            <p>{question.Constraints}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div>
                            
                            <div className='col-md-12'>
                            <div className="d-flex align-items-center">
                            <p className="me-3">Languages:</p>
                                <div className='col-md-3 mb-2'>
                                    <select className="form-select" aria-label="Default select example">
                                        <option selected>CPP</option>
                                        <option value="1">JAVA</option>
                                        <option value="2">Python</option>
                                        <option value="3">JavaScript</option>
                                    </select>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div>
                            <Editor
                                value={code}
                                onValueChange={code => setCode(code)}
                                highlight={code => highlight(code, languages.js)}
                                padding={10}
                                style={{
                                    fontFamily: '"Fira code", "Fira Mono", monospace',
                                    fontSize: 12,
                                    outline: 'none',
                                    border: 'none',
                                    backgroundColor: '#f7fafc',
                                    height: '100%',
                                    overflowY: 'auto'
                                }}

                            />
                        </div>
                        <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="input-tab" data-bs-toggle="tab" data-bs-target="#input" type="button" role="tab" aria-controls="input" aria-selected="true">Input</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="output-tab" data-bs-toggle="tab" data-bs-target="#output" type="button" role="tab" aria-controls="output" aria-selected="false">Output</button>
                            </li>
                        </ul>
                        <div>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="input" role="tabpanel" aria-labelledby="input-tab">
                                    <textarea
                                        rows='5'
                                        cols='15'
                                        value={input}
                                        placeholder='Input'
                                        onChange={(e) => setInput(e.target.value)}
                                        className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500 resize-none w-full"
                                        style={{
                                            fontFamily: '"Fira code", "Fira Mono", monospace',
                                            fontSize: 12,
                                            minHeight: '100px', width: '650px', marginTop: '20px'
                                        }}
                                    ></textarea>
                                </div>
                                <div className="tab-pane fade" id="output" role="tabpanel" aria-labelledby="output-tab">
                                    {(

                                        <textarea
                                            className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500 resize-none w-full"
                                            rows='5'
                                            cols='15'
                                            value={output}
                                            placeholder='Output'
                                            style={{
                                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                                fontSize: 12,
                                                minHeight: '100px',
                                                width: '650px',
                                                marginTop: '20px'
                                            }}
                                        >
                                            {output}
                                        </textarea>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={handleSubmit} type="button" className="btn btn-primary">
                                Run
                            </button>

                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Compiler;
