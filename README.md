FarmOS 🌾
Connecting Every Harvest to Its Best Opportunity
FarmOS is a smart agriculture platform designed to help farmers make better selling decisions by connecting their harvest information with real-time mandi prices, weather information, market opportunities, and buyers.
The goal is simple:
Don't just tell farmers what their crop is worth. Help them understand where and when it may be better to sell it.
🚜 Problem Statement
Farmers often face several challenges after harvesting:
Lack of awareness about prices in different mandis
Difficulty comparing prices between markets
Dependence on local middlemen
Uncertainty about weather conditions
Difficulty finding suitable buyers
No single platform connecting harvest information with market opportunities
Raw government market data can be difficult for ordinary farmers to interpret
FarmOS addresses these problems by combining government market data, weather information, farmer harvest data, buyer/order management, and an AI assistant into one platform.
🎯 Objectives
FarmOS aims to:
Help farmers record their harvest.
Provide current mandi prices.
Compare selling opportunities across markets.
Estimate the gross value of a harvest.
Provide weather information relevant to farming.
Connect farmers and buyers.
Provide an AI assistant for agriculture-related questions.
Integrate information from the e-NAM ecosystem.
Provide a simple interface suitable for users with limited technical knowledge.
🧠 Core Concept
The central idea behind FarmOS is:
Farmer Harvest
      ↓
Crop + Quantity + Location + Quality
      ↓
Government Market Data
      ↓
Market Comparison
      ↓
Opportunity Score
      ↓
Recommended Market
      ↓
Farmer makes the selling decision
FarmOS acts as a decision-support layer.
It does not replace the official government data source.
Instead:
Government API
      ↓
Raw market information
      ↓
       FarmOS
      ↓
Comparison + calculations + explanation
      ↓
Useful decision for farmer
🏗️ System Architecture
                    ┌─────────────────────┐
                    │      Farmer         │
                    │      / Buyer        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FarmOS Frontend   │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   FarmOS Backend     │
                    │ Node.js + Express    │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
       ┌───────────┐    ┌─────────────┐    ┌─────────────┐
       │ PostgreSQL│    │ Government  │    │ Open-Meteo  │
       │   Neon    │    │ Market API  │    │   Weather   │
       └───────────┘    └─────────────┘    └─────────────┘
                               │
                               ▼
                         Agmarknet /
                       data.gov.in data

             ┌─────────────────┼──────────────────┐
             │                 │                  │
             ▼                 ▼                  ▼
          Gemini             e-NAM          Authentication
          AI API             Portal             JWT
💻 Technology Stack
Frontend
React
FarmOS uses React to build the user interface.
React allows the application to be divided into reusable components such as:
Weather cards
Mandi price tables
Market comparison
AI assistant
Navigation
Dashboard components
Harvest forms
Vite
Vite is used as the frontend development and build tool.
It provides:
Fast development server
Fast builds
React integration
Production bundling
The frontend runs locally on:
http://localhost:3000
Axios
Axios is used for communication between the React frontend and FarmOS backend.
Example architecture:
React Component
      ↓
API helper
      ↓
Axios
      ↓
Express Backend
The frontend uses:
VITE_API_URL
to determine the backend API URL.
Local:
http://localhost:5000/api
Production:
https://farmos-df0q.onrender.com/api
⚙️ Backend
Node.js
Node.js provides the runtime environment for the FarmOS backend.
It allows JavaScript to run on the server and handles:
API requests
Authentication
Database operations
External API calls
AI requests
Business logic
Express.js
Express is the backend web framework.
It provides REST API endpoints such as:
/api/auth
/api/harvests
/api/orders
/api/market
/api/weather
/api/chat
/api/opportunities
/api/enam
The backend follows a basic:
Routes
   ↓
Controllers
   ↓
Services
   ↓
Database / External APIs
architecture.
🗄️ Database
PostgreSQL
FarmOS uses PostgreSQL for structured application data.
It is suitable for storing information such as:
Users
Farmer profiles
Buyer profiles
Harvest records
Orders
Other application information
Neon
The PostgreSQL database is hosted using Neon.
Architecture:
FarmOS Backend
      ↓
PostgreSQL Driver
      ↓
Neon PostgreSQL
The database connection is stored through an environment variable rather than being hardcoded.
🔐 Authentication & Security
JWT
FarmOS uses JSON Web Tokens (JWT) for authentication.
Basic flow:
User Login
    ↓
Backend verifies credentials
    ↓
JWT generated
    ↓
Frontend stores token
    ↓
Token sent with API requests
    ↓
Backend verifies token
Protected APIs can therefore determine which user is making the request.
bcryptjs
Passwords are protected using bcryptjs.
Instead of storing plain-text passwords:
Password
   ↓
bcrypt hashing
   ↓
Stored password hash
This prevents the database from directly containing users' original passwords.
Middleware
FarmOS uses middleware for:
Authentication
Role checking
CORS
Request processing
There are currently authentication and role middleware components.
🌾 Harvest Management
FarmOS provides APIs for managing harvest information.
Farmers can work with harvest records through:
/api/harvests
The harvest information forms the basis for the opportunity system.
Conceptually:
Crop
Quantity
Location
Quality
      ↓
Market Opportunity Engine
📊 Government Mandi Market Data
One of the most important integrations is the Government of India's market-price data.
FarmOS uses the data.gov.in / Agmarknet dataset:
Current Daily Price of Various Commodities from Various Markets (Mandi)
The data includes information such as:
State
District
Market
Commodity
Variety
Grade
Arrival date
Minimum price
Maximum price
Modal price
Prices are provided in ₹ per quintal.
1 Quintal = 100 kg
FarmOS converts the farmer's quantity into quintals when calculating market value.
📈 Market Opportunity Engine
This is the main intelligence layer of FarmOS.
Raw mandi data alone can be difficult for farmers to interpret.
FarmOS transforms it into a comparison.
Example:
Farmer:
500 kg Potato
West Bengal

        ↓

FarmOS searches market data

        ↓

Market A     ₹900/qtl
Market B     ₹1050/qtl
Market C     ₹980/qtl

        ↓

Calculate estimated gross value

        ↓

Rank opportunities

        ↓

Recommended Market
🧮 Estimated Gross Value
FarmOS converts the farmer's quantity into quintals.
For example:
500 kg
   ↓
5 quintals
If the modal price is:
₹1050 / quintal
then:
Estimated Gross Value
= 5 × ₹1050
= ₹5250
This is an estimated gross value, not guaranteed profit.
Transport costs, commissions, loading, unloading, distance, market conditions, and other real-world expenses may affect the final return.
⭐ FarmOS Opportunity Score
FarmOS uses an internal Opportunity Score from 0–100.
The current MVP score considers:
1. Price Ratio
Up to 70 points are based on the market's modal price relative to the highest modal price found in the relevant dataset.
2. Price-Range Consistency
Up to 30 points consider the relationship between:
Minimum Price
Maximum Price
The combined score helps rank available markets.
Market
   ↓
Price analysis
   ↓
Opportunity Score
   ↓
Ranking
The system uses wording such as:
Recommended Market
or
Estimated Best Opportunity
rather than claiming guaranteed profit.
🌦️ Weather Integration
FarmOS integrates weather information using Open-Meteo.
No Open-Meteo API key is required for the current implementation.
The backend retrieves:
Current temperature
Feels-like temperature
Humidity
Precipitation
Rain
Weather code
Wind speed
Daily forecast
Minimum temperature
Maximum temperature
Rain/precipitation forecast
🚀 Weather Reliability
The weather backend contains an in-memory cache.
Weather Request
      ↓
Check cache
      ↓
Fresh data?
   ↙       ↘
 Yes        No
 ↓           ↓
Return      Open-Meteo
cache       request
              ↓
          Save result
          in cache
Current cache configuration:
Cache type: In-memory Map
TTL: 15 minutes
Cache key: Latitude + Longitude rounded to 2 decimals
The backend also sends:
User-Agent: FarmOS-Backend/1.0
If Open-Meteo temporarily returns HTTP 429 or another upstream error:
Fresh cache available
       ↓
Return cached data
If only stale cache exists:
Return stale data
is_fallback = true
If there is no cache:
Return temporary-unavailable response
FarmOS does not fabricate weather values.
🤖 AI Agriculture Assistant
FarmOS includes an AI assistant powered by Google Gemini.
API:
POST /api/chat
The assistant can handle different types of questions.
Current intent categories include:
Market
Weather
General
Opportunity
🧠 Context-Aware AI
The assistant does more than send a question directly to Gemini.
For market questions:
User Question
      ↓
FarmOS detects market intent
      ↓
Fetches real market data
      ↓
Adds market context
      ↓
Gemini
      ↓
Response
For weather questions:
User Question
      ↓
Weather intent detected
      ↓
Open-Meteo data retrieved
      ↓
Weather context added
      ↓
Gemini
      ↓
Response
For opportunity questions:
User Question
      ↓
Opportunity detected
      ↓
FarmOS Opportunity Engine
      ↓
Real market comparison
      ↓
Calculated results
      ↓
Gemini explains recommendation
This helps keep AI answers connected to FarmOS's actual data.
🏪 Buyer & Order Management
FarmOS also includes farmer-buyer interaction through an order system.
Current backend APIs include:
POST /api/orders
GET  /api/orders/my-orders
GET  /api/orders/incoming
PUT  /api/orders/:id/status
This allows the platform to support:
Farmer
   ↓
Harvest
   ↓
Buyer
   ↓
Order
   ↓
Order Status
The system therefore moves beyond simply displaying information and begins connecting agricultural supply with demand.
🇮🇳 e-NAM Integration
FarmOS includes an e-NAM information integration layer.
Official portal:
https://enam.gov.in/
FarmOS provides access to relevant official e-NAM resources and information, including:
e-NAM overview
Trade information
Mandi information
Farmer registration guidance
Stakeholder information
Commodity and market-related information
Important limitation:
FarmOS does not claim to have a private e-NAM trader database or undocumented e-NAM API.
The current implementation provides official e-NAM information and links rather than inventing access to private trader data.
📱 FarmOS Frontend Features
Current frontend functionality includes:
Public Pages
Home/Landing page
Mandi Prices
Weather
AI Assistant
e-NAM information
Farmer functionality
Authentication
Profile
Harvest management
Market comparison
Weather
AI assistant
Orders
Buyer functionality
Buyer account
Incoming orders
Order management
Admin functionality
Admin APIs
Role-based access
Administrative operations
🧩 Frontend Components
Important components include:
MandiPrices
WeatherCard
MarketComparison
FarmOSAssistant
FloatingAssistant
EnamInfo
The AI assistant is also available through a floating interface so that users do not need to leave the current page.
🔌 REST API Structure
Current major API groups:
/api/auth
/api/harvests
/api/orders
/api/market
/api/weather
/api/chat
/api/opportunities
/api/enam
/api/admin
📚 Swagger API Documentation
The backend includes Swagger tooling:
swagger-jsdoc
swagger-ui-express
This provides API documentation and makes backend endpoints easier to inspect and test.
🌐 Deployment
FarmOS uses a separated deployment architecture.
                    INTERNET
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Vercel              Render
        Frontend            Backend
        React/Vite          Node/Express
             │                   │
             │                   ▼
             │                 Neon
             │               PostgreSQL
             │
             └────────── API ──────────┘
Frontend
Hosted on:
Vercel
Frontend URL:
https://farm-os-beta-roan.vercel.app
Backend
Hosted on:
Render
Backend URL:
https://farmos-df0q.onrender.com
Database
Hosted on:
Neon PostgreSQL
🔑 Environment Variables
Sensitive credentials are kept outside source code.
Backend variables include:
DATABASE_URL
DATA_GOV_API_KEY
GEMINI_API_KEY
JWT_SECRET
Frontend uses:
VITE_API_URL
Important:
Backend API keys and secrets should never be placed in the React frontend.
🔄 Complete FarmOS Data Flow
A typical farmer experience looks like:
                    FARMER
                       │
                       ▼
                Enter Harvest
                       │
                       ▼
            Crop + Quantity + Location
                       │
                       ▼
              FarmOS Backend
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
       Market API             Weather API
            │                     │
            ▼                     ▼
       Mandi Prices             Forecast
            │
            ▼
     Opportunity Engine
            │
            ▼
     Market Comparison
            │
            ▼
    Opportunity Score
            │
            ▼
   Recommended Market
            │
            ▼
       AI Assistant
            │
            ▼
      Farmer Decision
🛡️ Important Design Principles
FarmOS follows several important principles:
1. Real Data First
Where possible, FarmOS uses official or live external data rather than hardcoded values.
2. No Fake Recommendations
The system should not claim that a market guarantees a particular profit.
3. AI Uses Context
The AI assistant can receive real FarmOS market and weather information before generating an answer.
4. Secrets Stay on Backend
API keys are never intentionally exposed in the frontend.
5. Graceful Failure
External APIs can fail. FarmOS attempts to handle these situations without fabricating data.
📂 Project Structure
FarmOs/
│
├── backend/
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
│   │   └── chatController.js
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
│   │   └── chatRoutes.js
│   │
│   ├── services/
│   │   ├── marketService.js
│   │   ├── weatherService.js
│   │   └── chatService.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   │
│   ├── .env
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
🧪 Testing
The project has been tested through:
Local backend API requests
Frontend development server
Production API requests
Vercel deployment
Render deployment
Frontend production build
Market API integration
Weather API integration
AI assistant requests
Opportunity comparison API
Frontend production build is verified using:
npm run build
🚀 Running FarmOS Locally
Backend
cd backend
npm install
npm run dev
Backend:
http://localhost:5000
Frontend
Open another terminal:
cd frontend
npm install
npm run dev
Frontend:
http://localhost:3000
🔮 Future Improvements
The current Opportunity Engine is an MVP and can be expanded.
Possible future improvements include:
Real transport-distance calculation
Transport cost estimation
Arrival quantity
Traded quantity
Market demand
Buyer availability
Historical price trends
Price forecasting
Crop quality optimization
Logistics optimization
Buyer matching
Notifications
Farmer location-based recommendations
Mobile application
Regional language support
Voice-based farmer assistant
A more advanced opportunity calculation could eventually become:
Market Price
      +
Demand
      +
Quality
      +
Buyer Availability
      -
Transport Cost
      -
Market Charges
      -
Other Expenses
      ↓
Estimated Net Return
🌟 Vision
FarmOS is built around a simple idea:
Every harvest should have a better-informed selling opportunity.
Instead of forcing farmers to search multiple platforms for prices, weather, buyers, and market information, FarmOS brings these pieces together into a single decision-support platform.
HARVEST
   ↓
DATA
   ↓
INTELLIGENCE
   ↓
OPPORTUNITY
   ↓
DECISION
FarmOS — Connecting Every Harvest to Its Best Opportunity. 🌾