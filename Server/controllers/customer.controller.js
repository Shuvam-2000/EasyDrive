import Customer from "../models/customer.model.js";
import Car from "../models/car.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';

// Load environment variables
configDotenv();

// customer registration
export const customerRegistration = async (req,res) => {
    try {
        const { name, 
                email, 
                password, 
                phone, 
                licenseNumber } = req.body
            
        // check if all fields are given
        if(!name || 
            !email || 
            !password || 
            !phone || 
            !licenseNumber) return res.status(404).json({
            message: "All Fileds Are Required",
            success: false
        })

        // check if customer already exists
        const ifCustomerExists = await Customer.findOne({ email })

        if(ifCustomerExists) return res.status(400).json({
            message: "Customer Already Exists",
            success: false
        })

        // hashing the password
        const hashedPassword = await bcrypt.hash(password,10);

        // register new customer
        const customer  = new Customer({
            name,
            email,
            password: hashedPassword,
            phone,
            licenseNumber
        })

        await customer.save() // save to the db

        res.status(201).json({
            message: "Customer Registration Suceessful",
            success: true,
            customer: customer
        })

    } catch (error) {
        console.error("Error Registering Customer" , error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

// customer login
export const customerLogin = async (req,res) => {
    try {
        const { email, password } = req.body

        // check if all fields are given
        if(!email || !password) return res.status(404).json({
            message: "All Fields Are Required",
            success: false
        })

        // find customer by email
        const customer = await Customer.findOne({ email });
        if (!customer) {
        return res.status(400).json({
            message: "Invalid Credentials",
            success: false,
        });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
        return res.status(400).json({
            message: "Invalid Credentials",
            success: false,
        });
        }

        const token = jwt.sign(
        { 
          customerId: customer._id, 
          email: customer.email , 
          role: "customer" 
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
        );

         res.status(200).json({
            message: "Login Successful",
            success: true,
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
            },
         });
        
    } catch (error) {
        console.error("Error Customer Login" , error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

// get customer info
export const getCustomerInfo = async (req,res) => {
    try {
        // fetching customerId from the middleware
        const customerId = req.customer.customerId;

        if (!customerId)
        return res.status(400).json({
            message: "Customer ID not Found",
            success: false,
        });

        // fetch the customerInfo
        const customer = await Customer.findById(customerId).select("-password");

        if (!customer)
        return res.status(404).json({
            message: "Customer Not Avaliable",
            success: false,
        });

        res.status(200).json({
            message: "Customer Found",
            success: true,
            customer: customer
        });
        
    } catch (error) {
        console.error("Error Getting Customer Info" , error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

// get all cars registered
export const getAllCars = async (req,res) => {
    try {
        const cars = await Car.find({})

        // if no cars exists
        if(!cars) return res.status(404).json({
            message: "No Cars Present At the Moment",
            success: false
        })

        res.status(200).json({
            message: "Here Are the Cars Present",
            success: true,
            car: cars
        })
    } catch (error) {
        console.error("Error Fetching All Cars" , error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        }) 
    }
}

// get cars info by the carId
export const getCarById = async (req,res) => {
    try {
        // fetch carId from the req parmas
        const id = req.params.id;
        if(!id) return res.status(404).json({
            message: 'Car Id Not Found',
            success: false
        })

        const cars = await Car.findById(id)
        if(!cars) return res.status(400).json({
            message: "Car Not Found",
            success: false
        })

        res.status(200).json({
            message: "Here is the Car Found",
            success: true,
            car: cars
        })

    } catch (error) {
        console.error("Error Fetching Car By Id" , error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        }) 
    }
}

// find car by location and avaliability status
export const findCarByLocation = async (req,res) => {
    try {
        const carQuery = req.query.q || ""
        
        // optional type
        const carType = req.query.type || ""

        // check if query given
        if(!carQuery.trim()) return res.status(400).json({
            message: "Search query is required",
            success: false
        })

        // search filter
        let filter = {
            location: { $regex: carQuery, $options: "i" }, // case sensitive
            avaliable: "Avaliable" // only avaiable cars
        }

        // if the type is provided, add it to filter
        if(carType.trim()){
            filter.type = filter.type = { $regex: `^${carType}$`, $options: "i" };
        }

        // find all cars
        const cars = await Car.find(filter);
        
        if(!cars.length) return res.status(404).json({
            message: "No cars found matching your search",
            success: false,
        })

        res.status(200).json({
            message: "Here are cars found",
            success: true,
            car: cars
        })
        
    } catch (error) {
        console.error("Error Finding Car By Location" , error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        }) 
    }
}
