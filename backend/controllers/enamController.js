const { getEnamInformation } = require("../services/enamService");

// ================= GET e-NAM MARKET INFORMATION =================
const getEnamInfo = async (req, res) => {
  try {
    const data = await getEnamInformation();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Get e-NAM Info Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve e-NAM market information",
      error: error.message
    });
  }
};

module.exports = {
  getEnamInfo
};
