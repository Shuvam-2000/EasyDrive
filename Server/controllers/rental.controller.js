import Rental from "../models/rental.model.js";
import Car from "../models/car.model.js";
import Customer from "../models/customer.model.js";
import { configDotenv } from "dotenv";
import { instance as razorpayInstance } from "../config/payment.js";
import crypto from "crypto";

// load enviorment variables
configDotenv();

// rent any car
export const rentAnyCar = async (req,res) => {
    try {
        const { carId, startDate, endDate, paymentMethod } = req.body

        // check if all fields are given
        if(!carId || !startDate || !endDate || !paymentMethod) 
            return res.status(400).json({
                message: "All Fields Are Required",
                success: false
        })

        // fetch customerId from middleware
        const customerId = req.customer.customerId;

        const car = await Car.findById(carId);
        if(!car) return res.status(400).json({
            message: "Car Not Found",
            success: false
        })

        const ownerId = car.owner;

        // calculate total price
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const totalPrice = days * car.pricePerDay;

        // offline payment
        if(paymentMethod === "Offline"){
            const rental = await Rental.create({
                customer: customerId,
                car: car._id,
                owner: ownerId,
                startDate: start,
                endDate: end,
                totalPrice,
                status: "Booked",
                paymentStatus: "Offline",
                paymentMethod: "Offline", 
            })
        

            // update the bookings field in the customer schema
            const customer = await Customer.findById(customerId);
            customer.bookings.push(rental._id)
            await customer.save()

            return res.status(201).json({
                message: "Booking Done Successfully",
                sucess: true,
                rental: rental
            })
        }

        // online payment
        if(payemntMethod === "Online"){
            const options = {
                amount: totalPrice * 100, 
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            }

            const order = await razorpayInstance.orders.create(options);

            return res.status(200).json({
                message: "Razorpay Order Created",
                success: true,
                order, // send to frontend for payment
                rentalData: { carId, startDate, endDate, totalPrice, ownerId },
            });
        }

        return res.status(400).json({
            message: "Invalid payment method",
            success: false,
        });

    } catch (error) {
        console.error("Error Renting Car", error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

// verify the payment if done online
export const verifyOnlinePayment = async (req,res) => {
    try {
        const { razorpay_order_id, 
                razorpay_payment_id, 
                razorpay_signature, 
                rentalData } = req.body;
        
        if (!razorpay_order_id || 
            !razorpay_payment_id || 
            !razorpay_signature || 
            !rentalData) {
            return res.status(400).json({ 
                message: "Payment details are required", 
                success: false 
            });
        }

        // verify signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if(generatedSignature !== razorpay_signature) {
                return res.status(400).json({ 
                    message: "Payment verification failed", 
                    success: false 
                });
        }

        // verfify payment and create booking
        const rental = await Rental.create({
            customer: req.customer._id,
            car: rentalData.carId,
            owner: rentalData.ownerId,
            startDate: new Date(rentalData.startDate),
            endDate: new Date(rentalData.endDate),
            totalPrice: rentalData.totalPrice,
            status: "Booked",
            paymentStatus: "Paid",
            paymentMethod: "Online"
        });

        // Update customer's bookings array
        const customer = await Customer.findById(req.customer._id);
        customer.bookings.push(rental._id);
        await customer.save();

        res.status(201).json({
            message: "Booking created successfully (Online)",
            success: true,
            rental
        });
        
    } catch (error) {
        console.error("Error verifying payment", error.message);
        res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
}

// get all booking for owner
export const getBookingsForOwner = async (req, res) => {
  try {
    const ownerId = req.owner?.ownerId; 

    if (!ownerId) {
      return res.status(400).json({
        message: "OwnerId not found in request",
        success: false,
      });
    }

    // Fetch rentals where this owner is linked
    const bookings = await Rental.find({ owner: ownerId })
      .populate("customer", "name email") // populate customer details
      .populate("car", "name model rentPerDay") // populate car details
      .sort({ startDate: -1 }); // latest bookings first

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        message: "No bookings found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Bookings fetched successfully",
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching booking data:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get all booking for customer
export const getBookingsForCustomer = async (req, res) => {
  try {
    const customerId = req.customer.customerId;
    if (!customerId) {
      return res.status(404).json({
        message: "Customer Id not found",
        success: false,
      });
    }

    // fetch bookings for customer and populate car + owner
     const rentals = await Rental.find({ customer: customerId })
      .populate("car")
      .populate("owner");

    if (!rentals) {
      return res.status(404).json({
        message: "Bookings not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      bookings: rentals,
    });
  } catch (error) {
    console.error("Error fetching booking data:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
