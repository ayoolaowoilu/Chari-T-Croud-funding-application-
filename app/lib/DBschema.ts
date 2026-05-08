
import mysql from "mysql2/promise"


const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,port:process.env.DB_PORT as any
})



db.on('error', (err) => {
    console.error('Database error:', err);
});

db.on('connect', () => {
    console.log('Database connected successfully.');
}  )

if (db) {
    console.log("Database connected successfully");
}   else{
    console.log("Database connection failed");
}



export default db