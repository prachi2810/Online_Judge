import axios from "../../api/axios";
import { useState } from "react"

import UseAxiosPrivate from '../../Hooks/UseAxiosPrivate';
import { axiosUsePrivate } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const defaultQuestion = {
    "Title": "",
    "Description": "",
    "Level": "",
    "TestCase": [],
    "Constraints": "",
    "Topic": ""
}


function AddQuestion() {

    const [addQuestion, setAddQuestion] = useState(defaultQuestion);
    const [testcase, addTestcase] = useState(false);
    const levels = ['Low', 'Medium', 'High'];
    const topics = ['Basic Beginner', 'Array', 'Strings'];
    const [openModal, setOpenModal] = useState(false);
    const axiosPrivate = UseAxiosPrivate(axiosUsePrivate);

    const navigate = useNavigate();

    const notifyTestCaseAdd = () => toast.success("Tescase Added!");
    const notifyQuestionAdd = () => toast.success("Question Added!");

    const addquestion = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post('/addquestion', JSON.stringify(addQuestion),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
            console.log(response);
            if (response.status == 201) {
                notifyQuestionAdd();
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

    const handleAddTestcase = () => {
        const { Input, Output } = addQuestion;
        const newTestCase = { Input, Output };
        setAddQuestion(prevState => ({
            ...prevState,
            TestCase: [...prevState.TestCase, newTestCase]
        }));
        notifyTestCaseAdd();
        setOpenModal(false);
    };

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
                    <button type="button" class="btn-close" data-bs-dismiss="modal" onClick={()=>{setOpenModal(false)}}></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="Input" className="col-form-label">Input:</label>
                            <textarea type="text" className="form-control" id="Input" value={addQuestion.Input} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Output" className="col-form-label">Output:</label>
                            <textarea type="text" className="form-control" id="Output" value={addQuestion.Output} onChange={handleInputChange} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={()=>{setOpenModal(false)}}>Close</button>
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
                <form onSubmit={addquestion}>
                    <div className="container-fluid ">
                        <div className="row d-flex justify-content-center">
                            <div className="col-6">
                                <div className="mb-3">
                                    <label htmlFor="Title" className="form-label">Title:</label>
                                    <input className='form-control' id='Title' type="text" placeholder="Please Enter Title or Problem Statement Here..." name="Title" onChange={(e) => { setAddQuestion({ ...addQuestion, Title: e.target.value }) }} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Description" className="form-label">Description:</label>
                                    <textarea className='form-control' rows="10" name="Description" id="Description" placeholder="Please Enter Description Here..." onChange={(e) => { setAddQuestion({ ...addQuestion, Description: e.target.value }) }}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Constraints" className="form-label">Constraints:</label>
                                    <input className='form-control' placeholder="Please Enter Constraints Here..." id='Constraints' type="text" name="Constraints" onChange={(e) => { setAddQuestion({ ...addQuestion, Constraints: e.target.value }) }} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Level" className="form-label">Level:</label>
                                    <select className="form-select" onChange={(e) => { setAddQuestion({ ...addQuestion, Level: e.target.value }) }} placeholder="Level">
                                        <option value="">Level</option>
                                        {levels.map((level, index) => (
                                            <option key={index} value={index + 1}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Topic" className="form-label">Topic:</label>
                                    <select className="form-select" onChange={(e) => { setAddQuestion({ ...addQuestion, Topic: e.target.value }); }} placeholder="Topic">
                                        <option value="">Topic</option>
                                        {topics.map((topic, index) => (
                                            <option key={index} value={index + 1}>{topic}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    {/* <button type="button" className="btn btn-primary" onClick={addTestcase}>Add Testcase</button> */}
                                    <button type="button" class="btn btn-primary" onClick={() => { setOpenModal(true); }}>Add Testcase</button>

                                </div>
                                <div className="mb-3">
                                    <button type='submit' style={{ width: "300px", marginLeft: "200px" }} className='btn btn-primary d-flex justify-content-center'>Add</button>
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
