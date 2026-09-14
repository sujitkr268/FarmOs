const { evaluateOpportunities } = require("../services/opportunityService");

// ================= COMPARE MARKET OPPORTUNITIES =================
const compareOpportunities = async (req, res) => {
  try {
    // Support GET query parameters or POST body JSON
    const params = req.method === "POST" ? { ...req.query, ...req.body } : req.query;

    const result = await evaluateOpportunities(params);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Compare Opportunities Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to calculate market opportunities",
      error: error.message
    });
  }
};

module.exports = {
  compareOpportunities
};
