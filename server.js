import app from "./app.js";
import { connectdb } from "./config/database.js";


connectdb();

app.listen(process.env.PORT,()=>{
    console.log(`Server is working on ${process.env.PORT} `)
});