import React from 'react';
import unauthorized from '../Images/NotFound.jpeg';  // Importing the image correctly

function NotFound() {
  return (
    <div className='d-flex justify-content-center flex-column align-items-center' style={{ height: '100vh' }}>
      <img src={unauthorized} alt="Unauthorized Access" style={{ maxWidth: '100%', height: '100vh' }} />
    </div>
  );
}

export default NotFound;
