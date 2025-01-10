import mysql2 from 'mysql2' 

console.log(process.env.DB_HOST); 
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,  
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  waitForConnections:true, 
  connectionLimit: 10, 
  queueLimit: 0
})

export default pool;

