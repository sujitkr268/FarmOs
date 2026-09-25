# 🌾 FarmOS — Connecting Every Harvest to Its Best Opportunity

> **"Connecting Every Harvest to Its Best Opportunity"**

FarmOS is a smart agricultural decision-support and marketplace platform designed to eliminate information asymmetry in agricultural trade. By unifying live government mandi market data, road freight logistics, hyper-local weather forecasts, verified business directories, and conversational AI, FarmOS turns complex data into actionable selling decisions for farmers and transparent procurement for buyers.

---

## 📸 Platform Preview

| **Landing Page & Feature Overview** | **Live Mandi Market Prices** |
| :---: | :---: |
| ![FarmOS Landing Page](./docs/images/landing_page.png) | ![Live Mandi Prices](./docs/images/mandi_prices.png) |

| **Floating AI Assistant Panel** |
| :---: |
| ![Floating AI Assistant](./docs/images/floating_assistant.png) |

---

## 📋 Table of Contents
1. [Project Introduction](#-1-project-introduction)
2. [Core Implemented Features](#-2-core-implemented-features)
   - [Live Mandi Market Prices](#live-mandi-market-prices)
   - [Smart Market Opportunity Engine](#smart-market-opportunity-engine)
   - [Market Comparison](#market-comparison)
   - [Smart Freight Logistics](#smart-freight-logistics)
   - [Net Return Optimization](#net-return-optimization)
   - [AI Farm Assistant](#ai-farm-assistant)
   - [Weather Intelligence](#weather-intelligence)
   - [Public Trader Directory](#public-trader-directory)
   - [Buyer Discovery](#buyer-discovery)
   - [Farmer Verification](#farmer-verification)
   - [Buyer Verification](#buyer-verification)
   - [Farmer Dashboard](#farmer-dashboard)
   - [Buyer Dashboard](#buyer-dashboard)
   - [Harvest Management](#harvest-management)
   - [Order Management](#order-management)
   - [e-NAM Market Guidance](#e-nam-market-guidance)
   - [English & Hindi Interface](#english--hindi-interface)
3. [Complete Technology Stack](#-3-complete-technology-stack)
4. [System Architecture](#-4-system-architecture)
5. [API Endpoints Reference](#-5-api-endpoints-reference)
6. [Local Setup & Installation](#-6-local-setup--installation)

---

## 🎯 1. Project Introduction

### The Problem

Farmers frequently face significant challenges when deciding how and where to sell their harvested crops:

- **Where to sell:** Uncertainty about which regional APMC mandi offers the best prices for their specific crop.
- **Price variations:** Difficulty comparing modal prices across multiple mandis in different districts or states.
- **Hidden transportation costs:** Freight charges can eat up price gains from distant markets, leaving farmers with lower overall returns.
- **Actual net earnings:** Challenge in computing real net returns after accounting for road distance, vehicle requirement, and fuel/freight expenses.
- **Finding buyers:** Limited visibility into verified local or regional buyers, wholesalers, and millers.
- **Unpredictable weather:** Weather shifts affecting transport safety and harvest storage.

### The FarmOS Solution

FarmOS provides a smart agricultural decision-support layer and direct marketplace that connects every stage of the decision flow:

```
Farmer
  ↓
Harvest Record
  ↓
Live Market Prices (Agmarknet)
  ↓
Market Comparison
  ↓
Freight Calculation (OpenRouteService + Vehicle Models)
  ↓
Estimated Net Return Optimization
  ↓
Potential Buyers & Traders
  ↓
Selling Opportunity
```

By calculating factual market and transport metrics on the backend and combining them with conversational AI guidance, FarmOS gives farmers clear, actionable recommendations to maximize earnings.

---

## 🚀 2. Core Implemented Features

### Live Mandi Market Prices
- **Data Source:** Ingests official Government of India Agmarknet market data via the `data.gov.in` API (Resource ID: `9ef84268-d588-465a-a308-a864a43d0070`).
- **Filtering Capabilities:** Filter prices by State, District, Market (APMC mandi), Commodity, Variety, and Grade.
- **Price Metrics:** Displays Arrival Date, Minimum Price (₹), Maximum Price (₹), and Benchmark Modal Price (₹).
- **Standardized Units:** All prices are normalized and represented per quintal (100 kg) where applicable.

### Smart Market Opportunity Engine
FarmOS evaluates market opportunities by integrating real mandi market rates with harvest and location data:
- Ingests farmer harvest details (crop commodity, quantity, unit, origin location).
- Automatically converts quantities (kg, tons, quintals) into standard quintals.
- Computes road travel distances and freight costs to candidate markets.
- Calculates **Estimated Gross Value (₹)** and **Estimated Net Return (₹)**.
- Ranks markets using the **FarmOS Opportunity Score (0–100)** based on modal price relative to peak regional market rates (up to 70 points) and price-range consistency ratio (up to 30 points).

### Market Comparison
Explicitly compares candidate selling markets side-by-side:
- **Market / APMC Name**
- **Reported Benchmark Modal Price (₹/quintal)**
- **Estimated Gross Value (₹)**
- **Road Distance (km)**
- **Travel Time (mins/hours)**
- **Recommended Freight Vehicle**
- **Estimated Freight Cost (₹)**
- **Estimated Net Return (₹)**
- **FarmOS Opportunity Score (0–100)**
- **Recommendation Label** (*Best Option*, *Good*, etc.)

> **Note:** Market recommendations represent estimated market opportunities based on reported Agmarknet benchmark prices and standard transport rate models. FarmOS does not guarantee profits or fixed freight quotes.

### Smart Freight Logistics
Provides automated road routing and freight cost estimation:
- **Road Routing:** Uses OpenRouteService directions API (`https://api.openrouteservice.org/v2/directions/driving-car`) and geocoding API for exact road distance and duration.
- **Fallback Geographical Estimation:** Includes an internal Haversine geographical road estimation model (with a 1.35x road curvature multiplier and 40 km/h truck speed model) when API keys or routing endpoints are offline.
- **Vehicle Selection Categories:**
  - *Mini Truck* (e.g., Tata Ace / Mahindra Bolero Pickup, Capacity: 1,000 kg, Base Rate: ₹20/km, Min Charge: ₹500)
  - *Small Truck* (e.g., 14ft Eicher / Canter, Capacity: 3,000 kg, Base Rate: ₹30/km, Min Charge: ₹1,000)
  - *Medium Truck* (e.g., 6-Wheeler / 17ft Eicher, Capacity: 9,000 kg, Base Rate: ₹45/km, Min Charge: ₹2,000)
  - *Heavy Truck* (e.g., 10-Wheeler / Multi-Axle, Capacity: 20,000 kg, Base Rate: ₹65/km, Min Charge: ₹3,500)
- **Logistics Metrics:** Auto-selects vehicle type based on harvest weight, calculates number of vehicles required, cost per kg, total estimated freight cost, gross value, and net return.

### Net Return Optimization
FarmOS optimizes selling decisions using the formula:

$$\text{Estimated Net Return} = \text{Estimated Gross Value} - \text{Estimated Freight Cost}$$

When comparing selling opportunities, FarmOS ranks markets primarily by Maximum Estimated Net Return, ensuring farmers choose markets that yield the highest net profit after transport expenses.

### AI Farm Assistant
- **Engine:** Powered by Google Gemini API (`gemini-3.5-flash`, `gemini-3.6-flash`, `gemini-3.7-flash`, `gemini-2.5-flash` with automatic fallback).
- **Conversational Capabilities:** Answers farmer questions on market prices, weather conditions, market comparison opportunities, transport/freight logistics, and selling strategies.
- **Backend-Generated Context:** The backend calculates factual mandi market prices, road distances, freight costs, and net returns first, then injects this JSON context into the Gemini prompt.
- **Factual Integrity:** Gemini is strictly instructed to explain the calculated context conversationally. Gemini does **NOT** independently generate or hallucinate market prices.

### Weather Intelligence
- **Data Provider:** Powered by Open-Meteo API (`https://api.open-meteo.com/v1/forecast`).
- **Current & Forecast Data:** Provides current temperature, apparent temperature, relative humidity, wind speed, precipitation, and 7-day daily weather forecasts (max/min temp, rain sum, weather codes, icons).
- **Caching & Fallbacks:** Uses a 15-minute in-memory backend cache (`weatherCache`) with TTL checking and graceful fallback responses for upstream rate limits (HTTP 429).

### Public Trader Directory
- **Public Agricultural Directory:** Contains verified records of agricultural businesses, wholesalers, rice millers, exporters, and APMC market functionaries in the `public_traders` database table.
- **Filtering & Search:** Search by business name, commodity, state, district, mandi, and business type.
- **Source Badges:** Displays verification status badges:
  - 🟢 **FarmOS Verified Business** (Source verified via APEDA, WBSAMB, or government portals)
  - 🌐 **Public Business Info** (Website verified)
  - 🏢 **Public Listing**
- **Public Contact Info:** Displays public business phone numbers, email addresses, official websites, and direct source evidence URLs.

### Buyer Discovery
- **Proximity & Commodity Matching:** Matches farmers' crops and regions against relevant traders and buyers.
- **Distinction of Buyer Categories:** Clearly distinguishes between **Public Business Traders** (from government/public directories) and **FarmOS Registered Buyers** (verified user accounts on FarmOS).
- **Non-Guaranteed Wording:** Labeled clearly as *Potential Buyer / Relevant Trader* without guaranteeing transactions.

### Farmer Verification
- **Workflow:** Farmers can submit farm profile details (village, farm size, crops grown, farmer reference numbers, FPO information, land/PM-KISAN verification evidence).
- **Verification Status:** Status transitions from `unverified` / `pending` to `verified` upon administrative review.
- **FarmOS Verified Farmer Badge:** Verified farmers receive a **FarmOS Verified Farmer** badge across harvest listings.
- **Disclaimer:** FarmOS verification is an internal platform trust system and is **not** government certification.

### Buyer Verification
- **Workflow:** Buyers register with business profiles, contact details, commodities handled, buying capacity, and optional e-NAM / Udyam MSME reference numbers.
- **Privacy & Contact Control:** Buyers can toggle `show_contact_publicly`. When set to false, contact details remain private.
- **Admin Review:** Administrators approve or reject buyer account applications. Approved buyers earn the **FarmOS Registered Buyer** badge.
- **Disclaimer:** FarmOS buyer verification is an internal platform trust assessment and is **not** government certification.

### Farmer Dashboard
Comprehensive dashboard designed for farmers:
- **Hero Banner:** Displays farmland background, user profile status, location, and verified badges.
- **Metric Cards Grid:** Total Harvests, Active Orders, Selling Opportunities, and Estimated Net Returns.
- **Best Opportunity Card:** Highlighting top recommended mandi, net return, freight costs, and vehicle requirements.
- **Market Comparison Grid:** Side-by-side market cards showing prices, distance, freight, and net value.
- **Quick Actions (2x2 Grid):** Add Harvest, Market Prices, Find Buyers, Ask FarmOS AI.
- **Weather Widget:** Current temperature, humidity, wind, and 5-day mini forecast.
- **Potential Buyers Card:** List of matching public traders and registered buyers with contact options.
- **Farm Profile Card:** Summary of farm size, crops grown, and verification status.
- **Harvest Management & Order Views:** Full interactive modals and tabbed detail sections.

### Buyer Dashboard
Dedicated dashboard for commercial buyers and procurement managers:
- **Header Banner:** Business name, location, mandi association, and verification badge.
- **Stat Metric Cards:** Orders Placed, Pending Approval, Accepted Orders, and Account Trust Level.
- **Orders Management Tab:** View all placed purchase orders, total costs, farmer names, locations, and real-time status (`pending`, `accepted`, `rejected`).
- **Browse Produce Marketplace Tab:** Filter available farmer harvest listings by crop name or location and place purchase orders directly.
- **Mandi Price Directory Tab:** Direct access to live Agmarknet mandi rates.
- **Verification Credentials Tab:** Manage e-NAM reference, Udyam MSME reference, and request verification status updates.

### Harvest Management
Full CRUD operations confirmed by source code (`harvestController.js` & `harvestRoutes.js`):
- **Create:** Farmers post new crop harvest listings with crop name, quantity, unit (`kg`, `quintal`, `ton`), price, location, and description.
- **Read / View:** Public and authenticated endpoints to view all harvests or single harvest details with farmer verification status.
- **Update:** Farmers can update crop details, price, quantity, description, or status (`available`, `sold`, `reserved`).
- **Delete:** Farmers can delete their own harvest listings.

### Order Management
Implemented order workflow (`orderController.js` & `orderRoutes.js`):
- **Create Order:** Buyers select an available harvest, enter order quantity, and submit a purchase order (with backend total price calculation).
- **Buyer Orders View:** Buyers track all their incoming/outgoing orders.
- **Farmer Orders View:** Farmers view incoming orders for their harvest listings.
- **Atomic Order Status Updates:** Farmers accept or reject pending orders. Accepting an order executes a PostgreSQL database transaction (`BEGIN...COMMIT/ROLLBACK` with `FOR UPDATE` row locking) that automatically deducts the ordered quantity from the harvest stock and sets status to `unavailable` if stock reaches zero.

### e-NAM Market Guidance
- **e-NAM Integration:** Provides platform information for the National Agriculture Market (e-NAM), managed by SFAC, Ministry of Agriculture.
- **Information Features:** Displays platform overview, key advantages (pan-India electronic bidding, assaying, direct e-payment), step-by-step farmer trade workflow (gate entry, quality testing, bidding, farmer approval, settlement), and direct links to `enam.gov.in`, official trade dashboards, APMC mandi directory, and farmer registration.
- **Buyer Reference:** Registered buyers can attach their e-NAM registration reference ID to their profile.
- **Disclaimer:** FarmOS provides educational guidance and official portal links; direct e-NAM transaction processing is conducted on `enam.gov.in`.

### English & Hindi Interface
- **Localization:** Complete English (`en`) and Hindi (`hi`) translation support via `LanguageContext.jsx` and JSON dictionaries (`en.json`, `hi.json`).
- **Language Switching:** Toggle between English and Hindi from the main navigation bar.
- **Language Persistence:** Selected language preference is automatically persisted in browser `localStorage` (`farmos_language`).

---

## 🛠️ 3. Complete Technology Stack

### Frontend
- **React 18** (`react` `^18.3.1`, `react-dom` `^18.3.1`) — Component-based user interface architecture
- **Vite** (`vite` `^6.0.7`) — Fast build tool and development server
- **JavaScript ES6+** — Modern frontend scripting logic
- **React Router** (`react-router-dom` `^6.28.1`) — Declarative client-side routing and protected route guards
- **Axios** (`axios` `^1.7.9`) — HTTP client for backend API communication
- **CSS3** — Custom responsive layouts, CSS grid, flexbox, and CSS variables
- **React Context API** — Global state management (`AuthContext`, `LanguageContext`)

### Backend
- **Node.js** — JavaScript runtime environment
- **Express.js** (`express` `^5.2.1`) — Web application framework for API routes and controllers
- **JavaScript** — Server-side logic
- **JWT** (`jsonwebtoken` `^9.0.3`) — JSON Web Token authentication
- **bcryptjs** (`bcryptjs` `^3.0.3`) — Password hashing algorithm
- **CORS** (`cors` `^2.8.6`) — Cross-Origin Resource Sharing middleware
- **Dotenv** (`dotenv` `^17.4.2`) — Environment variable management
- **Swagger / OpenAPI** (`swagger-jsdoc` `^6.3.0`, `swagger-ui-express` `^5.0.1`) — Interactive API documentation served at `/api-docs`

### Database
- **PostgreSQL** (`pg` `^8.23.0`) — Relational SQL database with connection pooling
- **Neon** — Serverless PostgreSQL cloud platform hosting the database

### External APIs & Integrations
1. **Agmarknet / data.gov.in**
   - *Endpoint:* `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
   - *Purpose:* Ingests daily government APMC mandi market commodity prices across India.
2. **Open-Meteo API**
   - *Endpoint:* `https://api.open-meteo.com/v1/forecast`
   - *Purpose:* Provides current weather metrics and 7-day daily forecasts.
3. **OpenRouteService API**
   - *Endpoint:* `https://api.openrouteservice.org/v2/directions/driving-car` & `/geocode/search`
   - *Purpose:* Calculates real driving road distances and travel duration between origins and markets.
4. **Gemini API**
   - *Endpoint:* `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`
   - *Purpose:* Powers the AI Agriculture Assistant to explain calculated market data conversationally.
5. **e-NAM (National Agriculture Market)**
   - *Endpoint:* `https://www.enam.gov.in`
   - *Purpose:* Agricultural market workflow information, APMC mandi directory, and buyer registration references.

### Deployment
- **Frontend:** Vercel (`vercel.json` rewrites for SPA routing)
- **Backend:** Render
- **Database:** Neon PostgreSQL Cloud
- **Source Control:** GitHub

---

## 🏗️ 4. System Architecture

```mermaid
flowchart TD
    Farmer[Farmer / Buyer / Admin]
    Frontend[React 18 + Vite Frontend - Vercel]
    Backend[Node.js + Express 5 Backend - Render]
    DB[(PostgreSQL / Neon Cloud)]

    Market[Agmarknet / data.gov.in]
    Weather[Open-Meteo API]
    Routing[OpenRouteService API]
    AI[Gemini API]
    ENAM[e-NAM Portal Guidance]

    Farmer -->|HTTP / REST| Frontend
    Frontend -->|Axios / JSON| Backend
    Backend -->|pg Pool / SQL| DB
    Backend -->|Fetch API| Market
    Backend -->|Fetch API + 15m Cache| Weather
    Backend -->|HTTP POST| Routing
    Backend -->|HTTP POST| AI
    Backend -->|Static Info & Links| ENAM
```

---

## 📡 5. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new farmer, buyer, or admin user
- `POST /api/auth/login` — Authenticate user and receive JWT token
- `GET /api/auth/profile` — Get authenticated user profile (Protected)
- `PUT /api/auth/profile` — Update user profile & verification details (Protected)

### Harvests (`/api/harvests`)
- `POST /api/harvests` — Create a new crop harvest listing (Farmer/Admin)
- `GET /api/harvests` — Get all available harvest listings
- `GET /api/harvests/:id` — Get single harvest listing details
- `PUT /api/harvests/:id` — Update harvest listing (Owner/Admin)
- `DELETE /api/harvests/:id` — Delete harvest listing (Owner/Admin)

### Orders (`/api/orders`)
- `POST /api/orders` — Create a purchase order (Buyer)
- `GET /api/orders/buyer` — Get orders placed by logged-in buyer
- `GET /api/orders/farmer` — Get orders received by logged-in farmer
- `PUT /api/orders/:id/status` — Accept or reject an order with DB transaction (Farmer)

### Market Opportunities & Logistics (`/api/opportunities` & `/api/logistics`)
- `GET /api/opportunities/compare` — Evaluate and rank market opportunities
- `POST /api/opportunities/compare` — Evaluate market opportunities with POST payload
- `GET /api/logistics/estimate` — Calculate road routing & freight vehicle cost estimates
- `POST /api/logistics/estimate` — Freight estimation endpoint

### Market Prices & Weather (`/api/market` & `/api/weather`)
- `GET /api/market/prices` — Fetch live Agmarknet mandi market prices
- `GET /api/weather/forecast` — Fetch Open-Meteo weather forecast for latitude/longitude

### AI Chat Assistant (`/api/chat`)
- `POST /api/chat` — Send query to FarmOS AI Assistant (with backend context injection)

### Public Traders & Buyers (`/api/traders` & `/api/buyers`)
- `GET /api/traders/public` — Get public agricultural trader directory
- `GET /api/traders/public/:id` — Get single public trader details
- `POST /api/traders/public` — Create public trader record (Admin)
- `PUT /api/traders/public/:id` — Update public trader record (Admin)
- `DELETE /api/traders/public/:id` — Remove public trader record (Admin)
- `GET /api/buyers/registered` — Get verified registered FarmOS buyers
- `GET /api/buyers/registered/:id` — Get single registered buyer details

### Admin Management (`/api/admin`)
- `GET /api/admin/dashboard` — System analytics & resource counts
- `GET /api/admin/users` — List all registered users
- `GET /api/admin/harvests` — List all system harvests
- `GET /api/admin/orders` — List all system orders
- `GET /api/admin/pending-farmers` — Get pending farmer verification applications
- `PUT /api/admin/farmers/:id/verify` — Approve farmer verification
- `PUT /api/admin/farmers/:id/reject` — Reject farmer verification
- `GET /api/admin/pending-buyers` — Get pending buyer verification applications
- `PUT /api/admin/buyers/:id/verify` — Approve buyer account verification
- `PUT /api/admin/buyers/:id/reject` — Reject buyer account application

### e-NAM Guidance (`/api/enam`)
- `GET /api/enam/info` — Get official e-NAM overview, trade workflow, and portal links

### API Documentation
- `GET /api-docs` — Swagger UI interactive OpenAPI documentation

---

## 💻 6. Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Neon cloud connection string)

### 1. Repository Setup
```bash
git clone https://github.com/sujitkr268/FarmOs.git
cd FarmOs
```

### 2. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/`:
```env
PORT=5000
DATABASE_URL=postgres://user:password@neon-db-host/dbname?sslmode=require
JWT_SECRET=your_jwt_secret_key
DATA_GOV_API_KEY=your_data_gov_in_api_key
GEMINI_API_KEY=your_gemini_api_key
OPENROUTESERVICE_API_KEY=your_openrouteservice_api_key
```

Seed database tables:
```bash
npm run dev
```

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
```
Create a `.env` file inside `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```

Access the application in your browser at `http://localhost:5173` and API documentation at `http://localhost:5000/api-docs`.
