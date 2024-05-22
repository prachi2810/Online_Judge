
import { useEffect, useState } from 'react';
import './Question.css';
import axiosUserPrivate from '../../api/axios';
import useAuth from '../../Hooks/useData';
import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';


const levelMap = {
    1: 'Low',
    2: 'Medium',
    3: 'High'
};

const TopicMap = {
    1: 'Basic Beginner',
    2: 'Array',
    3: 'Strings'
};

const defaultQuestion = {
    "Title": "",
    "Description": "",
    "Level": "",
    "TestCase": [
        { "Input": "", "Output": "" }
    ],
    "Constraints": "",
    "Topic": ""
}

function Question() {
    const { token } = useAuth();
    const [questions, setQuestions] = useState([]);
    const axiosPrivate = useAxiosPrivate(axiosUserPrivate);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [updateQuestion, setUpdateQuestion] = useState(defaultQuestion);
    const [deleteQue, setDeleteQue] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [search, setSearch] = useState('');
    const [filterTopic, setFilterTopic] = useState(0);
    const [filterLevel, setFilterLevel] = useState(0);
    const [load, setLoad] = useState(false);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const levels = ['Low', 'Medium', 'High'];
    const topics = ['Basic Beginner', 'Array', 'Strings'];


    const navigate = useNavigate();
    const notifyUpdateQue = () => toast.success("Question Updated!");

    const getAllQuestion = async () => {
        try {
            setLoad(true);
            const response = await axiosPrivate.get('/getallquestion');
            setQuestions(response.data.questions);

        }
        catch (error) {

            console.log("error", error);
        }
        finally {
            setLoad(false);
        }
    }

    const getQuestion = async () => {
        try {
            const response = await axiosPrivate.get(`/getquestion/${updateId}`);
            console.log(response.data.question);
            setUpdateQuestion(response.data.question);
        }
        catch (error) {

        }
    }

    const updateQuestions = async (e) => {
        // e.preventDefault();
        try {
            const { _id, __v, ...updatedQuestion } = updateQuestion;
            console.log("dd");
            console.log("up", updateQuestion);
            // Remove _id field from each object inside TestCase array
            const updatedTestCases = updatedQuestion.TestCase.map(testCase => {
                const { _id, ...updatedTestCase } = testCase;
                return updatedTestCase;
            });

            // Update updatedQuestion with the modified TestCase array
            const questionWithUpdatedTestCases = {
                ...updatedQuestion,
                TestCase: updatedTestCases
            };
            console.log(questionWithUpdatedTestCases);
            const response = await axiosPrivate.put(`/updatequestion/${updateId}`, JSON.stringify(questionWithUpdatedTestCases),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
            console.log(response);
            if (response.status == 201) {
                setModalOpen(false);
                getAllQuestion();
            }
        }
        catch (error) {

        }
    }

    const deleteQuestion = async (id) => {

        try {
            const response = await axiosPrivate.delete(`/deletequestion/${id}`, JSON.stringify(defaultQuestion),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
            getAllQuestion();
            setDeleteQue(false);
        }
        catch (error) {

        }


    }

    // const getQuestion=async()=>{
    //     try{
    //         const response=await axiosPrivate.get(`/getquestion/${id}`);

    //     }
    //     catch(error){

    //     }

    // }

    const gotoQuestion = async (id) => {
        navigate(`/question/${id}`);
    }


    useEffect(() => {

        getAllQuestion();

    }, [updateId])

    useEffect(() => {
        if (search === '') {
            getAllQuestion();
        } else {
            const filteredQuestions = questions.filter((ques) => {
                return ques.Title.toLowerCase().includes(search.toLowerCase());
            });
            setQuestions(filteredQuestions);
        }
    }, [search]);

    useEffect(() => {
        console.log(filterTopic);
        if (filterTopic == 0) {
            getAllQuestion();
        } else {
            const filteredQuestions = questions.filter((ques) => {
                return ques.Topic == filterTopic;
            });
            setQuestions(filteredQuestions);
        }
    }, [filterTopic]);

    useEffect(() => {

        if (filterLevel == 0) {
            getAllQuestion();
        } else {
            const filteredQuestions = questions.filter((ques) => {
                return ques.Level == filterLevel;
            });
            setQuestions(filteredQuestions);
        }
    }, [filterLevel]);

    useEffect(() => {
        if (updateId) {
            getQuestion(); // Call getQuestion when updateId changes
        }
    }, [updateId]);

    const confirmDelete = (id) => {
        setDeleteQue(true);
        setDeleteId(id);
    
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = {};
        let hasErrors = false;
         
        //  console.log("ee",updateQuestion.Title=='');
        // Title validation
        if (!updateQuestion.Title ||updateQuestion.Title.trim() === '') {
            validationErrors.Title = 'Title is required';
            hasErrors = true;
        }

        // Description validation
        if (updateQuestion.Description.trim() ==='') {
            validationErrors.Description = 'Description is required';
            hasErrors = true;
        }

        // Level validation
        if (updateQuestion.Level == 0) {
            validationErrors.Level = 'Level is required';
            hasErrors = true;
        }

        // Topic validation
        if (updateQuestion.Topic == 0) {
            validationErrors.Topic = 'Topic is required';
            hasErrors = true;
        }

        // TestCase validation
        

        // Constraints validation
        if (updateQuestion.Constraints.trim() === '') {
            validationErrors.Constraints = 'Constraints is required';
            hasErrors = true;
        }

        setErrors(validationErrors);
        
        if (hasErrors) {
            setFormError('Please fill out all required fields');
            return;
        }
        if(hasErrors==false){
        updateQuestions();
        return;
        }

        // Proceed with form submission
        // Your logic here
    };
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUpdateQuestion(prevState => ({
            ...prevState,
            [id]: value
        }));
    };
    const handleAddTestcase = (e) => {
        e.preventDefault();
        const validationErrors = {};
        let hasErrors = false;
        console.log("modal",updateQuestion.TestCase);
        if (updateQuestion.TestCase.some(testCase => testCase.Input.trim() == '' || testCase.Output.trim() == '')) {
            validationErrors.TestCase = 'All test cases must have both Input and Output values';
            hasErrors = true;
        }
        if(hasErrors==false){
        const { Input, Output } = updateQuestion;
        const newTestCase = { Input, Output };
        setUpdateQuestion(prevState => ({
            ...prevState,
            TestCase: [...prevState.TestCase, newTestCase]
        }));
        setModalOpen2(false);
    }
    };

    return (
        <>
            {load && (
                <div class="d-flex justify-content-center flex-column align-items-center" style={{ height: '100vh' }}>
                    <div class="" role="status">
                        <span class="visually-hidden">Loading...</span>
                        <span class="loader"></span>
                    </div>
                </div>
            )
            }
            {
                deleteQue && (

                    <div className="modal" style={{ display: deleteQue ? 'block' : 'none' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => { setDeleteQue(false); }}></button>
                                </div>
                                <div className="modal-body">
                                    Are you sure you want to delete this question?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setDeleteQue(false); }}>Cancel</button>
                                    <button type="button" className="btn btn-danger" onClick={() => { deleteQuestion(deleteId); }}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                modalOpen2 && (
                    <div>
                        <div class="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Testcase</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" onClick={() => { setModalOpen2(false) }}></button>
                                    </div>
                                    <div class="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label htmlFor="Input" className="col-form-label">Input:</label>
                                                <textarea type="text" className={`form-control ${errors.TestCase && 'is-invalid'}`} id="Input" value={updateQuestion.Input} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="Output" className="col-form-label">Output:</label>
                                                <textarea type="text" className={`form-control ${errors.TestCase && 'is-invalid'}`} id="Output" value={updateQuestion.Output} onChange={handleInputChange} />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => { setModalOpen2(false) }}>Close</button>
                                                <button type="button" className="btn btn-primary" onClick={handleAddTestcase}>Add Testcase</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                modalOpen && (
                    <>
                        {/* <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Open modal for @mdo</button> */}

                        <div class="modal" style={{ display: modalOpen ? 'block' : 'none' }}>
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update Question</h1>
                                        <button type="button" className="btn-close" onClick={() => { setModalOpen(false) }}></button>
                                    </div>
                                    <div class="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div class="mb-3">
                                                <input type="text" className={`form-control ${errors.Title ? 'is-invalid' : ''}`} value={updateQuestion?.Title || ''} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Title: e.target.value }) }} placeholder='Title' id="Title" />
                                            </div>
                                            <div class="mb-3">

                                                <textarea className={`form-control ${errors.Description ? 'is-invalid' : ''}`}placeholder='Description' value={updateQuestion?.Description || ''} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Description: e.target.value }) }} id="Description"></textarea>

                                            </div>
                                            <div className="mb-3">
                                                <select className={`form-control ${errors.Level ? 'is-invalid' : ''}`} value={updateQuestion.Level} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Level: e.target.value }) }} placeholder="Level">
                                                    <option value="">Level</option>

                                                    {levels.map((level, index) => (
                                                        <option key={index} value={index + 1}   >{level}</option>
                                                    ))}


                                                </select>
                                            </div>

                                            <div className='mb-3'>
                                                <select className={`form-control ${errors.Topic ? 'is-invalid' : ''}`} value={updateQuestion.Topic} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Topic: e.target.value }); console.log(updateQuestion.TestCase); }} placeholder="Topic">
                                                    <option value="">Topic</option>
                                                    {
                                                        topics.map((topic, index) =>
                                                        (<option key={index} value={index + 1}>{topic}</option>

                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className='mb-3'>
                                                {

                                                    updateQuestion.TestCase.map((testcase, index) => (
                                                        <div key={index} className='mb-3'>
                                                            <input
                                                                type='text'
                                                                className='form-control'
                                                                value={testcase.Input}
                                                                onChange={(e) => {
                                                                    const newTestCases = [...updateQuestion.TestCase];
                                                                    newTestCases[index] = {
                                                                        ...newTestCases[index],
                                                                        Input: e.target.value
                                                                    };
                                                                    setUpdateQuestion(prevState => ({
                                                                        ...prevState,
                                                                        TestCase: newTestCases
                                                                    }));
                                                                }}
                                                                placeholder='Input'
                                                            // id='Input'
                                                            />
                                                            <br />
                                                            <input
                                                                type='text'
                                                                className='form-control'
                                                                value={testcase.Output}
                                                                onChange={(e) => {
                                                                    const newTestCases = [...updateQuestion.TestCase];
                                                                    newTestCases[index] = {
                                                                        ...newTestCases[index],
                                                                        Output: e.target.value
                                                                    };
                                                                    setUpdateQuestion(prevState => ({
                                                                        ...prevState,
                                                                        TestCase: newTestCases
                                                                    }));
                                                                }}
                                                                placeholder='Output'
                                                            // id='Input'
                                                            />

                                                        </div>
                                                    ))
                                                }
                                                <button className='btn btn-primary' onClick={()=>{setModalOpen2(true); setModalOpen(true)}}>Add</button>
                                            </div>
                                            <div className='mb-3'>
                                                <textarea type="text" className="form-control" placeholder='Constraints' value={updateQuestion.Constraints} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Constraints: e.target.value }) }} id="Constraints" />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => { setModalOpen(false) }}>Close</button>
                                                <button type="submit" className="btn btn-primary">Update</button>
                                            </div>
                                            <ToastContainer />
                                            {/* <div class="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => { setModalOpen(false) }}>Close</button>
                                               
                                            </div> */}
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                )
            }


            <div>
            </div>
            <div className='tbl'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-2'>
                            <select className="form-select" id="topicFilter" placeholder="Topic" onChange={(e) => { setFilterTopic(e.target.value) }}>
                                <option value="">Topic</option>
                                {topics.map((topic, index) => (
                                    <option key={index} value={index + 1}>{topic}</option>
                                ))}
                            </select>
                        </div>
                        <div className='col-md-2'>
                            <select className="form-select" id="levelFilter" placeholder="Level" onChange={(e) => { setFilterLevel(e.target.value) }}>
                                <option value={0}>Level</option>
                                {levels.map((level, index) => (
                                    <option key={index} value={index + 1}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div className='col-md-7'>
                            <input className="form-control" type="search" onChange={(e) => { setSearch(e.target.value) }} placeholder="Search" aria-label="Search" />
                        </div>
                        <div className='col-md-1'>
                            <button type="button" className='btn btn-primary' onClick={() => { navigate('/addquestion') }}>Add</button>
                        </div>
                    
                {/* </div>   */}


               <div className='table-responsive mt-3 col-md-12'>
                
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Topic</th>
                            <th scope="col">Level</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions && questions.map((ques, index) => (
                            <tr key={index} className='rows'>
                                <th scope="row" style={{ cursor: "pointer", textDecoration: "none" }} onMouseEnter={(e) => { e.target.style.textDecoration = "underline" }} onMouseLeave={(e) => { e.target.style.textDecoration = "none" }} onClick={() => { gotoQuestion(ques._id) }}>{ques.Title}</th>
                                <td>{TopicMap[ques.Topic]}</td>
                                <td><span className={`tag ${levelMap[ques.Level]}`}>{levelMap[ques.Level]}</span></td>
                                <td>
                                    <button className='btn btn-primary me-2' data-bs-toggle="tooltip" data-bs-placement="top"
                                        data-bs-custom-class="custom-tooltip"
                                        data-bs-title="This top tooltip is themed via CSS variables."
                                        onClick={() => {
                                            setUpdateId(ques._id); 
                                            setModalOpen(true); 
                                            console.log("ff", updateId);

                                        }}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                    <button className='btn btn-primary' onClick={() => { confirmDelete(ques._id) }} data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Question">
                                        <FontAwesomeIcon icon={faTrash} />

                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                </div>
                </div>
            </div>
        </div >
        </>
    )



}

export default Question;