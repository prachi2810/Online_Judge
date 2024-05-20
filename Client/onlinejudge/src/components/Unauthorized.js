import React from 'react';
import unauthorized from '../Images/Unauthorized1.jpeg';  // Importing the image correctly
import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate=useNavigate();
  return (
    <div className='d-flex justify-content-center flex-column align-items-center' style={{ height: '100vh' }}>
      <img src={unauthorized} alt="Unauthorized Access" style={{ maxWidth: '100%', height: '100vh' }} />
      <button type='button' className='btn btn-primary' onClick={()=>{navigate('/')}} style={{marginTop:'-60px'}}>Back To Login</button>
    </div>
  );
}

export default Unauthorized;
