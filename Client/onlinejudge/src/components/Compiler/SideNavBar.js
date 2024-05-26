import React, { useEffect, useState } from 'react';

import './sidenavbar.css';
import UseAxiosPrivate from "../../Hooks/useAxiosPrivate";
import axiosUserPrivate from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const levelMap = {
    1: 'Low',
    2: 'Medium',
    3: 'High'
};

function SideNavBar() {

    const axiosPrivate = UseAxiosPrivate(axiosUserPrivate);
    const [questions, setQuestions] = useState([]);

    const navigate = useNavigate();
    const getAllQuestion = async () => {
        try {
            // setLoad(true);
            const response = await axiosPrivate.get('/getallquestion');
            console.log("All questios", response.data.questions);
            setQuestions(response.data.questions);

        }
        catch (error) {

            console.log("error", error);
        }
        // finally {
        //     // setLoad(false);
        // }
    }

    useEffect(() => {
        getAllQuestion();
    }, [])
    const gotoQuestion = async (id) => {
        navigate(`/question/${id}`);
    }

    return (
        <div>
            <nav className="navbar" style={{ top: '0px', marginLeft: '150px',width:'100px', marginTop: '-55px' }}>
                <div className="container-fluid" style={{width:'200px'}}>
                    {/* <a className="navbar-brand" href="#">Offcanvas navbar</a> */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Problem List</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            {/* <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Link</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Dropdown
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                    </ul>
                                </li>
                            </ul> */}
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                {questions && questions.map((que, index) => (
                                    <li className="nav-item d-flex justify-content-between align-items-center" key={que._id}>
                                        <span>
                                            {index + 1}.{' '}
                                            <a
                                                className="nav-link"
                                                style={{ cursor: 'pointer', display: 'inline-block', textDecoration: 'none' }}
                                                onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }}
                                                onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }}
                                                onClick={() => { gotoQuestion(que._id); }}
                                            >
                                                {que.Title}
                                            </a>
                                        </span>
                                        <span className={`tag1 ${levelMap[que.Level]}`}>{levelMap[que.Level]}</span>
                                    </li>
                                ))}
                            </ul>
                            {/* <form className="d-flex mt-3" role="search">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form> */}
                        </div>
                    </div>
                </div>
            </nav>
        </div>

    )
}

export default SideNavBar