import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function AuthCallback({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      
      onLogin(token); 

      navigate('/'); 
    } else {
      navigate('/signin');
    }
  }, [searchParams, navigate, onLogin]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#111',
      color: 'white',
      fontSize: '20px'
    }}>
      Authenticating...
    </div>
  );
}

export default AuthCallback;