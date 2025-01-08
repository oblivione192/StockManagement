import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './login'; 
import ProductForm from './productForm'
import Register from './register'; 
import "./productForms.css" 

function ToRegisterPage() {
  const navigate = useNavigate();
  const handleRegistration = () => {
    navigate('/register');
  };
  return (
    <button onClick={handleRegistration}>
      Yes
    </button>
  );
}

function ToLoginPage() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };
  return (
    <button onClick={handleLogin}>
      No
    </button>
  );
}

function MainMenu() { 
  
  return ( 
    <div id="loginForm" className="userForm">
      <h1 id="welcome-title">Welcome To Stock Manager</h1>  
      <img src="./assets/logo.png" alt="logoProduct"
         style={{width:"30%",height:"auto"}}
      /> 
    
      <Login/> 
    </div>  
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<MainMenu/>} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/productForm" element={<ProductForm/>}/>  
      </Routes>
    </BrowserRouter> 
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
