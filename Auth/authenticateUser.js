import db from '../api/connection.js'
import bcrypt from 'bcrypt' 

async function authenticateUser(user_name,user_password){ 
  const result = await new Promise((res,rej)=>{ db.query(`SELECT user_password FROM User WHERE user_name = ? `,
     [user_name,user_password],
     (err,results)=>{
       if(err){
         rej("DB ERROR"); 
       } 
       else if(results.length == 0){  
          res("wrong-username");
       } 
       else if(bcrypt.compareSync(user_password,results[0].user_password)==true){
          res("success");
       } 
       else{
          res("wrong-password")
       }
     }
   )})  
   console.log(result); 
   return result; 
}
 async function getUserIdByName(user_name){
  const result = await new Promise((res,rej)=>{ 
    db.query(`SELECT user_id FROM USER where user_name = ? `,[user_name], 
      (err,results)=>{
        if(err){ 
          console.log(err.stack); 
          rej("ERROR"); 
        }
        else{
          res(results[0].user_id); 
        }
      }
    )
  }) 
  return result; 
 }
 async function registerUser(user_name,user_password,user_email){  
   const doesUserAlreadyExist= await new Promise((res)=>{db.query(`SELECT user_name FROM user WHERE  user_name = ?`,[user_name], 
    (err,results)=>{
      res(results.length > 0)
    }
   )})
   if(doesUserAlreadyExist==true){
    return "USER ALREADY EXISTS"; 
   } 

   const salt=await bcrypt.genSalt(6); 
   const hashedPassword=await bcrypt.hash(user_password,salt);  
  

  
   const result = await new Promise((res,rej)=>{db.query(`INSERT INTO User (user_name, user_password, user_email) VALUES (?, ?, ?)`, 
    [user_name,hashedPassword,user_email], 
    (err,results)=>{
         if(err){
           console.log(err.stack); 
           rej("ERROR"); 
         }
         else{
          console.log("Sucessfully registered a user!");
          res("success"); 
         }
    }
   )})  
   console.log(result); 
   return result; 
 }
 
export {authenticateUser, registerUser, getUserIdByName}
 