# 🌾 FarmOS — Connecting Every Harvest to Its Best Opportunity

> **FarmOS is a smart agriculture platform that helps farmers make better selling decisions by connecting their harvest with real-time market information, weather intelligence, AI assistance, and future-ready logistics and payment services.**

Farmers often face a simple but important problem:

**"I have harvested my crop. Where should I sell it?"**

FarmOS aims to answer that question using real agricultural market data instead of guesswork.

The platform collects market prices from government agricultural data sources, compares available market opportunities, provides weather information, and uses AI to explain the results in a farmer-friendly way.

---

## 🚜 Project Overview

FarmOS is a full-stack smart agriculture platform designed around the journey of a farmer from **harvest to sale**.

Instead of showing farmers raw market data and expecting them to understand it themselves, FarmOS adds a **decision-support layer** on top of government market information.

### The core idea

```text
Government Agricultural Data
          ↓
      FarmOS
          ↓
 Market Comparison
          ↓
 Opportunity Scoring
          ↓
 Best Available Market
          ↓
 Farmer Decision
FarmOS does not simply display prices.

It attempts to answer:

What is the current market price?
Which markets have better prices?
What is the estimated gross value of my harvest?
Which market currently appears to be the best opportunity?
What weather conditions should I consider?
Can AI explain the recommendation in simple language?
How can the platform eventually connect selling, logistics and payments?
🎯 Problem Statement

Agricultural markets can be difficult for individual farmers to navigate.

A farmer may know:

what crop they harvested,
how much they harvested,
and approximately where they are located,

but may not know:

which nearby market offers a better price,
how different markets compare,
what the current market situation is,
how weather could affect their decision,
or where to start when looking for a buyer.

Traditional solutions often expose data without converting it into an actionable decision.

FarmOS addresses this gap.

Instead of:

Raw Market Data → Farmer

FarmOS provides:

Raw Market Data
       ↓
Data Processing
       ↓
Market Comparison
       ↓
Opportunity Score
       ↓
Recommendation
       ↓
Farmer
💡 Our Solution

FarmOS combines multiple services into a single agriculture-focused platform.

Current platform capabilities
👨‍🌾 Farmer and buyer accounts
🔐 Authentication using JWT
🌾 Harvest management
📊 Government mandi price data
🏪 Market comparison
🧠 Market opportunity scoring
🌦️ Weather information
🤖 AI agriculture assistant
🇮🇳 e-NAM information integration
📦 Order management
👨‍💼 Admin functionality
📱 Responsive web interface
🔥 Core Innovation

The central innovation of FarmOS is the Market Opportunity Engine.

Government APIs provide agricultural market data, but raw data alone does not tell a farmer what to do.

FarmOS processes the available market records and creates a decision-support layer.

Example

Suppose a farmer has:

Crop: Potato
Quantity: 500 kg
Location: West Bengal

FarmOS can:

Retrieve matching potato market records.
Compare modal prices.
Calculate estimated gross value.
Calculate an opportunity score.
Rank markets.
Recommend the strongest currently available market opportunity.
Explain the recommendation through the AI assistant.
Important

FarmOS provides a recommendation, not a guaranteed profit prediction.

Actual farmer returns can depend on:

transportation cost,
market fees,
quality,
quantity,
buyer demand,
arrival volume,
negotiation,
weather,
and other real-world factors.
🏗️ System Architecture
🌱 Farmer Journey
🧠 Market Opportunity Engine
📊 Market Opportunity Calculation

FarmOS currently uses available government market records to create an opportunity score.

The current MVP scoring model considers:

1. Price Ratio Score

The market's modal price is compared against the highest modal price found in the relevant dataset.

The price component contributes up to 70 points.

2. Price Range Consistency

The relationship between minimum and maximum prices is used as an additional indicator.

This component contributes up to 30 points.

Therefore:

Opportunity Score =
    Price Ratio Component
    +
    Price Range Consistency Component

Maximum:

100 points
Estimated Gross Value

The farmer's quantity is converted into quintals.

1 quintal = 100 kg

Then:

Estimated Gross Value =
    Quantity in Quintals × Modal Price
Example

For:

Quantity = 500 kg
Modal Price = ₹1,050 / quintal

Quantity in quintals:

500 / 100 = 5 quintals

Estimated gross value:

5 × ₹1,050 = ₹5,250

This is an estimated gross value, not the farmer's final profit.

📡 Government Market Data

FarmOS uses the Government of India's open agricultural market data through:

data.gov.in / Agmarknet

The dataset provides information such as:

State
District
Market
Commodity
Variety
Grade
Arrival Date
Minimum Price
Maximum Price
Modal Price

Prices are provided in:

₹ per quintal

FarmOS uses this information as the foundation for its market comparison and opportunity engine.

🏪 Market Comparison

FarmOS allows users to compare available market opportunities.

The platform can display information including:

Information	Purpose
State	Market location
District	Regional identification
Market	Mandi / market
Commodity	Crop
Variety	Crop variety
Grade	Quality grade
Arrival Date	Data date
Minimum Price	Lowest recorded price
Maximum Price	Highest recorded price
Modal Price	Representative market price
Opportunity Score	FarmOS comparison indicator

Some information such as exact transport cost, distance, traded quantity, or buyer-specific data may not be available from the current public API.

FarmOS therefore does not invent missing values.

🌦️ Weather Intelligence

FarmOS integrates weather information using the Open-Meteo API.

The backend retrieves:

Current temperature
Apparent temperature
Relative humidity
Precipitation
Rain
Weather condition
Wind speed
Daily minimum temperature
Daily maximum temperature
Daily precipitation
Daily weather forecast

The weather service also implements:

In-memory caching
15-minute cache lifetime
Graceful handling of upstream errors
Fallback to cached data when available
Validation of latitude and longitude
Handling of upstream HTTP errors

This reduces unnecessary external requests and improves reliability.

🤖 FarmOS AI Assistant

FarmOS includes an AI-powered agriculture assistant using Google Gemini through the backend.

The assistant is designed to help users understand agricultural information in natural language.

Example questions
What is the potato price in West Bengal?

What is the weather in Kolkata today?

What fertilizer is good for potatoes?

I have 500 kg potato in West Bengal. Where should I sell?
🧠 Context-Aware AI

The chatbot is not designed as a completely isolated generic chatbot.

FarmOS detects the type of user request.

Current intent categories include:

Market
Weather
General Agriculture
Opportunity

For relevant requests, FarmOS retrieves real application data and provides that context to Gemini.

AI Context Flow

This allows the AI assistant to explain FarmOS data rather than relying only on general model knowledge.

🇮🇳 e-NAM Integration

FarmOS also provides information related to e-NAM (National Agriculture Market).

The platform links users to official e-NAM resources and provides information about:

e-NAM
Trade processes
Mandi information
Farmer participation
Market-related resources
Official government agricultural market ecosystem

FarmOS does not claim access to private buyer information or undocumented e-NAM APIs.

Official e-NAM portal:

https://enam.gov.in/

📦 Order Management

FarmOS includes basic order functionality for connecting farmers and buyers.

Current functionality includes:

Creating orders
Viewing farmer orders
Viewing incoming buyer orders
Updating order status
Role-based access

The order system provides the foundation for future marketplace functionality.

🔐 Authentication & Authorization

FarmOS uses:

JWT authentication
Password hashing with bcryptjs
Authentication middleware
Role-based authorization

Supported user roles include:

Farmer
Buyer
Admin

Authentication flow:

Passwords are not stored as plain text.

🗄️ Database

FarmOS uses:

PostgreSQL

with:

Neon

as the cloud PostgreSQL provider.

The database is used for application data such as:

Users
Authentication-related information
Harvest records
Orders
Application entities

External government market data is retrieved through the market API rather than being treated as FarmOS-owned market data.

⚙️ Backend Architecture

The backend is built using:

Node.js
Express
PostgreSQL
JWT
bcryptjs
CORS
Swagger
dotenv

The backend follows a controller/service/route structure.

Conceptually:

Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Database / External API
   ↓
Response
🌐 Frontend Architecture

The frontend is built using:

React
Vite
Axios

The frontend communicates with the backend through REST APIs.

Architecture:

React Components
      ↓
Pages
      ↓
API Modules
      ↓
FarmOS Backend

The frontend does not contain backend secrets.

📁 Project Structure
FarmOs/
│
├── backend/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── harvestController.js
│   │   ├── orderController.js
│   │   ├── marketController.js
│   │   ├── weatherController.js
│   │   ├── chatController.js
│   │   ├── opportunityController.js
│   │   └── enamController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── harvestRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── weatherRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── opportunityRoutes.js
│   │   └── enamRoutes.js
│   │
│   ├── services/
│   │   ├── marketService.js
│   │   ├── weatherService.js
│   │   ├── chatService.js
│   │   ├── opportunityService.js
│   │   └── enamService.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
🔌 API Endpoints
Authentication
Register
POST /api/auth/register
Login
POST /api/auth/login
Profile
GET /api/auth/profile
🌾 Harvest API

FarmOS provides harvest management endpoints through:

/api/harvests

These endpoints support the farmer's harvest records.

📦 Order API
Create Order
POST /api/orders
Farmer Orders
GET /api/orders/my-orders
Incoming Orders
GET /api/orders/incoming
Update Order Status
PUT /api/orders/:id/status
📊 Market API
GET /api/market/prices

Example:

GET /api/market/prices?state=West%20Bengal&commodity=Potato&limit=5

The endpoint retrieves current available market records from the government agricultural data source.

🌦️ Weather API
GET /api/weather

Example:

GET /api/weather?lat=22.5726&lon=88.3639
🏆 Opportunity API
GET /api/opportunities/compare

The endpoint compares relevant market opportunities and calculates the FarmOS opportunity score.

🤖 AI Chat API
POST /api/chat

Example request:

{
  "message": "I have 500 kg potato in West Bengal. Where should I sell?"
}
🇮🇳 e-NAM API
GET /api/enam/info

This provides official e-NAM-related information and resources used by the platform.

📚 API Documentation

FarmOS backend includes Swagger/OpenAPI documentation.

Swagger is used to make the backend APIs easier to inspect and test during development.

🛠️ Technology Stack
Frontend
Technology	Purpose
React	User interface
Vite	Frontend build tool
Axios	API communication
JavaScript	Application development
Backend
Technology	Purpose
Node.js	Runtime
Express	REST API
PostgreSQL	Database
Neon	Cloud database
JWT	Authentication
bcryptjs	Password hashing
Swagger	API documentation
dotenv	Environment configuration
External Services
Service	Purpose
data.gov.in / Agmarknet	Government market prices
Open-Meteo	Weather information
Google Gemini	AI assistant
e-NAM	National Agriculture Market information
🚀 Running FarmOS Locally
1. Clone the repository
git clone https://github.com/sujitkr268/FarmOs.git
cd FarmOs
⚙️ Backend Setup

Go to the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file.

Example:

DATABASE_URL=your_postgresql_connection_string

DATA_GOV_API_KEY=your_data_gov_api_key

GEMINI_API_KEY=your_gemini_api_key

JWT_SECRET=your_jwt_secret

Start the backend:

npm start

For development:

npm run dev

The backend runs locally on:

http://localhost:5000
🌐 Frontend Setup

Open another terminal.

cd frontend

Install dependencies:

npm install

Create the frontend environment file:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

The frontend runs locally through Vite.

🔑 Environment Variables

Backend secrets must remain on the backend.

Backend
DATABASE_URL=
DATA_GOV_API_KEY=
GEMINI_API_KEY=
JWT_SECRET=
Frontend
VITE_API_URL=

Never commit real API keys or database credentials to GitHub.

The .env file should remain excluded through .gitignore.

☁️ Deployment Architecture

FarmOS uses a separated deployment architecture.

Deployment components
Frontend → Vercel
Backend → Render
Database → Neon

External services:

Market Data → data.gov.in / Agmarknet
Weather → Open-Meteo
AI → Google Gemini
e-NAM → Official e-NAM resources
🔒 Security Principles

FarmOS follows several basic security practices:

Password hashing
JWT authentication
Protected API routes
Role-based access
Environment variables for secrets
Backend-only external API keys
Input validation
CORS configuration

The system is designed so sensitive API credentials are not exposed to the frontend.

🧪 Testing

FarmOS APIs can be tested using tools such as:

Browser
Postman
Hoppscotch
Swagger UI

Examples of tested functionality include:

Authentication
Market prices
Weather
AI chatbot
Market opportunity comparison
e-NAM information
Frontend production build
⚠️ Current Limitations

FarmOS is currently an MVP / prototype and should not be interpreted as a complete commercial agricultural marketplace.

Current limitations include:
Exact transport costs are not currently calculated from live logistics providers.
Exact distance may not be available for every market.
Buyer-specific private information is not exposed.
e-NAM private trader data is not assumed without an official public API.
Market recommendations are based on currently available public data.
Opportunity scores are decision-support indicators, not guaranteed profit predictions.
Weather information depends on the external weather service.
Market information depends on government data availability.
The current opportunity model can be improved with additional real-world factors.
Payment processing is not currently implemented.
🔮 Future Scope

FarmOS is designed to evolve from a decision-support platform into a more complete agricultural commerce ecosystem.

The following features are planned future features and are NOT currently implemented.

💳 1. Payment Gateway

Future versions can integrate secure payment providers.

Potential capabilities:

Farmer
   ↓
Order
   ↓
Payment Gateway
   ↓
Payment Confirmation
   ↓
Buyer

Possible functionality:

Online payments
Payment confirmation
Transaction history
Refund handling
Payment status tracking
Digital invoices
🚚 2. Smart Logistics

A future logistics module could connect farmers with transportation providers.

The system could consider:

Distance
Vehicle availability
Transport cost
Crop quantity
Delivery time
Market location

Future flow:

🔔 3. Notifications

Future versions could provide:

Price alerts
Weather alerts
Order updates
Payment notifications
Delivery updates
Market opportunity alerts

Example:

Potato price increased
        ↓
FarmOS detects change
        ↓
Farmer receives notification
📈 4. Advanced Analytics

FarmOS could introduce dashboards for:

Farmers
Historical selling prices
Crop performance
Revenue trends
Market trends
Seasonal price patterns
Buyers
Purchase history
Supplier trends
Market demand
Administrators
Platform activity
Market usage
Crop trends
Regional activity
🧠 5. Advanced AI Decision Support

Future AI capabilities could include:

Crop price forecasting
Demand prediction
Crop recommendation
Personalized selling strategies
Weather-aware recommendations
Harvest timing suggestions
Risk analysis
Natural-language market analysis

Future AI architecture:

📍 6. Distance & Transport Optimization

Future versions can use geolocation and mapping services to calculate:

Farm → Market Distance

and:

Estimated Transport Cost

Then the opportunity engine could move from:

Best Price

towards:

Best Estimated Net Return

For example:

Market A
High Price
+
High Transport Cost

vs.

Market B
Slightly Lower Price
+
Much Lower Transport Cost

The platform could identify which option is financially stronger.

💰 7. Net Return Optimization

The current MVP calculates estimated gross value.

Future versions can calculate:

Estimated Net Return
=
Gross Revenue
− Transport Cost
− Market Fees
− Handling Cost
− Other Applicable Costs

This would make the opportunity engine substantially more useful for real-world decisions.

🤝 8. Farmer-Buyer Marketplace

Future FarmOS versions can evolve the current order functionality into a full marketplace.

Potential features:

Buyer discovery
Farmer listings
Buyer requirements
Crop quantity matching
Quality matching
Offers
Negotiation
Orders
Payments
Delivery tracking
📊 9. Demand-Supply Intelligence

Future versions can combine market data with historical trends to estimate:

Market demand
Supply pressure
Seasonal changes
Price trends
Crop demand

This can help farmers make decisions before harvest rather than only after harvesting.

🌍 10. Multi-State Expansion

FarmOS can be expanded across India.

The architecture is designed so that market data can be filtered by:

State
District
Market
Commodity
Variety
Grade

This makes it possible to expand the platform beyond a single state.

🔮 Future-Proof Architecture

The long-term architecture can evolve as follows:

This modular architecture allows new services to be introduced without rebuilding the entire platform.

🌾 Vision

FarmOS aims to move agricultural decision-making from:

Guesswork

towards:

Data → Intelligence → Decision → Action

The long-term vision is:

Harvest
   ↓
Market Intelligence
   ↓
Best Opportunity
   ↓
Buyer
   ↓
Payment
   ↓
Logistics
   ↓
Delivery
   ↓
Farmer
🌱 Why FarmOS?

FarmOS focuses on a practical problem rather than simply collecting agricultural information.

The platform attempts to connect multiple stages of the agricultural selling journey:

🌾 Harvest
   ↓
📊 Market Data
   ↓
⚖️ Comparison
   ↓
🏆 Opportunity
   ↓
🤖 AI Explanation
   ↓
🛒 Buyer
   ↓
📦 Order

Future versions can extend this journey with:

💳 Payment
🚚 Logistics
🔔 Notifications
📈 Analytics
🧠 Advanced AI
🌍 Social Impact

FarmOS is designed around the idea that better access to information can improve agricultural decision-making.

Potential benefits include:

Better market awareness
Easier comparison of mandi prices
Reduced dependence on guesswork
Faster access to agricultural information
Better understanding of market opportunities
Improved digital access for farmers
Future integration of logistics and payments

The platform does not promise guaranteed income.

Instead, it aims to provide farmers with better information and decision-support tools.

🚀 Current Status
Implemented
 React + Vite frontend
 Node.js + Express backend
 PostgreSQL database
 Neon database deployment
 JWT authentication
 Password hashing
 Farmer / Buyer / Admin roles
 Harvest management
 Order management
 Government mandi market data
 Market price filtering
 Market comparison
 Opportunity scoring
 Estimated gross value calculation
 Weather integration
 Weather caching and fallback handling
 Gemini AI assistant
 Context-aware chatbot
 e-NAM information integration
 Swagger API documentation
 Vercel frontend deployment
 Render backend deployment
Future
 Payment gateway
 Smart logistics
 Transport cost calculation
 Distance optimization
 Notifications
 Advanced analytics
 Price forecasting
 Demand prediction
 Advanced AI recommendations
 Full farmer-buyer marketplace
 Net-return optimization
 Automated market alerts
🏆 Project Vision in One Line

FarmOS connects every harvest to its best available opportunity by turning agricultural data into actionable decisions.

👥 Team

FarmOS is developed as a collaborative project focused on applying modern software engineering, data integration, AI, and agriculture technology to solve real-world farming problems.

📜 Disclaimer

FarmOS is an educational/prototype project and its recommendations are intended for decision support.

Market prices, weather information, availability, transportation costs, and other agricultural conditions can change rapidly.

Users should independently verify important commercial decisions before acting on them.

FarmOS does not guarantee a specific selling price, buyer, profit, or financial outcome.

🌾 FarmOS
Connecting Every Harvest to Its Best Opportunity
🌱 Grow
   ↓
🌾 Harvest
   ↓
📊 Understand
   ↓
⚖️ Compare
   ↓
🏆 Choose
   ↓
🤝 Connect
   ↓
💰 Sell

FarmOS — Turning agricultural data into better decisions.

<img width="1354" height="649" alt="image" src="https://github.com/user-attachments/assets/24fdf748-bb82-4b04-8097-e9bb1ea5786f" />
<img width="1348" height="632" alt="image" src="https://github.com/user-attachments/assets/ae07c389-8d46-4fef-9ab4-088fc14a13e8" />
<img width="1349" height="641" alt="image" src="https://github.com/user-attachments/assets/60a03378-cfe7-4c2f-9742-958ba0ab54d1" />


