
import mysql from "mysql2/promise"


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT as string, 10) : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})



export default db
