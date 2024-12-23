import bcrypt from 'bcrypt'   
import db from '../connection.js'  

async function registerUser(user_name,user_password,user_email){ 
    const salt=await bcrypt.genSalt(6); 
    const hashedPassword=await bcrypt.hash(user_password,salt);  
    const result= await new Promise((res,rej)=>{
    db.query(`INSERT INTO User (user_name, user_password, user_email) VALUES (?, ?, ?)`, 
     [user_name,hashedPassword,user_email], 
     (err,results)=>{
          if(err){
            console.log(err.stack); 
            rej(false);
          }
          else{
           console.log("Sucessfully registered a user!"); 
           res(results.affectedRows == 1); 
          }
     }
    )})
    return result; 
  } 
  async function authenticateUser(user_name, user_password) {
    try {
      // Wrap the db.query call in a Promise   
      const results = 
        db.query(
          `SELECT user_password FROM User WHERE user_name = ?`,
          [user_name], 
          (err)=>{
             throw new Error(err); 
          }
        );   
     
      console.log("Results: ",results);  
      if (results.length === 0) {
        return "Invalid username or password";
      } else if (bcrypt.compareSync(user_password, results[0].user_password)) {
        return "Access granted";
      } else {
        return "Wrong password";
      }
    } catch (error) {
      return "DB ERROR"; // Return the error message (e.g., "DB ERROR")
    }
  }

  async function main() {
    try {
      await registerUser("ghijkl", "qwerty", "mysql@gmail.com")
      .catch((err)=>{
        console.log("Failed registration"); 
      })
      ;
      console.log("Death"); 
      const status=await authenticateUser("ghijkl", "qwerty"); 
      console.log("Status:",status); 
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  
  main();