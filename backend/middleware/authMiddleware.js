const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Token missing
    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Token missing."
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user in PostgreSQL
    const result = await pool.query(
      `
      SELECT 
        id, name, email, role, phone, location,
        business_name, contact_person, state, district, mandi, commodities, buying_capacity,
        enam_reference, udyam_reference, official_website, show_contact_publicly,
        verification_status, verification_notes,
        farm_size, crops_grown, village, farmer_reference, fpo_info, verification_evidence,
        created_at
      FROM users
      WHERE id = $1
      `,
      [decoded.id]
    );

    // User not found
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Attach user to request
    req.user = result.rows[0];

    // Continue to next middleware/controller
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Not authorized. Invalid token."
    });
  }
};

module.exports = protect;
