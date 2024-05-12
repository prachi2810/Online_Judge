import { useParams } from "react-router-dom";
import axiosUsePrivate from '../../api/axios';
import UseAxiosPrivate from "../../Hooks/UseAxiosPrivate";
import { useEffect, useState } from "react";
import './Compiler.css';


function Compiler() {
    const [question, setQuestion] = useState({});
    const axiosPrivate = UseAxiosPrivate(axiosUsePrivate);
    const levels = ['Low', 'Medium', 'High'];
    const id = useParams();
    const getQuestion = async () => {
        try {
            const response = await axiosPrivate.get(`/getquestion/${id.id}`);
            // console.log(response.data.question);
            setQuestion(response.data.question);
        }
        catch (error) {

        }
    }
    
    useEffect(() => {
        getQuestion();
    }, [question])

    return (
        <>
            {/* <div className="container-fluid">
                <div className="row">
                    {question &&
                        <div className="col-md-6">
                            <div className="mb-3">
                                <p>{question.Title}</p>
                            </div>
                            <div className="mb-3">
                                <p>{levels[question.Level]}</p>
                            </div>
                            <hr />
                            <div className="mb-3">
                                <p>{question.Description}</p>
                            </div>
                            {question.TestCase && question.TestCase.map((test, index) => (
                                <div key={index}>
                                    <p>Example Test Case {index + 1}</p>
                                    <div className="mb-3">
                                        <p>Input: {test.Input}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p>Output: {test.Output}</p>
                                    </div>
                                    <hr/>
                                </div>
                            ))}
                            <div className="mb-3">
                                <p>Constraints:</p>
                                <p>{question.Constraints}</p>
                            </div>
                        </div>

                    }

                </div>

            </div> */}
             <div className="question-container">
            {question &&
                <div className="row">
                    <div className="col-md-6">
                        <div className="question-header">
                            <h5>{question.Title}</h5>
                            <p className="level" style={{ color: question.Level === 1 ? 'green' : question.Level === 2 ? '#EF9819' : question.Level === 3 ? 'red' : 'black' }}>{levels[question.Level-1]}</p>

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
                </div>
            }
        </div>
        </>
    )

}

export default Compiler;