import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div style={{ color: 'black',padding:'10px',borderRadius:'7px', marginBottom: '10px' ,background:'#f4d6d2',borderColor:'#f0c5c'}}>
      {message}
    </div>
  );
};

export default ErrorMessage;