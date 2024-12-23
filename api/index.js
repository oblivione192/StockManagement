import express from "express" 
import path from 'path'  
import {authenticateUser,registerUser, getUserIdByName} from "../Auth/authenticateUser.js"
import {StockManagement} from "./StockManagement.js" 
import cors from "cors"
const app= express() 
const PORT= 3000 

//Manage user connections 
var userConnections= {} 

//Manage the latest products added 
var latestProducts={}  

//App configurations
app.use(cors());
app.use(express.static(path.join(path.resolve(),'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('/'))

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

app.post("/register",(req,res) => {
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

app.post("/login",(req,res) => {
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

app.get("/workspace",(req,res)=>{
  res.sendFile(path.join(path.resolve(),'public','productForm.html')); 
})
app.post("/addProduct",(req,res) => { 
   console.log(req.body) 
   console.log("add product called");   
   
   if(req.body.product_type=='TV'){
     
   }
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
    },
        req.body.product_type === 'TV'
        ? {
              screen_size: req.body.screen_size,
              resolution: req.body.resolution,
              smart_tv: req.body.smart_tv === 'YES', // Ensure boolean conversion
              brand: req.body.brand,
          }
        : req.body.product_type === 'Refrigerator'
        ? {
              capacity: req.body.capacity,
              energy_rating: req.body.energy_rating,
              door_type: req.body.door_type,
              brand: req.body.brand, 
          }
        : {}
)
    .then((result) => {
        if (result === 'ok') {
            StockManagement.getProductById(
                req.body.user_id,
                req.body.product_type,
                req.body.product_id
            )
                .then((latestProduct) => {
                    const user_id = req.body.user_id;
                    console.log(userConnections[0]);
                    userConnections[user_id].forEach((conn) => {
                      conn.write(`event: message\n`)
                      conn.write(`data: ${JSON.stringify({ product:latestProduct})}\n\n`)
                    });
                })
                .catch((err) => console.log(err));
        }
    })
    .catch((err) => {
        res.send({ status: 'failure' });
    });
})
app.get("/getProduct",(req,res)=>{
  
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

app.post("/removeProduct",(req,res) => {
   StockManagement.removeProduct(req.body.user_id,req.body.product_type,req.body.product_id)
   .then((result)=>{res.send(result)}) 
   .catch((err)=>{res.send("ERROR")})
})  
app.post("/discontinueProduct",(req,res)=>{
   StockManagement.discontinueProduct(req.body.user_id,req.body.product_id)
   .then((result)=>{res.send(result)}) 
   .catch((err)=>{res.send("ERROR")})
})

app.listen(PORT, ()=>{
    console.log(`Express server running at http://localhost:${PORT}/`)
})

