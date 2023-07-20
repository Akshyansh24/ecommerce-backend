import express from 'express';
import dotenv from "dotenv";
import morgan from 'morgan';
import connectDB from './connection/db.js';
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 8000;

// config env
dotenv.config();


// cors
app.use(cors())

// databaseconfig
connectDB();

// middleware
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes)

// rest api
app.get('/', (req,res)=>{
    res.send("welcome")
})

app.listen(port, ()=>{
    console.log(`listening on the port`);
})

