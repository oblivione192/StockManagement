import db from'./connection.js';  

function getProductProps(){ 
 return new Promise((res,rej)=>{
  const query = `DESCRIBE PRODUCT; DESCRIBE OWNERSHIP;` 
  db.query(query,function(err,results){ 
      if(err){
        console.log(err);
      } 
      console.log(results);
      res(results); 
  })  
 })
} 

const result = await getProductProps() 
const allProductAttr= result.map((col)=>{
    return col.Field; 
}) 
console.log(allProductAttr);
