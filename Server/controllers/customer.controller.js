import Customer from "../models/customer.model.js";
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