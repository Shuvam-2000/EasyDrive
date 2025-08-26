import express from 'express';
import cors from 'cors';
import "./config/connection.js"
import { configDotenv } from 'dotenv';
import customerRoute from "./routes/customer.routes.js"
import ownerRoute from "./routes/owner.routes.js"
import carRoute from "./routes/car.routes.js"
import rentalRoute from "./routes/rental.route.js"

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

// routes
app.use("/api/customer", customerRoute);
app.use("/api/owner", ownerRoute);
app.use("/api/car", carRoute);
app.use("/api/rental", rentalRoute);

// run the server
app.listen(PORT, () => console.log(`Server runing on PORT: ${PORT}`));