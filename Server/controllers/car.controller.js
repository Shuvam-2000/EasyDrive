import Car from "../models/car.model.js";
import Owner from "../models/owner.model.js";  
import fs from "fs";
import imagekit from "../config/imagekit.js";

// new car register by owner
export const newCarRegister = async (req, res) => {
  try {
    const {
      maker,
      model,
      yearOfPurchase,
      type,
      registrationNumber,
      fuelType,
      transmission,
      seats,
      description,
      pricePerDay,
      available,
      location,
    } = req.body;

    const imageFile = req.file;

    // check all fields
    if (
      !maker ||
      !model ||
      !yearOfPurchase ||
      !type ||
      !registrationNumber ||
      !fuelType ||
      !transmission ||
      !seats ||
      !description ||
      !pricePerDay ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    // check if the car already exists
    const existingCar = await Car.findOne({ registrationNumber });
    if (existingCar) {
      return res.status(400).json({
        message: `${registrationNumber} already exists`,
        success: false,
      });
    }

    // Get ownerId from middleware 
    const ownerId = req.owner?.ownerId || req.body.ownerId;

    if (!ownerId) {
      return res.status(400).json({
        message: "Owner ID is required",
        success: false,
      });
    }

    // Create the new car
    const newCar = await Car.create({
      maker,
      model,
      yearOfPurchase,
      type,
      registrationNumber,
      fuelType,
      transmission,
      seats,
      description,
      pricePerDay,
      available,
      location,
      image: optimizedImageUrl,
      owner: ownerId, 
    });

    // Push car into owner’s cars array
    await Owner.findByIdAndUpdate(ownerId, { $push: { cars: newCar._id } });

    res.status(201).json({
      message: "Car Registered Successfully",
      success: true,
      car: newCar,
    });
  } catch (error) {
    console.error("Error Registering Car", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// update car avaliablity
export const changeCarAvaliablity = async (req,res) => {
  try {
    const { id, avaliable } = req.body
    const ownerId = req.owner?.ownerId

    if(!ownerId) return res.status(404).json({
      message: "Owner Id Not Found",
      success: false
    })

    if(!id || !avaliable) return res.status(400).json({
      message: "CarId and Avaliable are required",
      success: false
    })

    // chek if car belongs to this owner
    const car = await Car.findOne({ _id: id, owner: ownerId })
    if(!car) return res.status(404).json({
      message: "Car not found or you are not the owner",
      success: false
    })

    // update the car avaliablity status
    car.avaliable = avaliable;
    await car.save();

    res.status(200).json({
      message: "Car avaliablity updated",
      success: true,
      car: car
    })
  } catch (error) {
    console.error("Error Updating Car Avaliablity", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
