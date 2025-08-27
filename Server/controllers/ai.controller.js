import main from "../config/gemini.js";
import Car from "../models/car.model.js";

// generating car description with AI
export const generateShortDescription = async (req, res) => {
  try {
    const { maker, model, fuelType, yearOfPurchase, type } = req.body;

    // Ensure AI returns a single clean string
    const prompt = `Write a short, attractive, and concise description for a car.
    Only provide a single sentence or short paragraph.
    Do NOT include options, numbers, bullet points, or extra formatting.

    Car details:
    Maker: ${maker}
    Model: ${model}
    Fuel Type: ${fuelType}
    Year Of Purchase: ${yearOfPurchase}
    Type: ${type}`;

    const description = await main(prompt);

    // trim whitespace/newlines
    const cleanDescription = description.trim();

    res.status(200).json({
      success: true,
      description: cleanDescription,
    });
  } catch (error) {
    console.error("Error Generating Description", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const smartCarRecommendation = async (req, res) => {
  try {
    const carId = req.params.id;

    // get the car by Id to fetch type, location, and price
    const car = await Car.findById(carId);
    if (!car)
      return res.status(404).json({
        message: "Car Not Found",
        success: false,
      });

    const { type, location, pricePerDay } = car;

    // generate the prompt for Gemini AI to suggest similar cars (optional)
    const prompt = `Suggest 5 popular car models of type "${type}" in "${location}" within a similar price range around ₹${pricePerDay}. Only provide the car model names separated by commas.`;

    const geminiResponse = await main(prompt);

    // parse recommended car models from AI
    const recommendedModels = geminiResponse
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    // Fetch full car details from DB matching recommended models, type, location, excluding current car
    let recommendedCars = [];
    if (recommendedModels.length > 0) {
      recommendedCars = await Car.find({
        type,
        location,
        model: { $in: recommendedModels },
        _id: { $ne: carId },
        avaliable: "Avaliable",
      }).limit(5);
    }

    // Fallback: if AI did not return names or no cars found, get 5 cars of same type, location, similar price
    if (recommendedCars.length === 0) {
      const priceRange = 0.2 * pricePerDay; // ±20% of original price
      recommendedCars = await Car.find({
        type,
        location,
        pricePerDay: {
          $gte: pricePerDay - priceRange,
          $lte: pricePerDay + priceRange,
        },
        _id: { $ne: carId },
        avaliable: "Avaliable",
      }).limit(5);
    }

    return res.status(200).json({
      message: "Here Are The Recommended Cars",
      recommendedCars,
      success: true,
    });
  } catch (error) {
    console.error("Error in Car Recommendation:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
