import express from "express" 
import path from 'path'  
import multer from 'multer'; 
import {authenticateUser,registerUser, getUserIdByName} from "./Auth/authenticateUser.js"
import {StockManagement} from "./StockManagement.js"  
import pool from './db/connection.js'; 

import cors from "cors"
const app= express() 
const PORT= 3000 

//Manage user connections 
var userConnections= {} 

//Manage the latest products added 
var latestProducts={}  
pool.getConnection(function(err,connection){
  if(err){
    console.log("Server cannot be started"); 
    process.exit(1); 
  }
}) 

const storage = multer.diskStorage(
  {
    destination: function(req,file,cb){
      cb(null, './uploads/user_assets')
    },
    filename: function (req,file,cb){
      const fileName = file.originalname; 
      cb(null, fileName); 
    }
  }
) 
const upload = multer({storage : storage}) 
//App configurations
app.use(cors());
app.use(express.static(path.join(path.resolve(),'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./uploads'))

//Endpoints
app.get("/events/:user_id",(req,res)=>
  { 
    const user_id = req.params.user_id;  
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive"); 
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    
    if(!userConnections[user_id]){  
      console.log("Initializing user subscription...")
      userConnections[user_id]=[]  
    } 

    userConnections[user_id].push(res)   
    console.log(`User with ${user_id} has subscribed to the live updates.`)  
    console.log(userConnections);
    res.write("Hello from the other side!")
    req.on("close", () => {
      userConnections[user_id] = userConnections[user_id].filter((conn) => conn !== res);
    });
  }
)
app.get("/goto-login",(req,res) => {
  res.sendFile(path.join(path.resolve(),'public','login.html')
  ) 

}) 

app.get("/goto-register",(req,res) => { 
  res.sendFile(path.join(path.resolve(),'public','register.html')) 
 
}) 

app.post("/api/register",(req,res) => {
  const {username,password,email}=req.body; 
  registerUser(username,password,email)
  .then((response) =>{
    if(response=="success"){
      console.log(`${username} has registered as new user`); 
      res.status(200).send(
        JSON.stringify({result: "success"}) 
      );
    }
    else if(response=="USER ALREADY EXISTS"){
      res.status(400).send(
        JSON.stringify({result: "user exists"}) 
      );  
    
    }
    else{
      console.log("Problem encountered in user registration.")
    }
  }) 
  .catch((error) =>{ 
    console.log("DB ERROR: ",error); 
  })
})   



app.post("/api/login",(req,res) => {
  const {username,password } = req.body;  
  authenticateUser(username,password)
  .then((response)=>{
    if(response=="success"){
      console.log(`${username} has logged in`); 
      getUserIdByName(username)
      .then((user_id)=>{
        res.send(JSON.stringify({
          result:"success",
          session_token: user_id
        })); 
      })  
      .catch((err)=>{
        res.send({status:"ERROR"}); 
      })
    } 
    else if(response=="wrong-username") { 
      res.send("wrong user")  
    } 
    else if(response=="wrong-password"){
      res.send("wrong password"); 
    }
  }) 
  .catch((error)=>{  
     
    console.log("DB ERROR: ",error); 
  })
}) 

app.get("/api/workspace",(req,res)=>{
  res.sendFile(path.join(path.resolve(),'public','productForm.html')); 
}) 
app.post("/api/addProduct",upload.single('product_image'),(req,res) => { 
   console.log(req.body) 
   console.log("add product called");   
  
   StockManagement.addProduct(
    req.body.user_id,
    req.body.product_type,
    {
        product_id: req.body.product_id,
        price: req.body.price,
        name: req.body.name,
        discontinued: false,
        quantity: req.body.quantity,
        ownership_date: req.body.ownership_date,
        brand:req.body.brand, 
        product_image: "/user_assets/"+req.file.filename 
    },
       {description:req.body.product_description}
)
    .then((result) => {
        if (result === 'ok') {
            StockManagement.getProductById(
                req.body.user_id,
                req.body.product_type,
                req.body.product_id
            )
                .then((latestProduct) => {
                   res.send(JSON.stringify(latestProduct));  
                })
                .catch((err) => console.log(err));
        }
    })
    .catch((err) => {
        res.send({ status: 'failure' });
    });
}) 


app.delete("/api/deleteProduct/:user_id/:product_id",(req,res)=>{
    StockManagement.removeProduct(req.params.user_id,req.params.product_id)
    .then((result)=>{ 
      res.send({status:"success"})
    })
    .catch((err)=>{ 
      console.log(err);
      res.send({status:"DELETED"}); 
    })
}) 
app.post("/api/updateProduct",upload.single('new_value'),(req,res)=>{  
  var new_value = null;   
  try{
    new_value =  req.file.path.replace('uploads','.').replaceAll('\\','/'); 
    console.log(new_value)
  }
  catch{
    new_value = req.body.new_value; 
  }
  console.log(req.body.user_id,req.body.product_id,req.body.product_prop,new_value);
  StockManagement.updateProductDetails(req.body.user_id,req.body.product_id,req.body.product_prop,new_value)
  .then((done)=>{
    res.send({status:"success"})
  }) 
  .catch((err)=>{
    res.send({status:err}) 
  })  

  
})

app.get("/api/getProductbyType",(req,res)=>{
  
    StockManagement.getAllProductsbyType(req.query.user_id,req.query.product_type)
    .then( 
      (result)=>{
        console.log("Products are retrieved for the user")
        res.status(200).send(JSON.stringify(result));
      } 
    )  
    .catch(
      (err)=>{
        console.log(err); 
        res.send({status:"ERROR"}); 
      }
    ) 
    
})  

app.get("/api/getAllProducts/:user_id",(req,res)=>{ 
  console.log(req.params.user_id);
  StockManagement.getProductsOwnedBy(req.params.user_id)
  .then((results)=>{  
    console.log(results); 
    res.send(results); 
  }) 
  .catch((err)=>{ 
    console.log(err);
    res.statusCode(404).send(err); 
  })
})

app.post("/api/discontinueProduct",(req,res)=>{
   StockManagement.discontinueProduct(req.body.user_id,req.body.product_id)
   .then((result)=>{res.send(result)}) 
   .catch((err)=>{res.send("ERROR")})
})

app.listen(PORT, ()=>{
    console.log(`Express server running at http://localhost:${PORT}/`)
})

