
import './Login.css';

import { useState } from 'react';

const Login = () => {

    const [toggle, setToggle] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    console.log(toggle);
    return (
        <>
            <div className='background'>
                <div className="container">
                    {!toggle && (
                        <div className="box">
                            <div className='boxelement'>
                                <label id='fieldsname' for="Email">Email</label>
                                <br />
                                <input id='fields' type="email" name="Email" />
                                <br />
                            </div>
                            <div className='boxelement'>
                                <label id='fieldsname' for="Password">Password</label>
                                <br />
                                <input id='fields' type={passwordVisible ? "text" : "password"} name="Password" />
                                <button className="toggle-password" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? (
                                        'Hide'
                                        // <i className="fas fa-eye-slash"></i>
                                    ) : (
                                        'Show'
                                        // <i className="fas fa-eye"></i>
                                    )}
                                </button>
                                {/* <p>Forgot Password</p> */}
                            </div>
                            <div className='submit'>
                                <button className='signinbutton'>Sign In</button>
                            </div>
                            <p className='pname' > Don't have an account? <button className='togglebtn' onClick={() => { setToggle(true) }} >Sign Up</button> </p>
                        </div>
                    )}
                    {toggle && (
                        <div className="box">
                            <div className='boxelement'>
                                <label id='fieldsname' for="Firstname">Firstname</label>
                                <br />
                                <input id='fields' type="text" name="Firstname" />
                                <br />
                            </div>
                            <div className='boxelement'>
                                <label id='fieldsname' for="Email">Email</label>
                                <br />
                                <input id='fields' type="email" name="Email" />
                                <br />
                            </div>
                            <div className='boxelement'>
                                <label id='fieldsname' for="Password">Password</label>
                                <br />
                                <input id='fields' type={passwordVisible ? "text" : "password"} name="Password" />
                                <button className="toggle-password" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? (
                                        'Hide'
                                        // <i className="fas fa-eye-slash"></i>
                                    ) : (
                                        'Show'
                                        // <i className="fas fa-eye"></i>
                                    )}
                                </button>
                                {/* <p>Forgot Password</p> */}
                            </div>
                            <div className='boxelement'>
                                <label id='fieldsname' for="dob">Date of Birth</label>
                                <br />
                                <input id='fields' type="date" name="dob" />
                                <br />
                            </div>
                            <div className='submit'>
                                <button className='signinbutton'>Sign Up</button>
                            </div>
                            <p className='pname'>Already have an account? <button className='togglebtn' onClick={() => { setToggle(false) }} >Sign In</button> </p>
                        </div>
                    )}



                </div>
            </div>
        </>
    )

}

export default Login; 