
import './Login.css';

import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from '../../api/axios';
import useData from '../../Hooks/useData';
import {faEye,faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const defaultRegister={
    fullname:'',
    email:'',
    password:'',
    dob:Date
}

const defaultLogin={
    
    email:'',
    password:'',
   
}

const Login = () => {

   const {setToken}=useData();

    const [toggle, setToggle] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [register,setRegister]=useState(defaultRegister);
    const [login,setLogin]=useState(defaultLogin);
    const [error, setError] = useState('');
    const [loggedIn,setloggedIn]=useState(false);
    // const [refreshToken,setRefreshToken]=useState('');
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const navigate = useNavigate();
    const handleRegister=async(e)=>{
        e.preventDefault();
         try{
           const response=await axios.post('/register',
           JSON.stringify(register),
           {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
           }
           );
           console.log(response);
           
           setError('');
         }
         catch(error){
            console.error(error);
            // If there's an error response from the server, set the error state
            setError(error.response.data.error);
         }
    }

    const handleLogin=async(e)=>{
        e.preventDefault();
         try{
           const response=await axios.post('login',
           JSON.stringify(login),
           {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
           }
           );
           console.log(response);
           const token=response?.data?.token;
           console.log("loginacc",token);
           setToken({token});
           navigate('/allquestions');
           setError('');

         }
         catch(error){
            // console.error(error);
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
                    {!toggle && (
                        <div className="box">
                            {error && <div className="error" style={{color:'red'}}>{error.replace(/"/g, '')}</div>}
                            <br/>
                            <form onSubmit={handleLogin}>
                            <div className='boxelement'>
                                <label id='fieldsname' for="email">Email</label>
                                <br />
                                <input className='fields' id='email' type="email" name="email" onChange={(e)=>{setLogin({...login,email:e.target.value})}}  />
                                <br />
                            </div>
                            <div className='boxelement'>
                                <label id='fieldsname' for="password">Password</label>
                                <br />
                                <input className='fields' id='password' type={passwordVisible ? "text" : "password"} name="password" onChange={(e)=>{setLogin({...login,password:e.target.value})}}  />
                                <button type='button' className="toggle-password" onClick={togglePasswordVisibility}>
                                    {passwordVisible ? (
                                        // 'Hide'
                                        <FontAwesomeIcon icon={faEye}/>
                                        // <i className="fas fa-eye-slash"></i>
                                    ) : (
                                        <FontAwesomeIcon icon={faEyeSlash}/>
                                        // 'Show'
                                        // <i className="fas fa-eye"></i>
                                    )}
                                </button>
                                {/* <p>Forgot Password</p> */}
                            </div>
                            <div className='submit'>
                                <button type='submit' className='signinbutton'>Sign In</button>
                            </div>
                            </form>
                            <p className='pname' > Don't have an account? <button className='togglebtn' onClick={() => { setToggle(true) }} >Sign Up</button> </p>
                        </div>
                    )}
                    {toggle && (
                        <div className="box">
                            {error && <div className="error">{error}</div>}
                            <form onSubmit={handleRegister}>
                            <div className='boxelement'>
                                <label id='fieldsname' for="fullname">Full Name</label>
                                <br />
                                <input id='fullname' className='fields' type="text" name="fullname" onChange={(e)=>{setRegister({...register,fullname:e.target.value})}} />
                                <br />
                            </div>
                            <div className='boxelement'>
                                <label id='fieldsname' for="Email">Email</label>
                                <br />
                                <input id='email' className='fields' type="email" name="email" onChange={(e)=>{setRegister({...register,email:e.target.value})}}/>
                                <br />
                            </div>
                            <div className='boxelement'>
                                <label id='fieldsname' for="Password">Password</label>
                                <br />
                                <input id='password' className='fields' type={passwordVisible ? "text" : "password"} name="password" onChange={(e)=>{setRegister({...register,password:e.target.value})}} />
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
                                <input id='dob' type="date" className='fields' name="dob" onChange={(e)=>{setRegister({...register,dob:e.target.value})}} />
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