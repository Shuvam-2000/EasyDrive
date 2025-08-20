import express from 'express';
import cors from 'cors';
import "./config/connection.js"
import { configDotenv } from 'dotenv';

// initialize the app
const app = express();

// Load environment variables
configDotenv();

// initialize the port
const PORT  = process.env.PORT || 8001;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// test route
app.get('/', (req,res) => {
    res.send("Hello Server Is Running")
});

// run the server
app.listen(PORT, () => console.log(`Server runing on PORT: ${PORT}`));