import db from './connection.js' 


class StockManagement{ 
  
  static getAllProductsbyType(user_id,product_type){ 
    return new Promise((resolve,reject) => {
      // Add all valid types here

      const query=
      `
      SELECT 
          p.*, 
          o.ownership_date, 
          o.quantity, 
          o.quantity * p.product_price AS total_value
      FROM 
          ownership o
      JOIN 
          product p ON p.product_id = o.product_id
      WHERE 
          o.user_id = ? AND p.product_type = ?
      ` 
      db.query(query,[user_id,product_type],(err,result)=>{ 
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
      // Dynamically construct the table name based on validated product_type
      const query = `
        SELECT 
          p.*, 
          o.ownership_date, 
          o.quantity, 
          o.quantity * p.product_price AS total_value
      FROM 
          ownership o
      JOIN 
          product p ON p.product_id = o.product_id
      WHERE 
          o.user_id = ? AND p.product_type = ? AND p.product_id = ?
      `;
  
     
  
      db.query(query, [user_id,product_type,product_id], (err, results) => {
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
    static totalProducts(user_id){
      const query= 
      ` 
      SELECT COUNT(*) AS TOTAL_ITEMS FROM  ownership 
      WHERE ownership.user_id = ? 
      ` 
      return new Promise((resolve,reject)=>{
        db.query(query,[user_id],(err,result)=>{
          if(err){
            reject(err)
          } 
          resolve(result[0].TOTAL_ITEMS);
        })
      })
    }
    static totalProductsbyType(user_id,product_type){  
      return new Promise((resolve,reject)=>{


        // Add all valid types here
         const query = `SELECT COUNT(*) as TOTAL_ITEMS FROM OWNERSHIP,PRODUCT
                        WHERE OWNERSHIP.PRODUCT_ID = PRODUCT.PRODUCT_ID AND 
                        PRODUCT.PRODUCT_TYPE= ? AND OWNERSHIP.USER_ID = ? 
         ` 
         db.query(query,[product_type,user_id],(err,result)=>{ 
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
      db.query('INSERT INTO Product (product_id,product_price,product_name,product_discontinued,product_type,product_description,product_brand) VALUES (?,?,?,?,?,?,?)',
               [product_info.product_id,product_info.price,product_info.name,product_info.discontinued,product_type,JSON.stringify(product_details),product_info.product_brand],function(err,result){
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
         this.#addOwnership(user_id,product_info.product_id,product_info.ownership_date,product_info.quantity) 
         return "OK"; 
     })
    }
    static updateProductDetails(user_id,product_id,product_property,new_value){ 
        
      const prop_list = [
        "product_id",
        "product_name",
        "product_price",
        "product_type",
        "product_discontinued",
        "product_brand",
        "ownership_date",
        "quantity",
      ];
    
      return new Promise((resolve, reject) => {
        if (prop_list.includes(product_property)) {
          // For standard properties
          const query = `
            UPDATE PRODUCT
            INNER JOIN OWNERSHIP ON PRODUCT.PRODUCT_ID = OWNERSHIP.PRODUCT_ID
            SET ${db.escapeId(product_property)} = ?
            WHERE PRODUCT.PRODUCT_ID = ? AND OWNERSHIP.USER_ID = ?;
          `;
          db.query(query, [new_value, product_id, user_id], (err, result) => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            if (result.affectedRows > 0) {
              resolve("Update successful");
            } else {
              reject("No matching product or user found");
            }
          });
        } else {
          // For JSON properties
          const query = `
            UPDATE PRODUCT
            INNER JOIN OWNERSHIP ON PRODUCT.PRODUCT_ID = OWNERSHIP.PRODUCT_ID
            SET product_description = JSON_SET(product_description, ?, ?)
            WHERE PRODUCT.PRODUCT_ID = ? AND OWNERSHIP.USER_ID = ?;
          `;
          const jsonPath = `$.${product_property}`;
          db.query(
            query,
            [jsonPath, new_value, product_id, user_id],
            (err, result) => {
              if (err) {
                console.log(err);
                return reject(err);
              }
              if (result.affectedRows > 0) {
                resolve("JSON update successful");
              } else {
                reject("No matching product or user found");
              }
            }
          );
        }
      });
      }
       
    
    static removeProduct(user_id,product_id){ 
      return new Promise((resolve, reject) => {
        const query = `
          DELETE PRODUCT, OWNERSHIP
          FROM PRODUCT
          INNER JOIN OWNERSHIP ON PRODUCT.PRODUCT_ID = OWNERSHIP.PRODUCT_ID
          WHERE PRODUCT.PRODUCT_ID = ? AND OWNERSHIP.USER_ID = ?;
        `;
      
        db.query(query, [product_id, user_id], (err, result) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
      
          if (result.affectedRows > 0) {
            resolve("Success");
          } else {
            reject("Failure");
          }
        });
      });
    } 

    static discontinueProduct(user_id,product_id){
      return new Promise((resolve,reject)=>{
        const query = `UPDATE Product 
        INNER JOIN Ownership ON PRODUCT.PRODUCT_ID = OWNERSHIP.PRODUCT_ID 
        SET product_discontinued = 1 
        WHERE product.product_id = ? AND ownership.user_id = ? 
        ` 
        db.query(query,[product_id,user_id],(err,result) => {
        if(err){
        return reject(err); 
        } 
        resolve(result.affectedRows)
        })
       })
    }
      
}  

export {StockManagement}