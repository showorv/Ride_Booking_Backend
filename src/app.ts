import express, { Application } from "express"

const app: Application = express();


app.use ("/", (req,res)=>{
    
    res.send("server on");
})
export default app;