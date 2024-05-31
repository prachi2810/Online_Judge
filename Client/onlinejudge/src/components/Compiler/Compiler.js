import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import UseAxiosPrivate from "../../Hooks/useAxiosPrivate";
import axiosUserPrivate from '../../api/axios';
// import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import Editor, { monaco } from '@monaco-editor/react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
// import { setTotalAcceptedSubmissions } from '../../Redux/Slice/authSlice';



import './Compiler.css';
import SideNavBar from "./SideNavBar";
// import { useDispatch } from "react-redux";

function Compiler() {
    const [question, setQuestion] = useState({});
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const axiosPrivate = UseAxiosPrivate(axiosUserPrivate);
    const [language, setLanguage] = useState('cpp');
    const [load, setLoad] = useState(false);
    const [theme, setTheme] = useState('light');
    const [testcases, setTestcases] = useState([]);
    const [user, setUser] = useState('');
    const [submission, setSubmission] = useState([]);
    const levels = ['Low', 'Medium', 'High'];
    const [Loading,setLoading]=useState(false);

    const editorRef = useRef(null);

    const { id } = useParams();

    // const dispatch = useDispatch();

    const navigate = useNavigate();

    const defaultCodes = {
        cpp: `#include <iostream> 
using namespace std;
int main() { 
    return 0;  
}`,
        java: `import java.util.*;
import java.lang.*;
import java.io.*;

class Code
{
    public static void main (String[] args) throws java.lang.Exception
    {
        // your code goes here

    }
}`,
        python: `# cook your dish here`,
        js: `// your code goes here`
    };
    useEffect(() => {
        setCode(defaultCodes[language]);
    }, [language]);

    const getQuestion = async () => {
        try {
            setLoad(true);
            const response = await axiosPrivate.get(`/getquestion/${id}`);
            console.log(response);
            setQuestion(response.data.question);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoad(false);
        }
    };

    const handleCodeRun = async () => {
        const outputTab = document.getElementById('output-tab');
        if (outputTab) {
            outputTab.click();
        }
        
        try {
            setLoading(true);

            const payload = {
                language,
                code,
                input
            };
            const response = await axiosPrivate.post(`/run`, JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response);
            setOutput(response.data.output);

            if (response.data.error) {
                setOutput(`Error: ${response.data.error}`);
            } else {
                setOutput(response.data.output);
            }

        } catch (error) {
            const outputTab = document.getElementById('output-tab');
            if (outputTab) {
                outputTab.click();
            }
            if (error.response && error.response.data && error.response.data.error) {
                setOutput(`Error: ${error.response.data.error} ${error.response.data.details}`);
            } else {
                setOutput(`Error: ${error.message}`);
            }
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    };

    const handleCodeSubmit = async () => {
        try {
            const payload = {
                language,
                code,
                email: user.email

            };
            const response = await axiosPrivate.post(`/submit/${id}`, JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            console.log(response);
            setTestcases(response.data.results);
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleisLoggedIn = async () => {
        try {
            const response = await axiosPrivate.get('/isLoggedIn', { withCredentials: true });
            // console.log('ddd');
            // console.log(response.data);
            setUser(response.data);
            handleSubmission(response.data.id);
            // console.log("user", user);
            // handleSubmission(user.id);
            if (response.status == 401) {
                navigate('/unauthorized');
            }
        }
        catch (error) {
            navigate('/unauthorized');
        }
    }
    useEffect(() => {
        handleisLoggedIn();
    }, [submission]);



    useEffect(() => {
        getQuestion();
        console.log(theme);
    }, [id]);

    // const handleEditorDidMount = (editor, monaco) => {
    //     editorRef.current = editor;

    // Example of adding an action for copy-paste validation
    // editor.addAction({
    //     id: 'validate-paste',
    //     label: 'Validate Paste',
    //     keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_V],
    //     run: function (ed) {
    //         const selection = ed.getSelection();
    //         const text = ed.getModel().getValueInRange(selection);
    //         if (text.includes('forbidden')) {
    //             alert('Pasting this text is not allowed.');
    //             return null;
    //         }
    //         ed.trigger('paste', 'editor.action.clipboardPasteAction');
    //     }
    // });

    // };
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Add event listener for paste event
        editor.onDidPaste(() => {
            // Use the clipboard API to get the pasted text
            navigator.clipboard.readText().then((clipboardText) => {
                if (clipboardText.includes('forbidden')) {
                    alert('Pasting this text is not allowed.');
                    // Prevent the paste operation by clearing the selection
                    const selection = editor.getSelection();
                    if (selection) {
                        editor.executeEdits('my-source', [{ range: selection, text: '', forceMoveMarkers: true }]);
                    }
                }
            }).catch((err) => {
                console.error('Failed to read clipboard contents: ', err);
            });
        });
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'vs-dark' : 'light'));
    }

    const handleReset = () => {
        setCode(defaultCodes[language]);
    }

    const handleSubmission = async (userid) => {
        // console.log("ffffff",user.id);
        try {
            const response = await axiosPrivate.get(`/getsubmissiondetils/${userid}/${id}`);
            console.log(response.data);
            if (response.status == 404) {
                setSubmission('No Submission Found');
            }

            setSubmission(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }



    return (
        <>
            <SideNavBar />
            <div className="question-container">
                {load && (
                    <div class="d-flex justify-content-center flex-column align-items-center" style={{ height: '100vh' }}>
                        <div class="" role="status">
                            <span class="visually-hidden">Loading...</span>
                            <span class="loader"></span>
                        </div>
                    </div>
                )
                }
                {question &&
                    <div className="row">
                        <div className="col-md-6">
                            <ul className="nav nav-tabs mt-3" id="myTabs" role="tablists">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="true">Description</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="solution-tab" data-bs-toggle="tab" data-bs-target="#solution" type="button" role="tab" aria-controls="solution" aria-selected="false">Solution</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="submission-tab" data-bs-toggle="tab" data-bs-target="#submission" type="button" role="tab" aria-controls="submission" aria-selected="false">Submission</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
                                    <div className="question-header">
                                        <h5 style={{ marginTop: '20px' }}>{question.Title}</h5>
                                        <p className="level" style={{ color: question.Level === 1 ? 'green' : question.Level === 2 ? '#EF9819' : question.Level === 3 ? 'red' : 'black' }}>{levels[question.Level - 1]}</p>
                                    </div>
                                    <hr />
                                    <div className="question-description">
                                        <p>{question.Description}</p>
                                    </div>
                                    {question.TestCase && question.TestCase.slice(0, 2).map((test, index) => (
                                        <div key={index} className="test-case">
                                            <h6>Example Test Case {index + 1}:</h6>
                                            <div className="test-input">
                                                <p><strong>Input:</strong> {test.Input}
                                                    <FontAwesomeIcon
                                                        icon={faCopy}
                                                        className="ms-2"
                                                        style={{ cursor: 'pointer', marginBottom: '7px' }}
                                                        onClick={() => handleCopy(test.Input)}
                                                    />
                                                </p>
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
                                <div className="tab-pane fade" id="solution" role="tabpanel" aria-labelledby="solution-tab">
                                    <div className="card" style={{ width: '300px', marginTop: '20px' }}>
                                        {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/BCLfxQja9dI?si=NGClo1uPsvagM5dd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}
                                        {/* {question.Solution} */}
                                        <div dangerouslySetInnerHTML={{ __html: question.Solution }} />
                                    </div>
                                    {/* {question.Solution} */}
                                </div>
                                <div className="tab-pane fade" id="submission" role="tabpanel" aria-labelledby="submission-tab" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {
                                        submission.length==0? <p>No submission</p>:
                                        (submission && submission.slice().reverse().map((sub, index) => (
                                            <div className="card" style={{ display: 'inline-block', flex: 'no-wrap', width: '600px', marginTop: '20px' }} key={index}>
                                                <div className="card-body">
                                                    {/* <h5 style={{display:'inline-block'}} className="card-title">Status :</h5> */}
                                                    <p style={{ display: 'inline-block' }} className={`card-text me-3 ${sub.Status === 'Accepted' ? 'status-accepted' : sub.Status === 'Failed' ? 'status-failed' : ''}`}> {sub.Status}</p>
                                                    {/* <h5 style={{display:'inline-block'}} className="card-title"> Submitted At :</h5> */}
                                                    <p style={{
                                                        display: 'inline-block',
                                                        backgroundColor: '#dfdcdc',
                                                        paddingRight: '8px',
                                                        paddingLeft: '8px',
                                                        borderTopLeftRadius: '20px',
                                                        borderBottomLeftRadius: '20px',
                                                        borderTopRightRadius: '20px',
                                                        borderBottomRightRadius: '20px',
                                                    }} className="card-text me-3"> {sub.Language}</p>

                                                    <p style={{ display: 'inline-block' }} className="card-text"> {new Date(sub.SubmittedAt).toLocaleString()}</p>
                                                </div>
                                            </div>)
                                        ))
                                    }
                                </div>

                            </div>


                        </div>
                        <div className="col-md-6">
                            <div>
                                <div className="col-md-12">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <p className="me-2 mb-2">Languages:</p>
                                            <div className='col-md-5 mb-2'>
                                                <select className="form-select" aria-label="Default select example" onChange={(e) => setLanguage(e.target.value)}>
                                                    <option value="cpp">CPP</option>
                                                    <option value="java">JAVA</option>
                                                    <option value="python">Python</option>
                                                    <option value="js">JavaScript</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon
                                                icon={theme === 'light' ? faMoon : faSun}
                                                className="ms-2 text-primary"
                                                style={{ cursor: 'pointer' }}
                                                onClick={toggleTheme}
                                            />
                                            <FontAwesomeIcon
                                                icon={faCopy}
                                                className="ms-2 text-primary"
                                                style={{ cursor: 'pointer' }}
                                                onClick={handleCopyCode}
                                            />
                                            <FontAwesomeIcon
                                                icon={faSyncAlt}
                                                className="ms-2 text-primary"
                                                style={{ cursor: 'pointer' }}
                                                onClick={handleReset}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Editor
                                    height="50vh"
                                    theme={theme}
                                    defaultLanguage="cpp"
                                    value={code}
                                    onMount={handleEditorDidMount}
                                    onChange={(value) => setCode(value)}

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
                                    
                                    {Loading ? (
        <p>Loading....</p>
    ) : (
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
                                <button onClick={handleCodeRun} type="button" className="btn btn-primary">
                                    Run
                                </button>

                                <button onClick={handleCodeSubmit} style={{ marginLeft: '10px' }} type="button" className="btn btn-primary">
                                    Submit
                                </button>
                                {/* <pre>{output}</pre> */}

                            </div>
                            <div>
                                {/* {testcases.map((result, index) => (
                                <p key={index}>{result}</p>
                            ))} */}
                                {testcases.map((result, index) => (
                                    <div key={index} style={{ display: 'inline-block', marginRight: '10px', width: '200px' }} className={`card col-md-4 mb-1 mt-3 ${result.success ? 'border-success' : 'border-danger'}`}>
                                        <div className={`card-header ${result.success ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                            {`Test case ${result.testCaseNumber} ${result.success ? 'passed' : 'failed'}`}
                                        </div>
                                        {/* <div className="card-body">
                                    <h5 className="card-title">{`Input: ${result.input}`}</h5>
                                    {result.success ? (
                                        <p className="card-text">Output matched expected result.</p>
                                    ) : (
                                        <p className="card-text">
                                            {`Expected: ${result.expected}, Got: ${result.got}`}
                                        </p>
                                    )}
                                    {result.error && <p className="card-text">{`Error: ${result.error}`}</p>}
                                </div> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

export default Compiler;
