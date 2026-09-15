const { pool } = require("../config/db");

// ================= GET PUBLIC TRADERS =================
const getPublicTraders = async (req, res) => {
  try {
    const {
      state,
      district,
      mandi,
      commodity,
      business_type,
      verification_status,
      search
    } = req.query;

    let queryText = `
      SELECT
        id,
        business_name,
        business_type,
        state,
        district,
        city,
        mandi,
        address,
        commodities,
        buying_capacity,
        official_website,
        official_contact_url,
        public_phone,
        public_email,
        registration_type,
        verification_source,
        source_url,
        source_type,
        verification_status,
        last_verified,
        created_at
      FROM public_traders
      WHERE 1=1
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (state) {
      queryText += ` AND LOWER(state) LIKE LOWER($${paramIndex})`;
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

    if (business_type) {
      queryText += ` AND LOWER(business_type) LIKE LOWER($${paramIndex})`;
      queryParams.push(`%${business_type.trim()}%`);
      paramIndex++;
    }

    if (verification_status) {
      queryText += ` AND verification_status = $${paramIndex}`;
      queryParams.push(verification_status.trim());
      paramIndex++;
    }

    if (search) {
      queryText += ` AND (
        LOWER(business_name) LIKE LOWER($${paramIndex}) OR
        LOWER(commodities) LIKE LOWER($${paramIndex}) OR
        LOWER(district) LIKE LOWER($${paramIndex}) OR
        LOWER(mandi) LIKE LOWER($${paramIndex})
      )`;
      queryParams.push(`%${search.trim()}%`);
      paramIndex++;
    }

    queryText += ` ORDER BY CASE WHEN verification_status = 'source_verified' THEN 1 WHEN verification_status = 'website_verified' THEN 2 ELSE 3 END, created_at DESC`;

    const result = await pool.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      traders: result.rows
    });
  } catch (error) {
    console.error("Get Public Traders Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching public trader directory",
      error: error.message
    });
  }
};

// ================= GET SINGLE PUBLIC TRADER =================
const getPublicTraderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        business_name,
        business_type,
        state,
        district,
        city,
        mandi,
        address,
        commodities,
        buying_capacity,
        official_website,
        official_contact_url,
        public_phone,
        public_email,
        registration_type,
        verification_source,
        source_url,
        source_type,
        verification_status,
        last_verified,
        created_at
      FROM public_traders
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Public trader record not found"
      });
    }

    return res.status(200).json({
      success: true,
      trader: result.rows[0]
    });
  } catch (error) {
    console.error("Get Single Public Trader Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// ================= ADMIN: CREATE PUBLIC TRADER =================
const createPublicTrader = async (req, res) => {
  try {
    const {
      business_name,
      business_type,
      state,
      district,
      city,
      mandi,
      address,
      commodities,
      buying_capacity,
      official_website,
      official_contact_url,
      public_phone,
      public_email,
      registration_type,
      registration_reference,
      verification_source,
      source_url,
      source_type,
      verification_status
    } = req.body;

    if (!business_name || !state || !district || !commodities || !source_url || !source_type || !verification_source) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: business_name, state, district, commodities, source_url, source_type, verification_source."
      });
    }

    const validStatuses = ["source_verified", "website_verified", "unverified", "needs_review"];
    const status = validStatuses.includes(verification_status) ? verification_status : "source_verified";

    const result = await pool.query(
      `
      INSERT INTO public_traders (
        business_name,
        business_type,
        state,
        district,
        city,
        mandi,
        address,
        commodities,
        buying_capacity,
        official_website,
        official_contact_url,
        public_phone,
        public_email,
        registration_type,
        registration_reference,
        verification_source,
        source_url,
        source_type,
        verification_status,
        last_verified
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, CURRENT_DATE)
      RETURNING *
      `,
      [
        business_name.trim(),
        (business_type || "Wholesaler").trim(),
        state.trim(),
        district.trim(),
        city ? city.trim() : null,
        mandi ? mandi.trim() : null,
        address ? address.trim() : null,
        commodities.trim(),
        buying_capacity ? buying_capacity.trim() : null,
        official_website ? official_website.trim() : null,
        official_contact_url ? official_contact_url.trim() : null,
        public_phone ? public_phone.trim() : null,
        public_email ? public_email.trim() : null,
        registration_type ? registration_type.trim() : null,
        registration_reference ? registration_reference.trim() : null,
        verification_source.trim(),
        source_url.trim(),
        source_type.trim(),
        status
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Public trader record created successfully",
      trader: result.rows[0]
    });
  } catch (error) {
    console.error("Create Public Trader Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error creating trader record",
      error: error.message
    });
  }
};

// ================= ADMIN: UPDATE PUBLIC TRADER =================
const updatePublicTrader = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      business_name,
      business_type,
      state,
      district,
      city,
      mandi,
      address,
      commodities,
      buying_capacity,
      official_website,
      official_contact_url,
      public_phone,
      public_email,
      registration_type,
      registration_reference,
      verification_source,
      source_url,
      source_type,
      verification_status
    } = req.body;

    const existing = await pool.query("SELECT * FROM public_traders WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trader record not found"
      });
    }

    const current = existing.rows[0];

    const updatedResult = await pool.query(
      `
      UPDATE public_traders
      SET
        business_name = $1,
        business_type = $2,
        state = $3,
        district = $4,
        city = $5,
        mandi = $6,
        address = $7,
        commodities = $8,
        buying_capacity = $9,
        official_website = $10,
        official_contact_url = $11,
        public_phone = $12,
        public_email = $13,
        registration_type = $14,
        registration_reference = $15,
        verification_source = $16,
        source_url = $17,
        source_type = $18,
        verification_status = $19,
        last_verified = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $20
      RETURNING *
      `,
      [
        business_name ? business_name.trim() : current.business_name,
        business_type ? business_type.trim() : current.business_type,
        state ? state.trim() : current.state,
        district ? district.trim() : current.district,
        city !== undefined ? city : current.city,
        mandi !== undefined ? mandi : current.mandi,
        address !== undefined ? address : current.address,
        commodities ? commodities.trim() : current.commodities,
        buying_capacity !== undefined ? buying_capacity : current.buying_capacity,
        official_website !== undefined ? official_website : current.official_website,
        official_contact_url !== undefined ? official_contact_url : current.official_contact_url,
        public_phone !== undefined ? public_phone : current.public_phone,
        public_email !== undefined ? public_email : current.public_email,
        registration_type !== undefined ? registration_type : current.registration_type,
        registration_reference !== undefined ? registration_reference : current.registration_reference,
        verification_source ? verification_source.trim() : current.verification_source,
        source_url ? source_url.trim() : current.source_url,
        source_type ? source_type.trim() : current.source_type,
        verification_status ? verification_status.trim() : current.verification_status,
        id
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Trader record updated successfully",
      trader: updatedResult.rows[0]
    });
  } catch (error) {
    console.error("Update Public Trader Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating trader record",
      error: error.message
    });
  }
};

// ================= ADMIN: DELETE PUBLIC TRADER =================
const deletePublicTrader = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM public_traders WHERE id = $1 RETURNING id", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trader record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trader record removed successfully",
      id: result.rows[0].id
    });
  } catch (error) {
    console.error("Delete Public Trader Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error deleting trader record",
      error: error.message
    });
  }
};

module.exports = {
  getPublicTraders,
  getPublicTraderById,
  createPublicTrader,
  updatePublicTrader,
  deletePublicTrader
};
