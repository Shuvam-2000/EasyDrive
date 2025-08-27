import main from "../config/gemini.js";

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

