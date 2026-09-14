/**
 * e-NAM (National Agriculture Market) Service
 * 
 * Provides official platform information, trade workflow steps, and portal links
 * for farmers and buyers looking to trade on e-NAM integrated APMCs across India.
 * 
 * Note: Designed to be easily extensible if SFAC / Ministry of Agriculture releases
 * an official public developer API for e-NAM real-time trading data in the future.
 */

const getEnamInformation = async () => {
  return {
    success: true,
    platform: "e-NAM (National Agriculture Market)",
    agency: "Small Farmers Agribusiness Consortium (SFAC), Ministry of Agriculture & Farmers Welfare, Govt of India",
    officialPortal: "https://www.enam.gov.in",
    tradeDashboardUrl: "https://www.enam.gov.in/web/dashboard/trade-data",
    mandiDirectoryUrl: "https://www.enam.gov.in/web/stakeholders-data/mandi",
    farmerRegistrationUrl: "https://www.enam.gov.in/web/stakeholders-data/farmer",
    
    overview: "e-NAM is a pan-India electronic trading portal that networks existing APMC mandis to create a unified national market for agricultural commodities.",
    
    keyFeatures: [
      {
        title: "Pan-India Electronic Bidding",
        description: "Enables buyers across India to bid online for produce listed in e-NAM integrated APMC mandis."
      },
      {
        title: "Scientific Quality Assaying",
        description: "Produce is tested and graded in APMC labs before bidding, ensuring fair price realization based on quality."
      },
      {
        title: "Direct Online Payment (e-Payment)",
        description: "Auction payments are transferred directly into the farmer's verified bank account without intermediary delays."
      },
      {
        title: "Transparent Price Discovery",
        description: "Real-time competitive bidding prevents local price manipulation and ensures maximum returns for farmers."
      }
    ],

    tradeWorkflowSteps: [
      {
        step: 1,
        title: "Mandi Arrival & Gate Entry",
        detail: "Farmer brings harvested produce to an e-NAM onboarded APMC mandi. A gate entry slip with lot number is issued."
      },
      {
        step: 2,
        title: "Quality Testing & Grading",
        detail: "Mandi assayers test produce parameters (moisture, purity, size) and upload quality certificates to the e-NAM portal."
      },
      {
        step: 3,
        title: "Online Bidding & Auction",
        detail: "Traders and buyers nationwide view lot details online and submit competitive bids during the scheduled auction window."
      },
      {
        step: 4,
        title: "Farmer Approval & Agreement",
        detail: "Farmer reviews the highest winning bid. The farmer can accept the offer or choose to re-auction if unsatisfied."
      },
      {
        step: 5,
        title: "Direct e-Payment & Settlement",
        detail: "Upon sale confirmation, payment is deposited directly into the farmer's bank account via online payment gateway."
      }
    ],

    guidance: {
      howToSell: "To participate in e-NAM trading, visit your nearest e-NAM enabled APMC mandi with your Aadhar card, Bank Passbook, and Mobile Number for one-time registration.",
      mandiVerification: "Check whether your local APMC mandi is e-NAM onboarded by searching the official Government e-NAM Mandi Directory.",
      disclaimer: "e-NAM electronic trading is conducted exclusively through licensed APMC mandis and official portal enam.gov.in."
    }
  };
};

module.exports = {
  getEnamInformation
};
