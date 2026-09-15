const { pool } = require("../config/db");

// Helper function to sanitize buyer record based on public contact consent & user role
const sanitizeBuyerRecord = (buyer, isAdmin = false) => {
  const showContact = Boolean(buyer.show_contact_publicly) || isAdmin;

  return {
    id: buyer.id,
    name: buyer.name,
    business_name: buyer.business_name || buyer.name + " Traders",
    contact_person: buyer.contact_person || buyer.name,
    role: buyer.role,
    location: buyer.location,
    state: buyer.state || buyer.location,
    district: buyer.district || "",
    mandi: buyer.mandi || "",
    commodities: buyer.commodities || "",
    buying_capacity: buyer.buying_capacity || "Not specified",
    official_website: buyer.official_website || null,
    enam_reference: buyer.enam_reference || null,
    udyam_reference: buyer.udyam_reference || null,
    has_enam_ref: Boolean(buyer.enam_reference),
    has_udyam_ref: Boolean(buyer.udyam_reference),
    verification_status: buyer.verification_status || "pending",
    show_contact_publicly: Boolean(buyer.show_contact_publicly),
    phone: showContact ? buyer.phone : null,
    email: showContact ? buyer.email : null,
    created_at: buyer.created_at
  };
};

// ================= GET REGISTERED BUYERS =================
const getRegisteredBuyers = async (req, res) => {
  try {
    const {
      state,
      district,
      mandi,
      commodity,
      verification_status,
      search
    } = req.query;

    const isAdmin = req.user && req.user.role === "admin";

    let queryText = `
      SELECT
        id,
        name,
        email,
        phone,
        location,
        role,
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
        verification_status,
        created_at
      FROM users
      WHERE role = 'buyer'
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (verification_status) {
      queryText += ` AND verification_status = $${paramIndex}`;
      queryParams.push(verification_status.trim());
      paramIndex++;
    } else {
      // By default for public requests, show only verified registered buyers or all if explicitly queried
      queryText += ` AND verification_status = 'verified'`;
    }

    if (state) {
      queryText += ` AND (LOWER(state) LIKE LOWER($${paramIndex}) OR LOWER(location) LIKE LOWER($${paramIndex}))`;
      queryParams.push(`%${state.trim()}%`);
      paramIndex++;
    }

    if (district) {
      queryText += ` AND LOWER(district) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${district.trim()}%`);
      paramIndex++;
    }

    if (mandi) {
      queryText += ` AND LOWER(mandi) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${mandi.trim()}%`);
      paramIndex++;
    }

    if (commodity) {
      queryText += ` AND LOWER(commodities) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${commodity.trim()}%`);
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (
        LOWER(name) LIKE LOWER($${paramIndex}) OR
        LOWER(business_name) LIKE LOWER($${paramIndex}) OR
        LOWER(commodities) LIKE LOWER($${paramIndex}) OR
        LOWER(location) LIKE LOWER($${paramIndex})
      )`;
      queryParams.push(`%${search.trim()}%`);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC`;

    const result = await pool.query(queryText, queryParams);

    const sanitizedBuyers = result.rows.map((b) => sanitizeBuyerRecord(b, isAdmin));

    return res.status(200).json({
      success: true,
      count: sanitizedBuyers.length,
      buyers: sanitizedBuyers
    });
  } catch (error) {
    console.error("Get Registered Buyers Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching buyers",
      error: error.message
    });
  }
};

// ================= GET SINGLE REGISTERED BUYER =================
const getRegisteredBuyerById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && req.user.role === "admin";

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        location,
        role,
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
        verification_status,
        created_at
      FROM users
      WHERE id = $1 AND role = 'buyer'
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registered buyer not found"
      });
    }

    const buyer = sanitizeBuyerRecord(result.rows[0], isAdmin);

    return res.status(200).json({
      success: true,
      buyer
    });
  } catch (error) {
    console.error("Get Registered Buyer By Id Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ================= UPDATE BUYER PROFILE =================
const updateBuyerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only registered buyers can update buyer profiles"
      });
    }

    const {
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

    const result = await pool.query(
      `
      UPDATE users
      SET
        business_name = COALESCE($1, business_name),
        contact_person = COALESCE($2, contact_person),
        state = COALESCE($3, state),
        district = COALESCE($4, district),
        mandi = COALESCE($5, mandi),
        commodities = COALESCE($6, commodities),
        buying_capacity = COALESCE($7, buying_capacity),
        enam_reference = COALESCE($8, enam_reference),
        udyam_reference = COALESCE($9, udyam_reference),
        official_website = COALESCE($10, official_website),
        show_contact_publicly = COALESCE($11, show_contact_publicly),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12 AND role = 'buyer'
      RETURNING
        id, name, email, phone, location, role, business_name, contact_person,
        state, district, mandi, commodities, buying_capacity, enam_reference,
        udyam_reference, official_website, show_contact_publicly, verification_status
      `,
      [
        business_name ? business_name.trim() : null,
        contact_person ? contact_person.trim() : null,
        state ? state.trim() : null,
        district ? district.trim() : null,
        mandi ? mandi.trim() : null,
        commodities ? commodities.trim() : null,
        buying_capacity ? buying_capacity.trim() : null,
        enam_reference ? enam_reference.trim() : null,
        udyam_reference ? udyam_reference.trim() : null,
        official_website ? official_website.trim() : null,
        typeof show_contact_publicly === "boolean" ? show_contact_publicly : null,
        userId
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Buyer profile updated successfully",
      buyer: sanitizeBuyerRecord(result.rows[0], true)
    });
  } catch (error) {
    console.error("Update Buyer Profile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating profile",
      error: error.message
    });
  }
};

// ================= ADMIN: GET PENDING BUYERS =================
const getPendingBuyers = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id, name, email, phone, location, role, business_name, contact_person,
        state, district, mandi, commodities, buying_capacity, enam_reference,
        udyam_reference, official_website, show_contact_publicly, verification_status,
        created_at
      FROM users
      WHERE role = 'buyer' AND (verification_status = 'pending' OR verification_status IS NULL)
      ORDER BY created_at DESC
      `
    );

    const buyers = result.rows.map((b) => sanitizeBuyerRecord(b, true));

    return res.status(200).json({
      success: true,
      count: buyers.length,
      buyers
    });
  } catch (error) {
    console.error("Get Pending Buyers Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ================= ADMIN: VERIFY BUYER =================
const verifyBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        verification_status = 'verified',
        verification_notes = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND role = 'buyer'
      RETURNING id, name, email, role, verification_status
      `,
      [notes || "Verified by admin review of business registration", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Buyer account successfully verified",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Verify Buyer Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ================= ADMIN: REJECT BUYER =================
const rejectBuyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        verification_status = 'rejected',
        verification_notes = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND role = 'buyer'
      RETURNING id, name, email, role, verification_status
      `,
      [notes || "Rejected after administrative review", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Buyer not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Buyer account application rejected",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Reject Buyer Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getRegisteredBuyers,
  getRegisteredBuyerById,
  updateBuyerProfile,
  getPendingBuyers,
  verifyBuyer,
  rejectBuyer
};
