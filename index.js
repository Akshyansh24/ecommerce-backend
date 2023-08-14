import express from 'express';
import dotenv from "dotenv";
import morgan from 'morgan';
import connectDB from './connection/db.js';
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productsRoutes.js"
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


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/products', productRoutes)



// rest api
app.get('/', (req,res)=>{
    res.send("welcome")
})

app.listen(port, ()=>{
    console.log(`listening on the port`);
})

