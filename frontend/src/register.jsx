
import {useNavigate, Link} from 'react-router-dom'

function Register(){  
    const navigate = useNavigate();
    const  handleRegisterReq= async function(event){ 
      event.preventDefault(); 
      const formDat = new FormData(event.target); 
      const reg_details= Object.fromEntries(formDat.entries());  
      const response= await fetch("/api/register",
            {
               method: 'POST',
               headers:
               {
                'Content-Type':'application/json'
               }, 
               body:JSON.stringify(reg_details)
            }
       )  
     const status = await response.json()
     console.log(status)
     if(status.result==="success"){
        navigate('/'); 
     }
     else if(status.result==="user exists") {
       const errorDiv= document.createElement('div');
       errorDiv.innerHTML='Username exists please enter another username'
     }
      

    }
    return(
        <form className="form-group userForm align-items-left" onSubmit={handleRegisterReq}> 
        <div className="row mb-3 d-flex align-items-center"> 
          <label>
            Username:
            <input type="text" name="username" required />
          </label> 
        </div> 
        <div className="row mb-3 d-flex align-items-center"> 
          <label>
            Password:
            <input type="password" name="password" required />
          </label>  
        </div> 
        <div className="row mb-3 d-flex align-items-center">
          <label> 
              Email: 
              <input type="email" name="email" required /> 
          </label>
        </div>
        <button type="submit">Register</button>    
        <div className="row mb-3 d-flex align-items-center"> 
           <Link to="/" style={{color:"white"}}>Back to Login</Link> 
        </div>
      </form> 
     
    )
}
export default Register; 