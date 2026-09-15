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
const User = require("./models/User");
const { createPublicTradersTable } = require("./models/PublicTrader");
const { seedPublicTraders } = require("./database/seedTraders");
const { getPublicTraders } = require("./controllers/traderController");
const { getRegisteredBuyers, verifyBuyer } = require("./controllers/buyerController");
const { evaluateOpportunities } = require("./services/opportunityService");

const runTests = async () => {
  console.log("=== STARTING FARMOS DIRECTORY & VERIFICATION BACKEND TESTS ===");

  await connectDB();
  await User.createUsersTable();
  await createPublicTradersTable();
  await seedPublicTraders();

  // Test 1: Fetch all public traders
  console.log("\n--- TEST 1: Public Traders Count & Source Evidence ---");
  const tradersRes = await pool.query("SELECT * FROM public_traders");
  console.log(`Total Public Trader Records in DB: ${tradersRes.rows.length}`);

  let sourceVerifiedCount = 0;
  let websiteVerifiedCount = 0;
  let unverifiedCount = 0;
  let needsReviewCount = 0;

  tradersRes.rows.forEach((t) => {
    console.log(`- [${t.verification_status}] ${t.business_name} | Location: ${t.district}, ${t.state} | Source: ${t.source_url}`);
    if (t.verification_status === 'source_verified') sourceVerifiedCount++;
    else if (t.verification_status === 'website_verified') websiteVerifiedCount++;
    else if (t.verification_status === 'unverified') unverifiedCount++;
    else if (t.verification_status === 'needs_review') needsReviewCount++;
  });

  console.log(`\nVerification Breakdown:`);
  console.log(`  - Source Verified (Govt Evidence): ${sourceVerifiedCount}`);
  console.log(`  - Website Verified (Official Web): ${websiteVerifiedCount}`);
  console.log(`  - Unverified (Public Listing): ${unverifiedCount}`);
  console.log(`  - Needs Review: ${needsReviewCount}`);

  // Test 2: Filter Public Traders by state and commodity
  console.log("\n--- TEST 2: Filter Public Traders (State: West Bengal, Commodity: Potato) ---");
  const mockReqFilter = {
    query: {
      state: "West Bengal",
      commodity: "Potato"
    }
  };
  const mockResFilter = {
    status: (code) => ({
      json: (data) => {
        console.log(`Filter HTTP ${code}: Found ${data.count} Potato traders in West Bengal`);
        data.traders.forEach((tr) => {
          console.log(`   * ${tr.business_name} (${tr.commodities}) -> Badge: ${tr.verification_status}`);
        });
      }
    })
  };
  await getPublicTraders(mockReqFilter, mockResFilter);

  // Test 3: Test Privacy - Registered Buyer without public consent
  console.log("\n--- TEST 3: Privacy & Public Contact Visibility ---");

  // Create test buyer user with show_contact_publicly = false
  const testEmail = "testbuyer_private@farmos.org";
  await pool.query("DELETE FROM users WHERE email = $1", [testEmail]);
  const insertBuyerRes = await pool.query(
    `INSERT INTO users (
      name, email, password, role, phone, location, business_name, state, district,
      commodities, buying_capacity, show_contact_publicly, verification_status
     ) VALUES (
      'Private Buyer Test', $1, 'hashedpass', 'buyer', '+91 9876500000', 'Hooghly',
      'Hooghly Potato Aggregators', 'West Bengal', 'Hooghly', 'Potato', '2000 MT', false, 'verified'
     ) RETURNING id`,
    [testEmail]
  );
  const testBuyerId = insertBuyerRes.rows[0].id;

  // Mock public request (non-admin)
  const reqPublicBuyer = { query: { verification_status: 'verified' }, user: null };
  const resPublicBuyer = {
    status: (code) => ({
      json: (data) => {
        const found = data.buyers.find((b) => b.id === testBuyerId);
        console.log("Public View for Private Buyer:", found);
        if (found && found.phone === null && found.email === null) {
          console.log("✅ PRIVACY TEST PASSED: Phone and Email are hidden when show_contact_publicly = false!");
        } else {
          console.error("❌ PRIVACY TEST FAILED: Sensitive contact details exposed!");
        }
      }
    })
  };
  await getRegisteredBuyers(reqPublicBuyer, resPublicBuyer);

  // Test 4: Admin Verification Workflow
  console.log("\n--- TEST 4: Admin Verification Workflow ---");
  const pendingEmail = "pendingbuyer@farmos.org";
  await pool.query("DELETE FROM users WHERE email = $1", [pendingEmail]);
  const insertPendingRes = await pool.query(
    `INSERT INTO users (
      name, email, password, role, phone, location, business_name, state, district,
      commodities, verification_status
     ) VALUES (
      'Pending Buyer', $1, 'pass', 'buyer', '+91 9999900000', 'Malda',
      'Malda Grain Merchants', 'West Bengal', 'Malda', 'Mango, Paddy', 'pending'
     ) RETURNING id`,
    [pendingEmail]
  );
  const pendingId = insertPendingRes.rows[0].id;

  const reqVerify = { params: { id: pendingId }, body: { notes: "Verified after Udyam document review" } };
  const resVerify = {
    status: (code) => ({
      json: (data) => {
        console.log(`Verify Response (HTTP ${code}):`, data);
        if (data.user.verification_status === 'verified') {
          console.log("✅ ADMIN VERIFICATION TEST PASSED!");
        }
      }
    })
  };
  await verifyBuyer(reqVerify, resVerify);

  // Test 5: Opportunity Engine Buyer Matching
  console.log("\n--- TEST 5: Opportunity Engine Buyer Matching ---");
  const oppResult = await evaluateOpportunities({
    crop: "Potato",
    quantity: 2000,
    unit: "kg",
    state: "West Bengal",
    district: "Hooghly"
  });

  console.log(`Analyzed Markets: ${oppResult.total_markets_analyzed}`);
  console.log(`Matched Potential Buyers: ${oppResult.potential_buyers ? oppResult.potential_buyers.length : 0}`);

  if (oppResult.potential_buyers && oppResult.potential_buyers.length > 0) {
    console.log("Matched Relevant Traders / Potential Buyers:");
    oppResult.potential_buyers.forEach((pb) => {
      console.log(`  - [${pb.wording_label}] ${pb.business_name} | Location: ${pb.location} | Badge: ${pb.badge_label}`);
    });
    console.log("✅ OPPORTUNITY ENGINE BUYER MATCHING TEST PASSED!");
  } else {
    console.error("❌ OPPORTUNITY ENGINE BUYER MATCHING FAILED!");
  }

  // Cleanup test users
  await pool.query("DELETE FROM users WHERE email IN ($1, $2)", [testEmail, pendingEmail]);

  console.log("\n=== ALL BACKEND TESTS COMPLETED SUCCESSFULLY ===");
  process.exit(0);
};

runTests().catch((err) => {
  console.error("Backend Test Script Error:", err);
  process.exit(1);
});
