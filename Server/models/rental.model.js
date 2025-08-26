import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "car",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "owner",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Booked", "Ongoing", "Completed", "Cancelled"],
    default: "Booked",
  },
  paymentMethod:{
    type: String,
    enum: ["Offline", "Online"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Offline", "Paid", "Failed"],
    default: "Offline",
  },
});

const Rental = mongoose.model("rental", rentalSchema);

export default Rental;
