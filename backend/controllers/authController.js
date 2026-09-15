const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      location,

      // Optional buyer profile fields
      business_name,
      contact_person,
      state,
      district,
      mandi,
      commodities,
      buying_capacity,
      enam_reference,
      udyam_reference,
      official_website,
      show_contact_publicly
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({
        message: "Please provide all required fields (name, email, password, phone, location)"
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Validate role
    const allowedRoles = ["farmer", "buyer", "admin"];
    const userRole = role || "farmer";

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const initialVerificationStatus = userRole === "buyer" ? "pending" : "verified";

    // Insert user into PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password,
        role,
        phone,
        location,
        business_name,
        contact_person,
        state,
        district,
        mandi,
        commodities,
        buying_capacity,
        enam_reference,
        udyam_reference,
        official_website,
        show_contact_publicly,
        verification_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING
        id, name, email, role, phone, location, business_name, contact_person,
        state, district, mandi, commodities, buying_capacity, enam_reference,
        udyam_reference, official_website, show_contact_publicly, verification_status, created_at
      `,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
        userRole,
        phone.trim(),
        location.trim(),
        business_name ? business_name.trim() : null,
        contact_person ? contact_person.trim() : name.trim(),
        state ? state.trim() : null,
        district ? district.trim() : null,
        mandi ? mandi.trim() : null,
        commodities ? commodities.trim() : null,
        buying_capacity ? buying_capacity.trim() : null,
        enam_reference ? enam_reference.trim() : null,
        udyam_reference ? udyam_reference.trim() : null,
        official_website ? official_website.trim() : null,
        typeof show_contact_publicly === "boolean" ? show_contact_publicly : false,
        initialVerificationStatus
      ]
    );

    const user = result.rows[0];

    return res.status(201).json({
      message: userRole === "buyer"
        ? "Buyer account registered! Submitted for admin review & verification."
        : "User registered successfully",
      user
    });

  } catch (error) {
    console.error("Register Error:", error.message);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= LOGIN USER =================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user in PostgreSQL
    const result = await pool.query(
      `
      SELECT
        id, name, email, password, role, phone, location, business_name,
        contact_person, state, district, mandi, commodities, buying_capacity,
        enam_reference, udyam_reference, official_website, show_contact_publicly, verification_status
      FROM users
      WHERE email = $1
      `,
      [normalizedEmail]
    );

    // User not found
    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // Send successful response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        business_name: user.business_name,
        state: user.state,
        district: user.district,
        mandi: user.mandi,
        commodities: user.commodities,
        buying_capacity: user.buying_capacity,
        enam_reference: user.enam_reference,
        udyam_reference: user.udyam_reference,
        official_website: user.official_website,
        show_contact_publicly: user.show_contact_publicly,
        verification_status: user.verification_status
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// ================= GET USER PROFILE =================

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      user: req.user
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// ================= UPDATE USER PROFILE =================

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      location,
      show_contact_publicly,
      // Buyer fields
      business_name,
      contact_person,
      state,
      district,
      mandi,
      commodities,
      buying_capacity,
      enam_reference,
      udyam_reference,
      official_website,
      // Farmer fields
      farm_size,
      crops_grown,
      village,
      farmer_reference,
      fpo_info,
      verification_evidence
    } = req.body;

    // Fetch existing user to preserve values if omitted
    const currentRes = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (currentRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const current = currentRes.rows[0];

    const newName = name !== undefined ? name.trim() : current.name;
    const newPhone = phone !== undefined ? phone.trim() : current.phone;
    const newLocation = location !== undefined ? location.trim() : current.location;
    const newShowContact = typeof show_contact_publicly === "boolean" ? show_contact_publicly : current.show_contact_publicly;

    const newBusinessName = business_name !== undefined ? (business_name ? business_name.trim() : null) : current.business_name;
    const newContactPerson = contact_person !== undefined ? (contact_person ? contact_person.trim() : null) : current.contact_person;
    const newState = state !== undefined ? (state ? state.trim() : null) : current.state;
    const newDistrict = district !== undefined ? (district ? district.trim() : null) : current.district;
    const newMandi = mandi !== undefined ? (mandi ? mandi.trim() : null) : current.mandi;
    const newCommodities = commodities !== undefined ? (commodities ? commodities.trim() : null) : current.commodities;
    const newBuyingCapacity = buying_capacity !== undefined ? (buying_capacity ? buying_capacity.trim() : null) : current.buying_capacity;
    const newEnamRef = enam_reference !== undefined ? (enam_reference ? enam_reference.trim() : null) : current.enam_reference;
    const newUdyamRef = udyam_reference !== undefined ? (udyam_reference ? udyam_reference.trim() : null) : current.udyam_reference;
    const newWebsite = official_website !== undefined ? (official_website ? official_website.trim() : null) : current.official_website;

    const newFarmSize = farm_size !== undefined ? (farm_size ? farm_size.trim() : null) : current.farm_size;
    const newCropsGrown = crops_grown !== undefined ? (crops_grown ? crops_grown.trim() : null) : current.crops_grown;
    const newVillage = village !== undefined ? (village ? village.trim() : null) : current.village;
    const newFarmerRef = farmer_reference !== undefined ? (farmer_reference ? farmer_reference.trim() : null) : current.farmer_reference;
    const newFpoInfo = fpo_info !== undefined ? (fpo_info ? fpo_info.trim() : null) : current.fpo_info;
    const newEvidence = verification_evidence !== undefined ? (verification_evidence ? verification_evidence.trim() : null) : current.verification_evidence;

    let newVerificationStatus = current.verification_status;
    // If farmer submits new verification details and status is not verified, set to pending for admin review
    if (req.user.role === 'farmer' && (farmer_reference || verification_evidence) && current.verification_status !== 'verified') {
      newVerificationStatus = 'pending';
    }

    const updateResult = await pool.query(
      `
      UPDATE users
      SET
        name = $1,
        phone = $2,
        location = $3,
        show_contact_publicly = $4,
        business_name = $5,
        contact_person = $6,
        state = $7,
        district = $8,
        mandi = $9,
        commodities = $10,
        buying_capacity = $11,
        enam_reference = $12,
        udyam_reference = $13,
        official_website = $14,
        farm_size = $15,
        crops_grown = $16,
        village = $17,
        farmer_reference = $18,
        fpo_info = $19,
        verification_evidence = $20,
        verification_status = $21,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $22
      RETURNING
        id, name, email, role, phone, location, business_name, contact_person,
        state, district, mandi, commodities, buying_capacity, enam_reference,
        udyam_reference, official_website, show_contact_publicly, verification_status,
        verification_notes, farm_size, crops_grown, village, farmer_reference,
        fpo_info, verification_evidence, created_at
      `,
      [
        newName,
        newPhone,
        newLocation,
        newShowContact,
        newBusinessName,
        newContactPerson,
        newState,
        newDistrict,
        newMandi,
        newCommodities,
        newBuyingCapacity,
        newEnamRef,
        newUdyamRef,
        newWebsite,
        newFarmSize,
        newCropsGrown,
        newVillage,
        newFarmerRef,
        newFpoInfo,
        newEvidence,
        newVerificationStatus,
        userId
      ]
    );

    const updatedUser = updateResult.rows[0];
    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile
};

