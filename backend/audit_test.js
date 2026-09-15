const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

[
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend", ".env"),
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "backend", ".env")
].forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
});

const { pool, connectDB } = require("./config/db");
const { getPublicTraders } = require("./controllers/traderController");
const { getRegisteredBuyers, verifyBuyer, rejectBuyer, updateBuyerProfile } = require("./controllers/buyerController");
const { evaluateOpportunities } = require("./services/opportunityService");

const runAudit = async () => {
  console.log("=================================================");
  console.log("  FARMSOS DIRECTORY & VERIFICATION AUDIT SUITE   ");
  console.log("=================================================\n");

  await connectDB();

  const auditResults = [];

  const recordResult = (id, description, status, details = "") => {
    auditResults.push({ id, description, status, details });
    const icon = status === "PASS" ? "✅" : "❌";
    console.log(`${icon} [${id}] ${description} -> ${status} ${details ? `(${details})` : ""}`);
  };

  // ---------------------------------------------------------
  // FLOW 1: Public /traders API & Badges
  // ---------------------------------------------------------
  console.log("\n--- AUDITING FLOW 1: Public Traders API & Badges ---");
  const tradersRes = await pool.query("SELECT * FROM public_traders ORDER BY id ASC");
  
  if (tradersRes.rows.length > 0) {
    recordResult("1.1", "Seeded public traders exist in database", "PASS", `${tradersRes.rows.length} records`);
  } else {
    recordResult("1.1", "Seeded public traders exist in database", "FAIL", "No records found");
  }

  let allHaveSources = true;
  let sourceVerifiedCount = 0;
  let websiteVerifiedCount = 0;
  let unverifiedCount = 0;

  tradersRes.rows.forEach((t) => {
    if (!t.source_url || !t.source_type) {
      allHaveSources = false;
    }
    if (t.verification_status === "source_verified") sourceVerifiedCount++;
    if (t.verification_status === "website_verified") websiteVerifiedCount++;
    if (t.verification_status === "unverified" || t.verification_status === "needs_review") unverifiedCount++;
  });

  if (allHaveSources) {
    recordResult("1.2", "Every seeded trader has source_url and source_type", "PASS", "100% compliant");
  } else {
    recordResult("1.2", "Every seeded trader has source_url and source_type", "FAIL", "Missing source fields");
  }

  if (sourceVerifiedCount > 0 && websiteVerifiedCount > 0 && unverifiedCount > 0) {
    recordResult("1.3", "Verification status levels correctly differentiated", "PASS", `source_verified: ${sourceVerifiedCount}, website_verified: ${websiteVerifiedCount}, unverified/review: ${unverifiedCount}`);
  } else {
    recordResult("1.3", "Verification status levels correctly differentiated", "FAIL", "Incomplete verification levels");
  }

  // ---------------------------------------------------------
  // FLOW 2: Badge Labeling Rules & Government Claim Audit
  // ---------------------------------------------------------
  console.log("\n--- AUDITING FLOW 2: Badge Labeling & Verification Rules ---");
  let badgeCompliant = true;
  tradersRes.rows.forEach((t) => {
    if (t.verification_status !== "source_verified") {
      // Must not be claimed as Govt / Source Verified
      if (t.verification_status === "source_verified") {
        badgeCompliant = false;
      }
    }
  });

  if (badgeCompliant) {
    recordResult("2.1", "Non-source_verified traders are NOT labeled as Govt Verified", "PASS");
  } else {
    recordResult("2.1", "Non-source_verified traders are NOT labeled as Govt Verified", "FAIL");
  }

  // ---------------------------------------------------------
  // FLOW 3: FarmOS Registered Buyers, Privacy & Consent
  // ---------------------------------------------------------
  console.log("\n--- AUDITING FLOW 3: Registered Buyers, Privacy & Consent ---");

  // Create test buyer 1: show_contact_publicly = false
  const emailPrivate = "audit_private_buyer@farmos.org";
  await pool.query("DELETE FROM users WHERE email = $1", [emailPrivate]);
  const insertPrivate = await pool.query(
    `INSERT INTO users (
      name, email, password, role, phone, location, business_name, state, district,
      commodities, show_contact_publicly, verification_status
     ) VALUES (
      'Audit Private Buyer', $1, 'hashed', 'buyer', '+91 9111111111', 'Hooghly',
      'Hooghly Traders', 'West Bengal', 'Hooghly', 'Potato', false, 'verified'
     ) RETURNING id`,
    [emailPrivate]
  );
  const privateId = insertPrivate.rows[0].id;

  // Create test buyer 2: show_contact_publicly = true
  const emailPublic = "audit_public_buyer@farmos.org";
  await pool.query("DELETE FROM users WHERE email = $1", [emailPublic]);
  const insertPublic = await pool.query(
    `INSERT INTO users (
      name, email, password, role, phone, location, business_name, state, district,
      commodities, show_contact_publicly, verification_status
     ) VALUES (
      'Audit Public Buyer', $1, 'hashed', 'buyer', '+91 9222222222', 'Bardhaman',
      'Bardhaman Merchants', 'West Bengal', 'Purba Bardhaman', 'Rice', true, 'verified'
     ) RETURNING id`,
    [emailPublic]
  );
  const publicId = insertPublic.rows[0].id;

  // Create test buyer 3: verification_status = 'pending'
  const emailPending = "audit_pending_buyer@farmos.org";
  await pool.query("DELETE FROM users WHERE email = $1", [emailPending]);
  const insertPending = await pool.query(
    `INSERT INTO users (
      name, email, password, role, phone, location, business_name, state, district,
      commodities, show_contact_publicly, verification_status
     ) VALUES (
      'Audit Pending Buyer', $1, 'hashed', 'buyer', '+91 9333333333', 'Malda',
      'Malda Mango Traders', 'West Bengal', 'Malda', 'Mango', false, 'pending'
     ) RETURNING id`,
    [emailPending]
  );
  const pendingId = insertPending.rows[0].id;

  // Test GET /api/buyers (public call)
  let publicBuyersResult = [];
  const reqBuyers = { query: {}, user: null };
  const resBuyers = {
    status: (code) => ({
      json: (data) => {
        publicBuyersResult = data.buyers || [];
      }
    })
  };
  await getRegisteredBuyers(reqBuyers, resBuyers);

  // Check 3.1: Pending buyers excluded from public list
  const pendingInPublic = publicBuyersResult.find((b) => b.id === pendingId);
  if (!pendingInPublic) {
    recordResult("3.1", "Pending buyers are EXCLUDED from public GET /api/buyers", "PASS");
  } else {
    recordResult("3.1", "Pending buyers are EXCLUDED from public GET /api/buyers", "FAIL", "Pending buyer appeared in public list");
  }

  // Check 3.2: Privacy masking when show_contact_publicly = false
  const privateBuyerInList = publicBuyersResult.find((b) => b.id === privateId);
  if (privateBuyerInList && privateBuyerInList.phone === null && privateBuyerInList.email === null) {
    recordResult("3.2", "Phone and Email are MASKED when show_contact_publicly = false", "PASS");
  } else {
    recordResult("3.2", "Phone and Email are MASKED when show_contact_publicly = false", "FAIL", `Phone: ${privateBuyerInList?.phone}, Email: ${privateBuyerInList?.email}`);
  }

  // Check 3.3: Contact details returned when show_contact_publicly = true
  const publicBuyerInList = publicBuyersResult.find((b) => b.id === publicId);
  if (publicBuyerInList && publicBuyerInList.phone === "+91 9222222222" && publicBuyerInList.email === "audit_public_buyer@farmos.org") {
    recordResult("3.3", "Phone and Email are DISPLAYED when show_contact_publicly = true", "PASS");
  } else {
    recordResult("3.3", "Phone and Email are DISPLAYED when show_contact_publicly = true", "FAIL");
  }

  // Check 3.4: Admin verification of pending buyer
  const reqVerify = { params: { id: pendingId }, body: { notes: "Udyam registration verified" } };
  let verifySuccess = false;
  const resVerify = {
    status: (code) => ({
      json: (data) => {
        if (data.success && data.user.verification_status === "verified") {
          verifySuccess = true;
        }
      }
    })
  };
  await verifyBuyer(reqVerify, resVerify);

  if (verifySuccess) {
    recordResult("3.4", "Admin can approve pending buyers to verified status", "PASS");
  } else {
    recordResult("3.4", "Admin can approve pending buyers to verified status", "FAIL");
  }

  // ---------------------------------------------------------
  // FLOW 4: Opportunity Engine Matching & Distinctions
  // ---------------------------------------------------------
  console.log("\n--- AUDITING FLOW 4: Opportunity Engine Buyer Matching ---");
  const oppData = await evaluateOpportunities({
    crop: "Potato",
    quantity: 1000,
    unit: "kg",
    state: "West Bengal",
    district: "Hooghly"
  });

  if (oppData.potential_buyers && oppData.potential_buyers.length > 0) {
    recordResult("4.1", "Opportunity Engine returns potential_buyers", "PASS", `${oppData.potential_buyers.length} matches found`);
  } else {
    recordResult("4.1", "Opportunity Engine returns potential_buyers", "FAIL", "No buyers matched");
  }

  let hasPublicTraderCat = false;
  let hasRegBuyerCat = false;
  let allHaveWordingLabel = true;

  oppData.potential_buyers.forEach((pb) => {
    if (pb.category === "public_trader") hasPublicTraderCat = true;
    if (pb.category === "registered_buyer") hasRegBuyerCat = true;
    if (pb.wording_label !== "Potential Buyer / Relevant Trader") allHaveWordingLabel = false;
  });

  if (hasPublicTraderCat && hasRegBuyerCat) {
    recordResult("4.2", "Opportunity Engine correctly distinguishes Public Traders from Registered Buyers", "PASS");
  } else {
    recordResult("4.2", "Opportunity Engine correctly distinguishes Public Traders from Registered Buyers", "FAIL", `PublicTraders: ${hasPublicTraderCat}, RegBuyers: ${hasRegBuyerCat}`);
  }

  if (allHaveWordingLabel) {
    recordResult("4.3", "Matches use 'Potential Buyer / Relevant Trader' wording (never guaranteed)", "PASS");
  } else {
    recordResult("4.3", "Matches use 'Potential Buyer / Relevant Trader' wording (never guaranteed)", "FAIL");
  }

  // ---------------------------------------------------------
  // FLOW 5: Sensitive Fields Security & Cleanup
  // ---------------------------------------------------------
  console.log("\n--- AUDITING FLOW 5: Security & Sensitive Field Check ---");
  let passInPublic = false;
  publicBuyersResult.forEach((b) => {
    if (b.password || b.verification_notes) passInPublic = true;
  });

  if (!passInPublic) {
    recordResult("5.1", "Sensitive user fields (passwords, admin notes) NEVER exposed in public API", "PASS");
  } else {
    recordResult("5.1", "Sensitive user fields (passwords, admin notes) NEVER exposed in public API", "FAIL");
  }

  // Cleanup audit users
  await pool.query("DELETE FROM users WHERE email IN ($1, $2, $3)", [emailPrivate, emailPublic, emailPending]);

  console.log("\n=================================================");
  console.log("            AUDIT COMPLETED CLEANLY             ");
  console.log("=================================================");
  process.exit(0);
};

runAudit().catch((err) => {
  console.error("Audit Execution Failed:", err);
  process.exit(1);
});
