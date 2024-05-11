
import { useEffect, useState } from 'react';
import './Question.css';
import axiosUsePrivate from '../../api/axios';
import Cookies from 'js-cookie';
import { useAuth } from '../../Hooks/useAuth';
import axios from 'axios';
import UseAxiosPrivate from '../../Hooks/UseAxiosPrivate';
import { useNavigate } from 'react-router-dom';

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
    const axiosPrivate = UseAxiosPrivate(axiosUsePrivate);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateId, setUpdateId] = useState('');
    const [updateQuestion, setUpdateQuestion] = useState(defaultQuestion)
    const levels = ['Low', 'Medium', 'High'];
    const topics = ['Basic Beginner', 'Array', 'Strings'];


    const navigate = useNavigate();

    const getAllQuestion = async () => {
        // const token=Cookies.get('token');
        // console.log("token",token);
        try {
            const response = await axiosPrivate.get('/getallquestion');
            // console.log(response.data.questions);
            setQuestions(response.data.questions);

        }
        catch (error) {
            // if(error.response.data='Token not found'){

            // }
            console.log(error);
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
        e.preventDefault();
        try {
            const { _id,__v, ...updatedQuestion } = updateQuestion;
            console.log("dd");
            console.log("up",updateQuestion);
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
        }
        catch (error) {

        }
    }

    const deleteQuestion = async (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            try {
                const response = await axiosPrivate.delete(`/deletequestion/${id}`, JSON.stringify(defaultQuestion),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    })
                getAllQuestion();
            }
            catch (error) {

            }
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

    }, [questions, updateId])

    useEffect(() => {
        if (updateId) {
            getQuestion(); // Call getQuestion when updateId changes
        }
    }, [updateId]);

    return (
        <>
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
                                        <form onSubmit={updateQuestions}>
                                            <div class="mb-3">
                                                <input type="text" className="form-control" value={updateQuestion?.Title || ''} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Title: e.target.value }) }} placeholder='Title' id="Title" />
                                            </div>
                                            <div class="mb-3">

                                                <textarea className="form-control" placeholder='Description' value={updateQuestion?.Description || ''} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Description: e.target.value }) }} id="Description"></textarea>

                                            </div>
                                            <div className="mb-3">
                                                <select className="form-select" value={updateQuestion.Level} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Level: e.target.value }) }} placeholder="Level">
                                                    <option value="">Level</option>

                                                    {levels.map((level, index) => (
                                                        <option key={index} value={index + 1}   >{level}</option>
                                                    ))}


                                                </select>
                                            </div>

                                            <div className='mb-3'>
                                                <select className="form-select" value={updateQuestion.Topic} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Topic: e.target.value }); console.log(updateQuestion.TestCase); }} placeholder="Topic">
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
                                            </div>
                                            <div className='mb-3'>
                                                <input type="text" className="form-control" placeholder='Constraints' value={updateQuestion.Constraints} onChange={(e) => { setUpdateQuestion({ ...updateQuestion, Constraints: e.target.value }) }} id="Constraints" />
                                            </div>
                                            <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={()=>{setModalOpen(false)}}>Close</button>
                                            <button type="button" className="btn btn-primary">Update</button>
                                            </div>
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
            <div>
                <div className='allfilters'>
                    <select className="filter-select" id="topicFilter" placeholder="Topic">
                        <option value="">Topic</option>
                        {
                            topics.map((topic, index) =>
                            (<option key={index} value={index + 1}>{topic}</option>

                            ))
                        }
                    </select>

                    <select className="filter-select" id="levelFilter" placeholder="Level">
                        <option value="">Level</option>

                        {levels.map((level, index) => (
                            <option key={index} value={index + 1}>{level}</option>
                        ))}


                    </select>
                    <input class="form-control me-4" type="search" placeholder="Search" aria-label="Search" />
                    {/* <button class="btn btn-outline-success" type="submit">Search</button> */}
                    <button type="button" className='btn btn-primary' onClick={()=>{navigate('/addquestion')}}>Add</button>

                </div>

                <div className='tbl'>
                    <div className='container-fluid'>
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
                                        <th scope="row" style={{cursor:"pointer",textDecoration: "none"}} onMouseEnter={(e)=>{e.target.style.textDecoration = "underline"}} onMouseLeave={(e) => { e.target.style.textDecoration = "none" }} onClick={() => { gotoQuestion(ques._id) }}>{ques.Title}</th>
                                        <td>{TopicMap[ques.Topic]}</td>
                                        <td>{levelMap[ques.Level]}</td>
                                        <td>
                                            {/* <button className='btn btn-primary' onClick={() => { setModalOpen(true); setUpdateId(ques._id); console.log("ff",updateId);getQuestion(); }}>edit</button> */}
                                            <button className='btn btn-primary' onClick={() => {
                                                setUpdateId(ques._id); // Wait for the question data to be fetched
                                                setModalOpen(true); // Open the modal
                                                console.log("ff", updateId);

                                            }}>edit</button>
                                            <button className='btn btn-primary' style={{marginLeft:"30px"}} onClick={() => { deleteQuestion(ques._id) }}>delete</button>
                                            {/* <button></button> */}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )



}

export default Question;