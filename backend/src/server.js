import express from 'express';
import dotevn from 'dotenv';
// http
dotevn.config();

const app = express();

app.use(express.json());

app.get("/health" , (req , res)=>{
    res.json({status: "OK" , message: "Server is running" });
})

app.post("/echo", (req, res) => {
  res.json({
    received: req.body,
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})