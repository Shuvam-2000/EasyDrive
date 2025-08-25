import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "owner",
      required: true,
    },
    maker: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    yearOfPurchase: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["SUV", "Sedan", "Hatchback", "Truck"],
      required: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    avaliable:{
      type: String,
      enum: ["Avaliable", "Not Avaliable"],
      default: "Avaliable"
    },
    seats: {
      type: Number,
      required: true,
    },
    description:{
      type: String,
      required: true
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("car", carSchema);

export default Car;
