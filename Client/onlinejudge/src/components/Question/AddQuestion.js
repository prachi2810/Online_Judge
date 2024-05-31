import axios from "../../api/axios";
import { useState } from "react"

import useAxiosPrivate from '../../Hooks/useAxiosPrivate';
import { axiosUserPrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultQuestion = {
    "Title": "",
    "Description": "",
    "Level": "",
    "TestCase": [],
    "Constraints": "",
    "Topic": "",
    "Solution":""
}


function AddQuestion() {

    const [addQuestion, setAddQuestion] = useState(defaultQuestion);
    const [testcase, addTestcase] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [descError, setDescError] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const levels = ['Low', 'Medium', 'High'];
    const topics = ['Basic Beginner', 'Array', 'Strings'];

    const [openModal, setOpenModal] = useState(false);
    const axiosPrivate = useAxiosPrivate(axiosUserPrivate);

    const navigate = useNavigate();


    const addquestion = async (e) => {
        // e.preventDefault();
        try {
            const response = await axiosPrivate.post('/addquestion', JSON.stringify(addQuestion),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            console.log(response);
            if (response.status == 201) {
                toast.success("Question Added successfully!");
                navigate('/allquestions');
            }
        }
        catch (error) {

        }
    }
    console.log(openModal);
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setAddQuestion(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleAddTestcase = (e) => {
        e.preventDefault();
        const validationErrors = {};
        let hasErrors = false;
        console.log("modal",addQuestion.TestCase);
        if (addQuestion.TestCase.some(testCase => testCase.Input.trim() == '' || testCase.Output.trim() == '')) {
            validationErrors.TestCase = 'All test cases must have both Input and Output values';
            hasErrors = true;
        }
        if(hasErrors==false){
        const { Input, Output } = addQuestion;
        const newTestCase = { Input, Output };
        setAddQuestion(prevState => ({
            ...prevState,
            TestCase: [...prevState.TestCase, newTestCase],
            Input: '', // Reset Input
            Output: ''
        }));
        toast.success("Test case added successfully!");
        setOpenModal(false);
    }
    };
    const handleTitleChange = (e) => {
        const title = e.target.value;
        setAddQuestion({ ...addQuestion, Title: title });
        if (title.length < 2) {
            setTitleError('Title must be at least 2 characters long');
        } else {
            setTitleError('');
        }
    };
    const handleDescChange = (e) => {
        const desc = e.target.value;
        setAddQuestion({ ...addQuestion, Description: desc });
        if (desc.length < 10) {
            setDescError('Description must be at least 10 characters long');
        } else {
            setDescError('');
        }
    };
    const handleSubmitAddQuestion = (e) => {
        e.preventDefault();
        const validationErrors = {};
        let hasErrors = false;
         
        //  console.log("ee",addQuestion.Title=='');
        // Title validation
        if (!addQuestion.Title ||addQuestion.Title.trim() === '') {
            validationErrors.Title = 'Title is required';
            hasErrors = true;
        }

        // Description validation
        if (addQuestion.Description.trim() ==='') {
            validationErrors.Description = 'Description is required';
            hasErrors = true;
        }

        // Level validation
        if (addQuestion.Level == 0) {
            validationErrors.Level = 'Level is required';
            hasErrors = true;
        }

        // Topic validation
        if (addQuestion.Topic == 0) {
            validationErrors.Topic = 'Topic is required';
            hasErrors = true;
        }

        // TestCase validation
        

        // Constraints validation
        if (addQuestion.Constraints.trim() === '') {
            validationErrors.Constraints = 'Constraints is required';
            hasErrors = true;
        }

        setErrors(validationErrors);
        
        if (hasErrors) {
            setFormError('Please fill out all required fields');
            return;
        }
        if(hasErrors==false){
        addquestion();
        return;
        }

        // Proceed with form submission
        // Your logic here
    };
    console.log("test",errors.TestCase);


    return (
        <>
            <div>
                {
                    openModal && (
                        <div class="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Testcase</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" onClick={() => { setOpenModal(false) }}></button>
                                    </div>
                                    <div class="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label htmlFor="Input" className="col-form-label">Input:</label>
                                                <textarea type="text" className={`form-control ${errors.TestCase && 'is-invalid'}`} id="Input" value={addQuestion.Input} onChange={handleInputChange} />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="Output" className="col-form-label">Output:</label>
                                                <textarea type="text" className={`form-control ${errors.TestCase && 'is-invalid'}`} id="Output" value={addQuestion.Output} onChange={handleInputChange} />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" onClick={() => { setOpenModal(false) }}>Close</button>
                                                <button type="button" className="btn btn-primary" onClick={handleAddTestcase}>Add Testcase</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


            </div>
            <div>
                <h3 className="heading d-flex justify-content-center" style={{ marginLeft: "20px", marginTop: "30px" }}>Add Question</h3>
            </div>
            <div>
                
                <form onSubmit={handleSubmitAddQuestion}>
                    
                    <div className="container-fluid ">
                        <div className="row d-flex justify-content-center">
                            
                            <div className="col-sm-6">
                            {formError && <div className="alert alert-danger">{formError}</div>}

                                <div className="mb-3">
                                    <label htmlFor="Title" className="form-label">Title:<span style={{ color: 'red' }}>*</span></label>
                                    <input className={`form-control ${titleError || errors.Title ? 'is-invalid' : ''}`} id='Title' type="text" placeholder="Please Enter Title or Problem Statement Here..." name="Title" onChange={handleTitleChange} />
                                    {/* {errors.Title && <div className="invalid-feedback">{errors.Title}</div>} */}
                                    {titleError && <div className="invalid-feedback">{titleError}</div>}
                                    {/* {console.log("tt",errors.Title)} */}
                                    {/* {errors.Title &&<div className="alert">{errors.Title} </div>} */}
                                    
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Description" className="form-label">Description:<span style={{ color: 'red' }}>*</span></label>
                                    <textarea className={`form-control ${descError || errors.Description && 'is-invalid'}`} rows="10" name="Description" id="Description" placeholder="Please Enter Description Here..." onChange={handleDescChange}></textarea>
                                    {descError && <div className="invalid-feedback">{descError}</div>}
                                    {/* {errors.Description && <div className="invalid-feedback">{errors.Description}</div>} */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Constraints" className="form-label">Constraints:<span style={{ color: 'red' }}>*</span></label>
                                    <textarea className={`form-control ${errors.Constraints && 'is-invalid'}`} rows="4" placeholder="Please Enter Constraints Here..." id='Constraints' type="text" name="Constraints" onChange={(e) => { setAddQuestion({ ...addQuestion, Constraints: e.target.value }) }} />
                                    {/* {errors.Constraints && <div className="invalid-feedback">{errors.Constraints}</div>} */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Level" className="form-label">Level:<span style={{ color: 'red' }}>*</span></label>
                                    <select className={`form-select ${errors.Level && 'is-invalid'}`} onChange={(e) => { setAddQuestion({ ...addQuestion, Level: e.target.value }) }} placeholder="Level">
                                        <option value="">Level</option>
                                        {levels.map((level, index) => (
                                            <option key={index} value={index + 1}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Topic" className="form-label">Topic:<span style={{ color: 'red' }}>*</span></label>
                                    <select className={`form-select ${errors.Topic && 'is-invalid'}`} onChange={(e) => { setAddQuestion({ ...addQuestion, Topic: e.target.value }); }} placeholder="Topic">
                                        <option value="">Topic</option>
                                        {topics.map((topic, index) => (
                                            <option key={index} value={index + 1}>{topic}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                        <label for="Solution" className="form-label">Solution:</label>
                                        <input className="form-control" onChange={(e) => { setAddQuestion({ ...addQuestion, Solution: e.target.value }); }} placeholder="Please add Iframe link of solution"/>
                                </div>
                                <div className="mb-3">
                                    {/* <button type="button" className="btn btn-primary" onClick={addTestcase}>Add Testcase</button> */}
                                    <button type="button" class="btn btn-primary" onClick={() => { setOpenModal(true); }}>Add Testcase</button>

                                </div>
                                <div className="mb-3" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>

                                    <button type='submit' style={{ width: "300px" }} className='btn btn-primary d-flex justify-content-center'>Add</button>
                                </div>
                            </div>

                        </div>
                    </div>

                </form>
            </div>
        </>
    )

}

export default AddQuestion;
