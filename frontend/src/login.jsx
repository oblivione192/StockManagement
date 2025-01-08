import React from 'react'
import {useNavigate, Link} from 'react-router-dom';  
import session from './session';
import 'bootstrap/dist/css/bootstrap.min.css'

function Login(){ 
   const navigate = useNavigate();   
   document.getElementsByTagName('body')[0].style.backgroundImage="url('/assets/mainBackground.jpg')"
   const handleLoginReq= async (event) =>{ 
      event.preventDefault(); 
      const formDat = new FormData(event.target);  
      console.log(formDat)
      const login_details= Object.fromEntries(formDat.entries());  
      fetch("/api/login",
        {
           method: 'POST',
           headers:
           {
            'Content-Type':'application/json'
           }, 
           body:JSON.stringify(login_details)
        }
      )
      .then((response)=>{
       return response.json()
      })
      .then((res_json)=>{
        if(res_json.result === 'success'){
           session.id = res_json.session_token; 
           navigate('/productForm',{replace: true}) 
        }
      })
      .catch((err)=>{
        console.log("Oh my god...")
      })
   }
 
   return ( 
    
    <form className="form-group" onSubmit={handleLoginReq}> 
    <div style={{backgroundColor:"#424549",borderRadius:"20px"}}>
    <div className="mb-3 d-flex align-items-center" style={{backgroundColor:"#424549",padding:"20px"}}>
      <label className="form-label me-2 col-xs-2" htmlFor="username">Username:</label>
      <input 
        className="form-control form-control-sm" 
        type="text" 
        id="username" 
        name="username" 
        required 
      />
    </div>
  
    <div className="mb-3 d-flex align-items-center" style={{backgroundColor:"#424549",padding:"20px"}}>
      <label className="form-label me-2" htmlFor="password">Password:</label>
      <input 
        className="form-control form-control-sm" 
        type="password" 
        id="password" 
        name="password" 
        required 
      />
    </div>
  
    <div className="mb-3 d-flex align-items-center ml-2" style={{marginLeft:"20px"}}>
      <label className="form-check-label me-2" htmlFor="remember">
        Remember me
      </label>
      <input 
        className="form-check-input me-2 " 
        type="checkbox" 
        id="remember" 
        name="remember" 
      />
    </div>
  
    <div className="text-center">
      <button type="submit" className="btn btn-primary">Login</button>
    </div>
  
    <div className="text-center mt-3">
      <p className="form-label me-2">Need to register?</p>
      <Link to="/register">Register</Link>
    </div> 
    </div>
  </form>
  
   )
    
}

export default Login; 