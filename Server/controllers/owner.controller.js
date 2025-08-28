import Owner from "../models/owner.model.js";
import Car from "../models/car.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";

// Load Envinronment variables
configDotenv();

// owner registration
export const ownerRegistration = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // check if all fields are given
    if (!name || !email || !phone || !password)
      return res.status(404).json({
        message: "All Fields Are Required",
        success: false,
      });

    // check if owner already exists
    const ownerAlreadyExists = await Owner.findOne({ email });

    if (ownerAlreadyExists)
      return res.status(400).json({
        message: "Owner Already Exists",
        success: false,
      });

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // regsiter the owner
    const owner = new Owner({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await owner.save();

    res.status(201).json({
      message: "Owner Registration SuccessFull",
      success: false,
      owner: owner,
    });
  } catch (error) {
    console.error("Error Registering Owner", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// owner login
export const ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // all fields required
    if (!email || !password)
      return res.status(404).json({
        message: "All Fields Are Required",
        success: false,
      });

    // find onwer by email
    const owner = await Owner.findOne({ email });

    if (!owner)
      return res.status(400).json({
        message: "Owner Not Found",
        success: false,
      });

    // matching the passwords
    const isPasswordMatch = await bcrypt.compare(password, owner.password);
    if (!isPasswordMatch)
      return res.status(400).json({
        message: "Invalid Credentials",
        success: false,
      });

    const token = jwt.sign(
      {
        ownerId: owner._id,
        email: owner.email,
        role: "owner",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login Successful",
      success: true,
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
      },
    });

  } catch (error) {
    console.error("Error Owner Login", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// get owner info
export const getOwnerInfo = async (req,res) => {
    try {
        // fetching customerId from the middleware
        const ownerId = req.owner.ownerId;

        if (!ownerId)
        return res.status(400).json({
            message: "Owner ID not Found",
            success: false,
        });

        // fetch the customerInfo
        const owner = await Owner.findById(ownerId).select("-password");

        if (!owner)
        return res.status(404).json({
            message: "Owner Not Avaliable",
            success: false,
        });

        res.status(200).json({
            message: "Owner Found",
            success: true,
            owner: owner
        });
        
    } catch (error) {
        console.error("Error Getting Owner Info" , error.message)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        })
    }
}

// get all cars registered by owner
export const getAllCarsRegistered = async (req,res) => {
  try {
      // fetching ownerId from middleware
      const ownerId = req.owner.ownerId

      if(!ownerId) return res.status(404).json({
        message: "Owner Not Found",
        success: false
      })

      // fetch the cars registered to the owner by ownerId
      const car = await Car.find({ owner: ownerId })

      if(!car) return res.status(400).json({
        message: "No Cars Found",
        success: false
      })

      res.status(200).json({
        message: "All Cars Found",
        success: true,
        car: car
      })
  } catch (error) {
      console.error("Error Fetching Car Info For Owner" , error.message)
      res.status(500).json({
        message: 'Internal Server Error',
        success: false
      })
  }
}

// delete any registered car by owner
export const deleteRegisteredCar = async (req,res) => {
  try {
      const ownerId = req.owner.ownerId
      if(!ownerId) return res.status(404).json({
        message: "Owner Not Found"
      })

      const { id } = req.body
      if(!id) return res.status(404).json({
        message: "Car Not Found",
        success: false
      })

      // delete the car by the carId
      const car = await Car.findByIdAndDelete(id)

      // delete the car id from the owner’s cars array
      await Owner.findByIdAndUpdate(ownerId, {$pull: {cars: car._id }})

      res.status(200).json({
        message: "Car Deleted Successfully",
        success: true
      })
  } catch (error) {
      console.error("Error Deleting Car" , error.message)
      res.status(500).json({
        message: 'Internal Server Error',
        success: false
      })
  }
}
