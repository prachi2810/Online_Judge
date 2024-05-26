
import './Login.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useData from '../../Hooks/useData';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultRegister = {
    fullname: '',
    email: '',
    password: '',
    dob: Date
}

const defaultLogin = {

    email: '',
    password: '',

}

const Login = () => {

    const { token, setToken } = useData();

    const [toggle, setToggle] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [register, setRegister] = useState(defaultRegister);
    const [login, setLogin] = useState(defaultLogin);
    const [error, setError] = useState('');
    const [loggedIn, setloggedIn] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(defaultLogin);
    // const [refreshToken,setRefreshToken]=useState('');
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const navigate = useNavigate();
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/register',
                JSON.stringify(register),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response);
            toast.success("Registered successfully!");
            setError('');
        }
        catch (error) {
            console.error(error);
            // If there's an error response from the server, set the error state
            setError(error.response.data.error);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login',
                JSON.stringify(login),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response);
            const token = response?.data?.token;
            console.log("loginacc", token);
            setToken({ token });
            navigate('/allquestions');
            setError('');
            console.log("err",response);
            toast.success("Login successfully!");

        }
        catch (error) {
            console.error("error",error);
            // toast.error("Error while logged in!");
            setError(error.response.data.error);
        }
    }

        const handleForgotPassword=async(e)=>{
            e.preventDefault();
            try{
                const response=await axios.put('/forgot-password',
                JSON.stringify(forgotPassword),
                {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
                });
                console.log(response);
                if(response.status===201){
                    window.location.reload();
                navigate('/');
                }
            }
            catch(error){
                console.log("error",error);
                setError(error.response.data.error);
            }
        }

    // const refreshTokena=async()=>{
    //     try{
    //         const response=await axios.post('/refresh-token',{RefreshToken:refreshToken},
    //         {
    //             headers: { 'Content-Type': 'application/json' },
    //         withCredentials: true
    //         });
    //         if(response.status==200){
    //            await Cookies.set('token','');
    //            await Cookies.set('refreshtoken',response.data.refreshtoken)
    //         }
    //         console.log(response);
    //     }
    //     catch(error){
    //         console.error('Error refreshing token:', error);
    //     }
    // }

    // useEffect(()=>{
    //     // refreshTokena();
    //     const intervalId = setInterval(refreshTokena(), 30000); // Call every 30 seconds
    //     return () => clearInterval(intervalId); // Cleanup on component unmount
    // },[])






    return (
        <>
            <div className='background'>
                <div className="containerclass">
                    {
                        forgotPass && (
                            <div className='box'>
                                {error && <div className="error" style={{ color: 'red' }}>{error.replace(/"/g, '')}</div>}
                                <form onSubmit={handleForgotPassword}>
                                    <div className='boxelement'>
                                        <label id='fieldsname' for="email">Email</label>
                                        <br />
                                        <input className='fields' id='email' type="email" name="email" onChange={(e) => { setForgotPassword({ ...forgotPassword, email: e.target.value }) }} />
                                        <br />
                                    </div>
                                    <div className='boxelement'>
                                        <label id='fieldsname' for="password">Password</label>
                                        <br />
                                        <input className='fields' id='password' type={passwordVisible ? "text" : "password"} name="password" onChange={(e) => { setForgotPassword({ ...forgotPassword, password: e.target.value }) }} />
                                        <button type='button' className="toggle-password" onClick={togglePasswordVisibility}>
                                            {passwordVisible ? (
                                                <FontAwesomeIcon icon={faEye} />
                                            ) : (
                                                <FontAwesomeIcon icon={faEyeSlash} />
                                            )}
                                        </button>
                                    </div>
                                    <div className='submit'>
                                        <button type='submit' className='signinbutton'>Reset Password</button>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                    {!toggle && !forgotPass && (
                        <div className="box">
                            {error && <div className="error" style={{ color: 'red' }}>{error.replace(/"/g, '')}</div>}
                            <br />
                            <form onSubmit={handleLogin}>
                                <div className='boxelement'>
                                    <label id='fieldsname' for="email">Email</label>
                                    <br />
                                    <input className='fields' id='email' type="email" name="email" onChange={(e) => { setLogin({ ...login, email: e.target.value }) }} />
                                    <br />
                                </div>
                                <div className='boxelement'>
                                    <label id='fieldsname' for="password">Password</label>
                                    <br />
                                    <input className='fields' id='password' type={passwordVisible ? "text" : "password"} name="password" onChange={(e) => { setLogin({ ...login, password: e.target.value }) }} />
                                    <button type='button' className="toggle-password" onClick={togglePasswordVisibility}>
                                        {passwordVisible ? (
                                            <FontAwesomeIcon icon={faEye} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        )}
                                    </button>
                                    <p style={{ marginLeft: '190px',marginBottom:'-15px',fontSize:'14px',cursor:'pointer' }} onMouseEnter={(e)=>{e.target.style.textDecoration='underline'}} onMouseOut={(e)=>{e.target.style.textDecoration='none'}} onClick={() => { setForgotPass(true) }}>Forgot Password</p>
                                </div>
                                <div className='submit'>
                                    <button type='submit' className='signinbutton'>Sign In</button>
                                </div>
                            </form>
                            <p className='pname' > Don't have an account? <button className='togglebtn' onClick={() => { setToggle(true) }} >Sign Up</button> </p>
                        </div>
                    )}
                    {toggle && !forgotPass && (
                        <div className="box">
                            {error && <div className="error" style={{ color: 'red' }}>{error.replace(/"/g, '')}</div>}
                            {/* {error && <div className="error">{error}</div>} */}
                            <form onSubmit={handleRegister}>
                                <div className='boxelement'>
                                    <label id='fieldsname' for="fullname">Full Name</label>
                                    <br />
                                    <input id='fullname' className='fields' type="text" name="fullname" onChange={(e) => { setRegister({ ...register, fullname: e.target.value }) }} />
                                    <br />
                                </div>
                                <div className='boxelement'>
                                    <label id='fieldsname' for="Email">Email</label>
                                    <br />
                                    <input id='email' className='fields' type="email" name="email" onChange={(e) => { setRegister({ ...register, email: e.target.value }) }} />
                                    <br />
                                </div>
                                <div className='boxelement'>
                                    <label id='fieldsname' for="Password">Password</label>
                                    <br />
                                    <input id='password' className='fields' type={passwordVisible ? "text" : "password"} name="password" onChange={(e) => { setRegister({ ...register, password: e.target.value }) }} />
                                    <button className="toggle-password" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? (
                                            <FontAwesomeIcon icon={faEye} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        )}
                                    </button>
                                    {/* <p>Forgot Password</p> */}
                                </div>
                                <div className='boxelement'>
                                    <label id='fieldsname' for="dob">Date of Birth</label>
                                    <br />
                                    <input id='dob' type="date" className='fields' name="dob" onChange={(e) => { setRegister({ ...register, dob: e.target.value }) }} />
                                    <br />
                                </div>
                                <div className='submit'>
                                    <button type='submit' className='signinbutton'>Sign Up</button>
                                </div>
                            </form>
                            <p className='pname'>Already have an account? <button className='togglebtn' onClick={() => { setToggle(false) }} >Sign In</button> </p>
                        </div>
                    )}



                </div>
            </div>
        </>
    )

}

export default Login; 