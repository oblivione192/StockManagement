import db from './connection.js'
class StockManagement{ 
  
  static getAllProductsbyType(user_id,product_type){ 
    return new Promise((resolve,reject) => {
      const validProductTypes = ['TV', 'Refrigerator'];  // Add all valid types here
      if (!validProductTypes.includes(product_type)) {
        return reject('Invalid product type');
      }
      const query=
      `
      SELECT 
          p.*, 
          t.*,
          o.ownership_date, 
          o.quantity, 
          o.quantity * p.product_price AS total_value
      FROM 
          ownership o
      JOIN 
          product p ON p.product_id = o.product_id
      JOIN 
          ${product_type} t ON t.product_id = p.product_id
      WHERE 
          o.user_id = ?;
      ` 
      db.query(query,[user_id],(err,result)=>{ 
        if(err){
          return reject(err);

        }
        resolve(result); 
      })
    })
  }
  static getProductById(user_id, product_type, product_id) {
    return new Promise((resolve, reject) => {
      // Validate product_type to prevent SQL injection
      const validProductTypes = ['TV', 'Refrigerator'];  // Add all valid types here
      if (!validProductTypes.includes(product_type)) {
        return reject('Invalid product type');
      }
  
      // Dynamically construct the table name based on validated product_type
      const query = `
        SELECT t.*, p.*
        FROM ${product_type} t
        JOIN product p ON t.product_id = p.product_id
        JOIN ownership up ON p.product_id = up.product_id
        WHERE p.product_type = ?
        AND up.user_id = ?
        AND p.product_id = ?
      `;``
  
      console.log('Running query with:', { product_type, user_id, product_id });  // Debugging log
  
      db.query(query, [product_type, user_id, product_id], (err, results) => {
        if (err) {
          console.log('Error:', err.stack);  // More detailed error logging
          reject(err);  // Reject the promise in case of error
        }
  
        
  
        if (results.length === 0) {
          reject('No matching records found.');
        }
  
        resolve(results[0]);  // Resolve the promise if results are found
      });
    });
  }
  
  
    static getProductByName(user_id,product_type,name){
      return new Promise( 
        (resolve,reject)=>{ 
          const validProductTypes = ['TV', 'Refrigerator'];  // Add all valid types here
          if (!validProductTypes.includes(product_type)) {
            return reject('Invalid product type');
          }
      
          // Dynamically construct the table name based on validated product_type
          const query = `
            SELECT t.*, p.*
            FROM ${product_type} t, Product p, Ownership o
            WHERE p.product_name = ? AND o.user_id = ? AND o.product_id = p.product_id;
          `; 
          
          db.query(query,[name,user_id],(err,results)=>{
            if(err){ 
              reject(new Error("No record found")) 
            } 
            if(results.length > 0){
              resolve(results);
            }
            else{ 
              resolve("no records")
            }
          })

        }
      )
    }
    static totalProducts(user_id,product_type){  
      return new Promise((resolve,reject)=>{


         const validProductTypes = ['TV', 'Refrigerator'];  // Add all valid types here
          if (!validProductTypes.includes(product_type)) {
            return reject('Invalid product type');
          }
         const query = `SELECT COUNT(*) as TOTAL_ITEMS FROM ${product_type}` 
         db.query(query,(err,result)=>{ 
          if(err){
            console.log(err.stack); 
            return reject(err); 
          }
          else{ 
            resolve(result[0].TOTAL_ITEMS); 
          } 
         })
      })
    }
    static #addRefrigerator(product_id,fridge){
     return new Promise( 
     (resolve,reject)=>{
        db.query('INSERT INTO REFRIGERATOR (product_id,capacity,energy_rating,door_type,brand) VALUES (?,?,?,?,?)',
              [product_id,fridge.capacity,fridge.energy_rating,fridge.door_type,fridge.brand],
              (err,results)=>{ 
                if(err){ 
                  reject(err); 
                }
                else{
                  console.log(results); 
                  resolve(results); 
                }
              }
        ) 
    })
    }
    static #addTv(product_id,tv){ 
     return new Promise((resolve,reject)=>{
      db.query('INSERT INTO TV (product_id,screen_size,resolution,smart_tv,brand) VALUES (?,?,?,?,?)',
              [product_id,tv.screen_size,tv.resolution,tv.smart_tv,tv.brand], 
              (err,result)=>{
                   if(err){ 
                    console.log(err.stack); 
                    reject(err); 
                   }
                   else{
                    resolve(result); 
                   }
              }
      ) 
     })
    }
    static #addOwnership(user_id,product_id,ownership_date,quantity){ 
     return new Promise((resolve,reject)=>{ 
      db.query('INSERT INTO OWNERSHIP (user_id,product_id,ownership_date,quantity) VALUES (?,?,?,?)',
        [user_id,product_id,ownership_date,quantity], 
        (err,result)=>{
          if(err){
            console.log(err.stack); 
            reject(err);
          }
          else{ 
            resolve("OK");  
          }
        }
      )  
    }
    )
    }
    static addProduct(user_id,product_type,product_info,product_details){ 
     return new Promise((resolve,reject) =>{
      db.query('INSERT INTO Product (product_id,product_price,product_name,product_discontinued,product_type) VALUES (?,?,?,?,?)',
               [product_info.product_id,product_info.price,product_info.name,product_info.discontinued,product_type],function(err,result){
                    if(err ){
                      console.log(err.stack); 
                      reject(err); 
                    } 
                    else{  
                      resolve("OK")
                    }
               } 
              )   
          }
     )
     .then(()=>{ 
        if(product_type=="Refrigerator"){ 
             this.#addRefrigerator(product_info.product_id,product_details); 
        } 
        else if(product_type=="TV"){
            this.#addTv(product_info.product_id,product_details); 
        }
      } 
     )
     .then(()=>{
         this.#addOwnership(user_id,product_info.product_id,product_info.ownership_date,product_info.quantity) 
         return "OK"; 
     })
    }
    static updateProductDetails(product_id,product_type,product_property,new_value){ 
      const product_prop_dictionary =
      { 
          'Product': ['product_id','product_name','product_price','product_quantity','ownership_date'],
          'TV':['screen_size','resolution','smart_tv'],  
          'Refrigerator': ['capacity','energy_rating','door_type']
      } 
      
        return new Promise((resolve,reject)=>{ 
          if(product_prop_dictionary['Product'].includes(product_property) || product_prop_dictionary[product_type].includes(product_property)){
            const query = ` 
            UPDATE PRODUCT
            SET ${product_property} = ?
            WHERE product_id = ?
          ` 
            db.query(query,[new_value,product_id],(result,err)=>{
              if(err){
                reject(err); 
              }
              else{
                 resolve(result.affectedRows==1); 
              }
            })
          }
          else{
            reject('Non-existent property');
          }
          
        })
      }
       
    
    static removeProduct(user_id,product_type,id){ 
     return new Promise((resolve,reject) => {
      const query=`DELETE FROM PRODUCT WHERE product_id = ?` 
      db.query(query,[id],(err,result) => { 
        if(err){
          return reject(err);
        }  
        resolve(result); 
      })
    
    })

    }
    static discontinueProduct(user_id,id){
      return new Promise((resolve,reject)=>{
        const query = `UPDATE Product 
        SET product_discontinued = 1 
        WHERE product_id = ? 
        ` 
        db.query(query,id,(err,result) => {
        if(err){
        return reject(err); 
        } 
        resolve(result.affectedRows)
        })
       })
    }
      
}  

//addProduct 
// StockManagement.addProduct(1,"Refrigerator", 
//   {
//     product_id: "T011",
//     name:"FRIDGETR123", 
//     price:1099.99,
//     discontinued: false
//   },
//   {
//     brand:"LG",
//     energy_rating:"A+", 
//     door_type:"French door design", 
//     capacity: 3.11
//   }
// )
// .then((result)=>
// {
//    console.log("Added a refrigerator")
// })
// .catch((err)=>{
//   console.log(err);
// }) 

//general product info 
//{product_id, price, quantity, discontinued, ownership_date}
//fridge 
//{brand,energy_rating,door_type,capacity} 
//tv 
//{screen_size,resolution,smart_tv,brand}  


export {StockManagement}