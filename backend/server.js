import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./database/connectDB.js";

import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";

// import { newsLetterCron } from "./automation/newsLetterCron.js";
import path from "path";


const app = express();
const URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT;
const __dirname = path.resolve();


// CORS Middleware
app.use(
  cors({
    origin: URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
    credentials: true,
  })
);


// Middleware to use the POSTMAN DATA AND TO GET THE COOKIE 
app.use(cookieParser());                                  
app.use(express.json());
app.use(express.urlencoded({ extended : true }));



app.use("/user", userRouter);
app.use("/job", jobRouter);
app.use("/application", applicationRouter);


app.use(express.static(path.join(__dirname, "/frontend/dist"))); 
app.get("*", (req, res)=>{
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})

// newsLetterCron()


await connectDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });
});





