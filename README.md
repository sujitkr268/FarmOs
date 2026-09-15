# 🌾 FarmOS — Connecting Every Harvest to Its Best Opportunity

> **"Turning raw agricultural data into better farming and selling decisions."**

FarmOS is a full-stack, smart agricultural decision-support platform built to solve information asymmetry in agricultural trade. It empowers farmers by converting fragmented market prices, weather conditions, and harvest details into deterministic market comparisons, calculated opportunity scores, and context-aware AI recommendations.

---

## 📸 Platform Interface

| **Landing Page & Feature Overview** | **Live Mandi Market Prices** |
| :---: | :---: |
| ![FarmOS Landing Page](./docs/images/landing_page.png) | ![Live Mandi Prices](./docs/images/mandi_prices.png) |

| **Floating AI Assistant Panel** |
| :---: |
| ![Floating AI Assistant](./docs/images/floating_assistant.png) |

---

## 📋 Table of Contents
1. [Project Overview](#-1-project-overview)
2. [Problem Statement](#-2-problem-statement)
3. [The FarmOS Solution](#-3-the-farmos-solution)
4. [Key Features Status](#-4-key-features-status)
5. [Core Innovation — Market Opportunity Engine](#-5-core-innovation--market-opportunity-engine)
6. [Complete System Architecture](#-6-complete-system-architecture)
7. [Farmer Decision Workflow](#-7-farmer-decision-workflow)
8. [Market Opportunity Engine Deep-Dive](#-8-market-opportunity-engine-deep-dive)
9. [Government Market Data Integration](#-9-government-market-data-integration)
10. [Weather Intelligence & Caching](#-10-weather-intelligence--caching)
11. [AI Agriculture Assistant](#-11-ai-agriculture-assistant)
12. [e-NAM Integration](#-12-e-nam-integration)
13. [Authentication & Authorization](#-13-authentication--authorization)
14. [Order & Marketplace System](#-14-order--marketplace-system)
15. [Database Architecture](#-15-database-architecture)
16. [Frontend Architecture](#-16-frontend-architecture)
17. [Backend Architecture](#-17-backend-architecture)
18. [Project Structure](#-18-project-structure)
19. [API Endpoint Documentation](#-19-api-endpoint-documentation)
20. [Technology Stack](#-20-technology-stack)
21. [Environment Variables](#-21-environment-variables)
22. [Local Development Setup](#-22-local-development-setup)
23. [Deployment Architecture](#-23-deployment-architecture)
24. [Security Practices](#-24-security-practices)
25. [Testing & Verification](#-25-testing--verification)
26. [Current Limitations](#-26-current-limitations)
27. [Future Scope](#-27-future-scope)
28. [Future-Proof Architecture](#-28-future-proof-architecture)
29. [Social Impact & Farmer Empowerment](#-29-social-impact--farmer-empowerment)
30. [Value Proposition](#-30-value-proposition)
31. [End-to-End System Flow](#-31-end-to-end-system-flow)
32. [Project Status Overview](#-32-project-status-overview)
33. [Commercial Disclaimer](#-33-commercial-disclaimer)
34. [Final Summary](#-34-final-summary)

---

## 🎯 1. Project Overview

FarmOS is an end-to-end web platform designed to bridge the gap between crop production and market realization. Smallholder farmers often sell their produce at suboptimal prices due to lack of visibility into regional APMC (Agricultural Produce Market Committee) mandi prices, unpredictable weather shifts, and intermediary exploitation.

Rather than acting as a static price-lookup directory, FarmOS acts as a **smart decision-support layer**. It ingests daily government commodity prices, normalizes quantities, evaluates regional price trends, calculates a deterministic **FarmOS Opportunity Score (0–100)**, and explains the best market opportunity using an integrated AI Assistant powered by Google Gemini.

---

## ❓ 2. Problem Statement

Indian farmers frequently face the following challenges:

```
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│     Price Asymmetry       │     │   Lack of Comparisons     │     │     Data Isolation        │
│ Farmers know what crop    │     │ Mandi price lists exist   │     │ Weather, prices, and buyer│
│ they have, but do not know│ --> │ but do not compare market │ --> │ demands exist in separate │
│ which regional mandi offers│     │ returns for specific crop │     │ silos without actionable  │
│ the highest return.       │     │ harvest quantities.       │     │ decision context.         │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
```

### Raw Data vs. Actionable Decision Support

| Dimension | Raw Government Mandi Data | FarmOS Decision Support Platform |
| :--- | :--- | :--- |
| **Output Type** | Long, static table of prices per quintal | Evaluated, ranked list of market opportunities |
| **Quantity Context** | Quoted per 100 kg (quintal) standard | Converted to farmer's exact harvest quantity (e.g., 500 kg = 5 quintals) |
| **Return Calculation** | Requires manual arithmetic | Automatic calculation of **Estimated Gross Value (₹)** |
| **Market Strength** | Raw min, max, and modal figures | **FarmOS Opportunity Score (0–100)** combining price ratio and consistency |
| **Guidance** | None | Context-aware AI explanation advising which mandi to prioritize |

---

## 💡 3. The FarmOS Solution

FarmOS unifies agricultural data feeds, internal harvest listings, and AI reasoning into an integrated workflow:

```mermaid
flowchart TD
    A["🌾 Farmer Harvest Input"] --> B["📊 Real Mandi Market Data (Agmarknet)"]
    B --> C["⚖️ Regional Market Comparison"]
    C --> D["🧮 Opportunity Scoring (0-100)"]
    D --> E["🏆 Top Recommended Market"]
    E --> F["🤖 AI Assistant Explanation"]
    F --> G["🤝 Direct Marketplace & Buyer Orders"]
```

FarmOS does not replace government mandis or make false earnings guarantees; it gives farmers data-driven clarity to negotiate better prices or select the most profitable market destination.

---

## 📊 4. Key Features Status

| Feature | Description | Status |
| :--- | :--- | :---: |
| **JWT Authentication** | Secure User Registration & Login for Farmers, Buyers, and Admins | ✅ Implemented |
| **Role-Based Access** | Middleware enforcing `farmer`, `buyer`, and `admin` permissions | ✅ Implemented |
| **Harvest Management** | Farmers can create, read, update, and delete crop harvest listings | ✅ Implemented |
| **Mandi Market Prices** | Fetch real-time APMC mandi prices via Govt of India Agmarknet API | ✅ Implemented |
| **Opportunity Engine** | Ranks markets deterministically by estimated gross return and price consistency | ✅ Implemented |
| **FarmOS Opportunity Score** | 0–100 numerical score evaluating price strength and range consistency | ✅ Implemented |
| **Weather Intelligence** | Hyper-local current weather & 7-day forecast via Open-Meteo API | ✅ Implemented |
| **Weather Caching** | 15-minute in-memory Map cache (`weatherCache`) with graceful HTTP 429 fallbacks | ✅ Implemented |
| **AI Agriculture Assistant** | Context-aware chatbot powered by Google Gemini API | ✅ Implemented |
| **Floating Assistant** | Site-wide floating chatbot widget accessible from any page | ✅ Implemented |
| **Buyer Marketplace** | Public & authenticated marketplace to browse available farmer harvests | ✅ Implemented |
| **Order Management** | Buyers place orders; Farmers accept/reject with atomic DB transactions | ✅ Implemented |
| **e-NAM Market Guidance** | Official e-NAM portal links, trading workflow steps, and APMC directory | ✅ Implemented |
| **Swagger API Docs** | Interactive OpenAPI / Swagger documentation mounted at `/api-docs` | ✅ Implemented |
| **Smart Freight Logistics** | OpenRouteService road routing, vehicle selection, Estimated Freight Cost & Net Return ranking | ✅ Implemented |
| **Online Payment Gateway** | Stripe / Razorpay integration for digital escrow payments | 🔮 Future Scope |
| **WhatsApp/SMS Alerts** | Automated price drop and weather warning push notifications | 🔮 Future Scope |

---

## 🚀 5. Core Innovation — Market Opportunity Engine

Simply listing raw market prices requires the farmer to mentally compute unit conversions, compare dozens of mandis, and guess price stability. 

The **FarmOS Market Opportunity Engine** automates this process:

```mermaid
flowchart LR
    subgraph RawData ["Government API Feed"]
        A["data.gov.in / Agmarknet"]
    end

    subgraph Engine ["FarmOS Opportunity Engine"]
        B["Quantity Normalization (kg → Quintals)"]
        C["Gross Return Calculation (Quantity × Modal Price)"]
        D["Price Ratio Score (up to 70 pts)"]
        E["Price-Range Consistency Score (up to 30 pts)"]
        F["Deterministic Ranking & Recommendation"]
    end

    subgraph Output ["Farmer Action"]
        G["🏆 Ranked Markets + FarmOS Opportunity Score"]
    end

    A --> B
    B --> C
    C --> D
    C --> E
    D --> F
    E --> F
    F --> G
```

---

## 🏗️ 6. Complete System Architecture

```mermaid
flowchart TD
    subgraph UserLayer ["User Layer"]
        U1["🌾 Farmer"]
        U2["🛍️ Buyer"]
        U3["🛡️ Admin"]
    end

    subgraph FrontendLayer ["Frontend Layer (Vercel)"]
        F1["React 18 + Vite SPA"]
        F2["React Router v6"]
        F3["Axios API Client"]
        F4["Floating AI Assistant Widget"]
    end

    subgraph BackendLayer ["Backend Layer (Render)"]
        B1["Node.js + Express 5.x Server"]
        B2["JWT Auth & Role Middleware"]
        B3["Controllers & Services"]
        B4["Weather In-Memory Cache (15-min TTL)"]
    end

    subgraph DatabaseLayer ["Database Layer (Neon Cloud)"]
        D1[("PostgreSQL Database")]
    end

    subgraph ExternalServices ["External API Integrations"]
        E1["data.gov.in (Govt Mandi Prices)"]
        E2["Open-Meteo API (Weather Forecast)"]
        E3["Google Gemini API (AI Reasoning)"]
        E4["e-NAM Official Portal Resources"]
    end

    U1 & U2 & U3 -->|HTTPS| F1
    F1 --> F2 --> F3
    F3 -->|REST API Calls| B1
    B1 --> B2 --> B3
    B3 -->|SQL Queries| D1
    B3 --> B4
    B3 -->|Fetch Market Data| E1
    B3 -->|Fetch Weather| E2
    B3 -->|AI Context & Prompts| E3
    B3 -->|Official Links| E4
```

---

## 🔄 7. Farmer Decision Workflow

```mermaid
flowchart TD
    Start(["Start Farmer Session"]) --> Auth{"Authenticated?"}
    Auth -- No --> Login["Register / Login (JWT)"] --> HarvestInput
    Auth -- Yes --> HarvestInput["Add Harvest Listing (Crop, Quantity, Location)"]

    HarvestInput --> PriceCheck["View Live Mandi Prices / Search Crop"]
    PriceCheck --> OppEngine["Run Market Opportunity Comparison"]
    
    OppEngine --> Calculate["Backend Normalizes Quantity & Calculates Gross Return"]
    Calculate --> ComputeScore["Compute FarmOS Opportunity Score (0-100)"]
    ComputeScore --> Rank["Rank Mandis & Identify Top Recommendation"]

    Rank --> QueryAI["Consult FarmOS Floating AI Assistant"]
    QueryAI --> AIRespond["AI Explains Recommendation & Warns of Transport Costs"]

    AIRespond --> Decision{"Decision Point"}
    Decision -- Sell via Marketplace --> ListBuyer["List in FarmOS Marketplace for Verified Buyers"]
    Decision -- Sell at APMC Mandi --> MandiTrade["Transport Produce to Recommended APMC Mandi"]

    ListBuyer --> ReceiveOrder["Receive Buyer Order -> Accept/Reject Order"]
    MandiTrade & ReceiveOrder --> End(["Complete Trade"])
```

---

## 🧮 8. Market Opportunity Engine Deep-Dive

### Mathematical Formulation & Scoring Model

#### 1. Unit Conversion
Prices in Agmarknet are reported per **quintal (1 quintal = 100 kg)**. Quantity inputs are normalized:
$$\text{Quantity in Quintals } (Q_q) = \frac{\text{Quantity in kg}}{100}$$

#### 2. Estimated Gross Value
$$\text{Estimated Gross Value (₹)} = Q_q \times \text{Modal Price } (P_{\text{modal}})$$

#### 3. FarmOS Opportunity Score (0 – 100)
The Opportunity Score evaluates both price height and price stability:

$$\text{FarmOS Opportunity Score} = \min\left(100, \text{Round}(\text{Price Score} + \text{Consistency Score})\right)$$

- **Price Ratio Score (0 to 70 points)**:
  $$\text{Price Score} = \left(\frac{P_{\text{modal}}}{\max(P_{\text{modal, dataset}})}\right) \times 70$$

- **Price-Range Consistency Indicator (0 to 30 points)**:
  $$\text{Consistency Ratio} = \min\left(1, \frac{P_{\text{min}}}{P_{\text{max}}}\right)$$
  $$\text{Consistency Score} = \text{Consistency Ratio} \times 30$$

```mermaid
flowchart TD
    Input["Harvest Params: Crop=Potato, Qty=500kg, State=West Bengal"] --> Convert["Convert 500 kg = 5 Quintals"]
    Convert --> FetchData["Fetch Top 15 Mandi Records from Agmarknet"]
    FetchData --> Loop["Process Each Mandi Record"]

    Loop --> Gross["Gross Value = 5 qtl × Modal Price"]
    Loop --> PriceRatio["Price Ratio Score = (Modal / Max Regional Modal) × 70"]
    Loop --> RangeRatio["Range Consistency Score = (Min / Max) × 30"]
    PriceRatio & RangeRatio --> SumScore["Score = Price Ratio + Range Consistency (Max 100)"]

    SumScore --> Sort["Sort Mandis Descending by Opportunity Score"]
    Sort --> Recommend["Top Result = 🏆 Recommended Market"]
```

### 8.2 Smart Freight Logistics & Net Return Calculation Model

A mandi with the highest gross market price may not yield the highest net profit if transport expenses to that market are excessive.

FarmOS integrates a **Smart Freight Logistics Engine** (`backend/services/logisticsService.js`) to estimate road transport distances, select appropriate vehicle types, and calculate **Estimated Net Return**:

#### 1. Estimated Freight Cost Calculation
$$\text{Vehicles Required } (V_n) = \left\lceil \frac{\text{Quantity in kg}}{\text{Vehicle Capacity (kg)}} \right\rceil$$
$$\text{Trip Cost (₹)} = \max\left(\text{Min Charge}, \text{Road Distance (km)} \times \text{Base Rate (₹/km)}\right)$$
$$\text{Estimated Freight Cost (₹)} = \text{Trip Cost} \times V_n$$

#### 2. Vehicle Rates & Capacity Schedule

| Vehicle Category | Typical Vehicles | Capacity | Base Rate (₹/km) | Minimum Charge (₹) |
| :--- | :--- | :---: | :---: | :---: |
| **Mini Truck** | Tata Ace, Bolero Pickup | 1,000 kg (1T) | ₹20 / km | ₹500 |
| **Small Truck** | Eicher 14ft, Canter | 3,000 kg (3T) | ₹30 / km | ₹1,000 |
| **Medium Truck** | 6-Wheeler, 17ft Eicher | 9,000 kg (9T) | ₹45 / km | ₹2,000 |
| **Heavy Truck** | 10-Wheeler, Multi-Axle | 20,000 kg (20T) | ₹65 / km | ₹3,500 |

#### 3. Estimated Net Return Formula
$$\text{Estimated Net Return (₹)} = \text{Estimated Gross Revenue (₹)} - \text{Estimated Freight Cost (₹)}$$

#### 4. Road Distance Routing & Fallbacks
1. **OpenRouteService API**: Queries `driving-car` directions endpoint using origin/destination coordinates.
2. **Known APMC Coordinates Dictionary**: Pre-configured geocoding dictionary covering major West Bengal APMCs and districts.
3. **Geographical Estimation Fallback**: Uses Haversine straight-line distance scaled by a $1.35\times$ road circuity factor if routing services are offline.
4. **Market Re-Ranking**: When logistics data is available, candidate markets are re-ranked by **Estimated Net Return** (highest net profit first).

---

## 🏛️ 9. Government Market Data Integration

FarmOS integrates directly with the official **Govt of India Agmarknet API** via `data.gov.in`.

### Schema & Fields Consumed

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `state` | String | State where APMC mandi is located |
| `district` | String | District of the mandi |
| `market` | String | Official APMC Mandi Name |
| `commodity` | String | Crop / Commodity name (e.g., Potato, Wheat, Onion) |
| `variety` | String | Crop variety (e.g., Jyoti, Red, FAQ) |
| `grade` | String | Quality grade (e.g., FAQ, Grade A) |
| `arrival_date` | String | Reporting arrival date (`DD/MM/YYYY`) |
| `min_price` | Number | Minimum reported price in ₹/quintal |
| `max_price` | Number | Maximum reported price in ₹/quintal |
| `modal_price` | Number | Modal (most frequent transaction) price in ₹/quintal |

> **Note**: FarmOS does not claim ownership of government data. All market figures reflect official Agmarknet public feeds.

---

## 🌤️ 10. Weather Intelligence & Caching

FarmOS integrates **Open-Meteo REST API** to deliver hyper-local weather forecasts without requiring secret API keys.

### Resilience & Caching Architecture
To prevent rate limiting (`HTTP 429 Too Many Requests`) from shared cloud deployment IPs, FarmOS implements a two-tier caching & fallback system in `backend/services/weatherService.js`:

```mermaid
flowchart TD
    Request["GET /api/weather?lat=22.57&lon=88.36"] --> KeyGen["Generate Cache Key: '22.57_88.36'"]
    KeyGen --> CacheCheck{"Fresh Cache Entry Exists? (<15 mins)"}
    
    CacheCheck -- Yes --> ReturnFresh["Return Fresh Cached Weather Payload (Instant)"]
    CacheCheck -- No --> FetchAPI["Fetch Open-Meteo API (User-Agent: FarmOS-Backend/1.0)"]

    FetchAPI --> StatusCheck{"Response OK (200)?"}
    StatusCheck -- Yes --> SaveCache["Update weatherCache Map + Timestamp"] --> ReturnNew["Return New Weather Payload"]

    StatusCheck -- No (429/500) --> FallbackCheck{"Stale Cache Exists? (>15 mins)"}
    FallbackCheck -- Yes --> ReturnStale["Return Stale Cache + is_fallback: true"]
    FallbackCheck -- No --> ReturnCleanError["Return Clean Unavailable Notice (No Fake Values)"]
```

---

## 🤖 11. AI Agriculture Assistant

FarmOS features a context-aware AI Assistant powered by the **Google Gemini API** (`gemini-3.5-flash` / fallback models).

### Intent Detection & Context Injection Architecture

```mermaid
flowchart TD
    UserMsg["User Prompt (e.g., 'Where should I sell 500 kg potato?')"] --> Intent["Intent Detection Engine"]
    
    Intent --> CheckOpportunity{"Opportunity Query?"}
    CheckOpportunity -- Yes --> RunOpp["Execute Opportunity Service"] --> AttachOppContext["Attach Market Comparison JSON"]
    
    CheckOpportunity -- No --> CheckMarket{"Mandi Price Query?"}
    CheckMarket -- Yes --> RunMarket["Fetch Mandi Prices Service"] --> AttachMarketContext["Attach Live Prices JSON"]

    CheckMarket -- No --> CheckWeather{"Weather Query?"}
    CheckWeather -- Yes --> RunWeather["Fetch Weather Service"] --> AttachWeatherContext["Attach Weather Data JSON"]

    CheckWeather -- No --> GeneralContext["General Agriculture Query"]

    AttachOppContext & AttachMarketContext & AttachWeatherContext & GeneralContext --> BuildPrompt["Inject System Instructions + Application Data Context"]
    BuildPrompt --> GeminiAPI["Call Google Gemini API"]
    GeminiAPI --> ReturnAI["Return AI Explanation + Structured Data Context"]
    ReturnAI --> UI["Render Chat Bubble + Interactive UI Components (<MarketComparison />)"]
```

---

## 🌐 12. e-NAM Integration

FarmOS provides explicit, transparent guidance regarding the **National Agriculture Market (e-NAM)**:

- **Endpoint**: `GET /api/enam/info`
- **Provided Data**:
  - Official portal links (`https://www.enam.gov.in`)
  - Stakeholder registration directories (Farmers, Mandis, Traders)
  - 5-Step APMC e-NAM trade workflow breakdown (Arrival → Assaying → Bidding → Approval → Direct e-Payment)
- **Design Philosophy**: FarmOS does not scrape e-NAM pages or fabricate private trader API credentials. It cleanly directs farmers to official government e-NAM facilities.

---

## 🔐 13. Authentication & Authorization

FarmOS enforces role-based access control using **JSON Web Tokens (JWT)** and **bcryptjs** password hashing.

```mermaid
flowchart LR
    Client["Client Request"] --> Header{"Authorization: Bearer <token>"}
    Header -- Missing --> Reject401["HTTP 401 Unauthorized"]
    Header -- Present --> VerifyJWT["authMiddleware (jwt.verify)"]
    VerifyJWT -- Invalid/Expired --> Reject401
    VerifyJWT -- Valid --> AttachUser["Attach req.user"] --> RoleCheck{"roleMiddleware(requiredRole)"}
    RoleCheck -- Authorized --> Controller["Execute Controller Action"]
    RoleCheck -- Unauthorized --> Reject403["HTTP 403 Forbidden"]
```

### Supported User Roles

| Role | Permissions |
| :--- | :--- |
| `farmer` | Create/edit/delete personal harvest listings; view incoming buyer orders; accept/reject orders |
| `buyer` | Browse marketplace; place orders for available crop harvests; view order history |
| `admin` | System-wide access; view user registry, all harvests, all orders, and platform statistics |

---

## 🛒 14. Order & Marketplace System

Farmers list available harvests; buyers place purchase orders for specific quantities.

```mermaid
sequenceDiagram
    autonumber
    actor Buyer
    participant API as FarmOS Backend
    participant DB as Neon PostgreSQL
    actor Farmer

    Buyer->>API: POST /api/orders (harvest_id, quantity)
    API->>DB: Verify harvest availability & remaining quantity
    API->>DB: INSERT INTO orders (status = 'pending')
    API-->>Buyer: Order Created (201 Created)

    Farmer->>API: GET /api/orders/incoming
    API-->>Farmer: List of pending orders

    Farmer->>API: PUT /api/orders/:id/status (status = 'accepted')
    API->>DB: BEGIN TRANSACTION
    API->>DB: FOR UPDATE lock on harvest row
    API->>DB: Deduct quantity & update harvest status
    API->>DB: UPDATE orders SET status = 'accepted'
    API->>DB: COMMIT TRANSACTION
    API-->>Farmer: Order Accepted & Inventory Updated
```

---

## 🗄️ 15. Database Architecture

FarmOS utilizes a **PostgreSQL** relational database hosted on **Neon Cloud**.

### Entity-Relationship Schema Overview

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email UK
        string password
        string role
        string phone
        string location
        timestamp created_at
    }

    HARVESTS {
        int id PK
        int farmer_id FK
        string crop_name
        decimal quantity
        string unit
        decimal price
        string location
        text description
        string status
        timestamp created_at
    }

    ORDERS {
        int id PK
        int harvest_id FK
        int buyer_id FK
        int farmer_id FK
        decimal quantity
        decimal total_price
        string status
        timestamp created_at
    }

    USERS ||--o{ HARVESTS : "manages (farmer_id)"
    USERS ||--o{ ORDERS : "places (buyer_id)"
    USERS ||--o{ ORDERS : "receives (farmer_id)"
    HARVESTS ||--o{ ORDERS : "ordered in"
```

---

## 🖥️ 16. Frontend Architecture

Built with **React 18** and **Vite**, the frontend follows a modular, component-driven layout:

- **State & Context**: `AuthContext.jsx` manages global JWT tokens, user roles, and login states.
- **Routing**: `React Router v6` with custom `<ProtectedRoute />` wrappers for role authorization.
- **HTTP Client**: Axios instance (`api/axios.js`) with request interceptors attaching Bearer tokens automatically.
- **Interactive Widgets**: Inline & floating `<MarketComparison />` and `<FarmOSAssistant />` cards.

---

## ⚙️ 17. Backend Architecture

Built with **Node.js** and **Express 5.x**, the backend enforces strict separation of concerns:

```
Request ──> Route ──> Auth/Role Middleware ──> Controller ──> Service ──> PostgreSQL / External API ──> Response
```

- **`routes/`**: Express route definitions mapping HTTP verbs to controllers.
- **`controllers/`**: Request validation, response formatting, and HTTP status handling.
- **`services/`**: Business logic, algorithm calculations, caching, and external API requests.
- **`config/`**: Database connection pool (`db.js`) and Swagger OpenAPI spec (`swagger.js`).

---

## 📁 18. Project Structure

```
FarmOs/
├── backend/
│   ├── config/
│   │   ├── db.js                 # PostgreSQL Pool connection setup (Neon DB)
│   │   ├── logisticsRates.js     # Freight vehicle capacities & per-km rate config
│   │   └── swagger.js            # OpenAPI / Swagger specification
│   ├── controllers/
│   │   ├── adminController.js    # Admin dashboard & management logic
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── chatController.js     # AI assistant intent detection & routing
│   │   ├── enamController.js     # e-NAM official resources controller
│   │   ├── harvestController.js  # Crop harvest CRUD operations
│   │   ├── logisticsController.js# Freight estimation & vehicle options controller
│   │   ├── marketController.js   # Live Mandi price query controller
│   │   ├── opportunityController.js # Market Opportunity engine controller
│   │   ├── orderController.js    # Buyer & farmer order workflow controller
│   │   └── weatherController.js  # Weather intelligence controller
│   ├── database/
│   │   └── schema.sql            # PostgreSQL DDL table creation script
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   └── roleMiddleware.js     # Role-based authorization middleware
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── enamRoutes.js
│   │   ├── harvestRoutes.js
│   │   ├── logisticsRoutes.js
│   │   ├── marketRoutes.js
│   │   ├── opportunityRoutes.js
│   │   ├── orderRoutes.js
│   │   └── weatherRoutes.js
│   ├── services/
│   │   ├── chatService.js        # Gemini AI integration & prompt builder
│   │   ├── enamService.js        # e-NAM guidance & APMC info service
│   │   ├── logisticsService.js   # Road routing (OpenRouteService + Haversine fallback)
│   │   ├── marketService.js      # Govt Agmarknet (data.gov.in) API service
│   │   ├── opportunityService.js # Opportunity calculation & Net Return ranking engine
│   │   └── weatherService.js     # Open-Meteo service with 15-min Map cache
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies & scripts
│   └── server.js                 # Express server entry point
│
├── docs/
│   └── images/                   # Screenshots for documentation
│       ├── floating_assistant.png
│       ├── landing_page.png
│       └── mandi_prices.png
│
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios modules (auth, harvest, market, weather, chat, opp)
│   │   ├── components/           # UI components (Navbar, Footer, MarketComparison, etc.)
│   │   ├── context/              # AuthContext.jsx
│   │   ├── layouts/              # MainLayout.jsx, DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/            # AdminDashboard.jsx
│   │   │   ├── buyer/            # BuyerDashboard.jsx, Marketplace.jsx
│   │   │   ├── farmer/           # FarmerDashboard.jsx
│   │   │   └── public/           # LandingPage, MarketPricesPage, WeatherPage, Login, Register
│   │   ├── App.jsx               # Application routes
│   │   └── main.jsx              # React entry point
│   ├── package.json              # Frontend dependencies & Vite scripts
│   └── vite.config.js            # Vite build configuration
│
└── README.md                     # Primary repository documentation
```

---

## 🔌 19. API Endpoint Documentation

| Method | Endpoint | Description | Auth Required | Allowed Roles |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/auth/register` | Register new user | ❌ Public | All |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | ❌ Public | All |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ Yes | All |
| `GET` | `/api/market/prices` | Query live Mandi prices (Agmarknet) | ❌ Public | All |
| `GET/POST`| `/api/opportunities/compare`| Compare markets, compute scores & Net Return | ❌ Public | All |
| `POST/GET`| `/api/logistics/estimate`| Calculate road routing & Estimated Freight Cost | ❌ Public | All |
| `GET` | `/api/logistics/vehicles`| Get vehicle capacities & transport rate schedule | ❌ Public | All |
| `GET` | `/api/weather` | Fetch hyper-local weather & 7-day forecast | ❌ Public | All |
| `POST` | `/api/chat` | Send prompt to AI Assistant | ❌ Public | All |
| `GET` | `/api/enam/info` | Retrieve official e-NAM market resources | ❌ Public | All |
| `POST` | `/api/harvests` | Create new crop harvest listing | ✅ Yes | `farmer` |
| `GET` | `/api/harvests` | Get all available harvests | ❌ Public | All |
| `GET` | `/api/harvests/:id` | Get single harvest details | ❌ Public | All |
| `PUT` | `/api/harvests/:id` | Update harvest listing | ✅ Yes | `farmer` |
| `DELETE`| `/api/harvests/:id` | Delete harvest listing | ✅ Yes | `farmer` |
| `POST` | `/api/orders` | Place purchase order for a harvest | ✅ Yes | `buyer` |
| `GET` | `/api/orders/my-orders` | Get buyer's placed orders | ✅ Yes | `buyer` |
| `GET` | `/api/orders/incoming` | Get farmer's incoming orders | ✅ Yes | `farmer` |
| `PUT` | `/api/orders/:id/status` | Accept or reject an order | ✅ Yes | `farmer` |
| `GET` | `/api/admin/users` | Get all registered users | ✅ Yes | `admin` |
| `GET` | `/api/admin/harvests` | Get all harvests | ✅ Yes | `admin` |
| `GET` | `/api/admin/orders` | Get all orders | ✅ Yes | `admin` |
| `GET` | `/api/admin/dashboard` | Get platform metrics | ✅ Yes | `admin` |
| `GET` | `/api-docs` | Interactive Swagger UI | ❌ Public | All |

---

## 🛠️ 20. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 | Declarative component-driven user interface |
| **Build Tool** | Vite 6.0 | Fast HMR development server and optimized bundle build |
| **Routing** | React Router DOM v6 | Client-side page navigation & route protection |
| **HTTP Client** | Axios 1.7 | Promise-based REST API integration with token interceptors |
| **Backend Runtime** | Node.js | Cross-platform JavaScript runtime environment |
| **Server Framework** | Express 5.0 | High-performance HTTP server & middleware routing |
| **Database** | PostgreSQL | Enterprise-grade relational database management |
| **Database Host** | Neon Cloud | Serverless PostgreSQL cloud database service |
| **Authentication** | JSON Web Tokens & bcryptjs | Stateless authorization tokens & secure password hashing |
| **API Documentation**| Swagger UI Express & swagger-jsdoc | OpenAPI 3.0 visual API specification |
| **Market Data Feed** | Govt of India Agmarknet | Official daily APMC mandi commodity prices (`data.gov.in`) |
| **Weather Engine** | Open-Meteo REST API | Free agricultural weather metrics and daily forecasts |
| **AI Engine** | Google Gemini API | Advanced LLM reasoning for agriculture guidance |

---

## 🔑 21. Environment Variables

### Backend Configuration (`backend/.env`)
```env
# Server Port
PORT=5000

# Neon PostgreSQL Database Connection String
DATABASE_URL=postgresql://user:password@ep-lucky-fog.neon.tech/farmos?sslmode=require

# JWT Secret Key for Token Verification
JWT_SECRET=your_super_secret_jwt_key_here

# Government Data.gov.in Agmarknet API Key
DATA_GOV_API_KEY=your_datagov_api_key_here

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend Client Origin for CORS
CLIENT_URL=https://farm-os-beta-roan.vercel.app
```

### Frontend Configuration (`frontend/.env`)
```env
# Backend API Base URL
VITE_API_URL=https://farmos-df0q.onrender.com/api
```

> ⚠️ **Security Policy**: Never commit `.env` files containing real production credentials to public GitHub repositories.

---

## 💻 22. Local Development Setup

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)
- Git

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sujitkr268/FarmOs.git
   cd FarmOs
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `backend/` using the template provided above.
   Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend will run at: `http://localhost:5000`*

3. **Frontend Setup**:
   Open a second terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Frontend will run at: `http://localhost:5173`*

---

## ☁️ 23. Deployment Architecture

FarmOS is deployed across modern cloud platforms:

```mermaid
flowchart LR
    Browser["User Browser"] -->|HTTPS| Vercel["Vercel (React Frontend)\nhttps://farm-os-beta-roan.vercel.app"]
    Vercel -->|REST Calls| Render["Render (Node.js Backend)\nhttps://farmos-df0q.onrender.com"]
    Render -->|SSL Query| Neon["Neon Cloud (PostgreSQL DB)"]
    
    subgraph External ["External Third-Party APIs"]
        Agmarknet["data.gov.in"]
        OpenMeteo["Open-Meteo"]
        Gemini["Google Gemini"]
    end

    Render -->|Fetch Prices| Agmarknet
    Render -->|Fetch Weather| OpenMeteo
    Render -->|Generate AI Response| Gemini
```

---

## 🔒 24. Security Practices

- **Password Encryption**: All user passwords are salted and hashed using `bcryptjs` before DB insertion.
- **Backend-Only Secrets**: Sensitive API keys (`GEMINI_API_KEY`, `DATA_GOV_API_KEY`, `DATABASE_URL`) are stored strictly in the backend environment and never exposed to the client.
- **SQL Injection Prevention**: Database interactions use parameterized queries (`$1`, `$2`) provided by `pg`.
- **CORS Restrictions**: Configured whitelist restricts cross-origin access to authorized Vercel frontend domains.

---

## 🧪 25. Testing & Verification

- **API Verification**: Endpoints verified using cURL, Postman, and Node fetch scripts.
- **Swagger Documentation**: Interactive OpenAPI interface available at `/api-docs`.
- **Production Build Validation**: Frontend compiled using Vite (`npm run build`) with zero TypeScript/JSX bundle errors.

---

## ⚠️ 26. Current Limitations

- **Distance Calculation**: Exact road distances to APMC mandis are currently marked as *"Not available"* because government API feeds do not provide GPS coordinates for individual mandis.
- **Transport Freight Costs**: Estimated transport freight costs are marked *"Not available"* due to variable local transport tariffs.
- **Live Bidding Integration**: FarmOS does not participate directly in private e-NAM auction bidding rooms (only official e-NAM portal guidance is provided).

---

## 🔮 27. Future Scope

### 💳 1. Payment Gateway Integration
- Escrow-backed digital payments via Razorpay / UPI.
- Payment confirmation receipts and digital invoices.

### 🚚 2. Smart Freight Logistics
- Integration with local transport providers for freight truck matching.
- Automatic distance calculation & road toll estimation.

### 🔔 3. Automated Push Notifications
- WhatsApp and SMS price drop alerts when local mandi rates spike.
- Weather warning alerts prior to extreme rainfall events.

### 📈 4. Predictive Analytics & ML Forecasting
- Machine learning models for 30-day crop price forecasting.
- Seasonal demand pattern analysis for regional markets.

---

## 📐 28. Future-Proof Architecture

```mermaid
flowchart TD
    subgraph Core ["FarmOS Current Core Platform"]
        C1["Auth System"]
        C2["Harvest Management"]
        C3["Market Opportunity Engine"]
        C4["Weather Intelligence"]
        C5["AI Assistant"]
        C6["Order System"]
    end

    subgraph FutureExt ["Future Module Extensions"]
        F1["🔮 Payment Gateway (Razorpay/UPI)"]
        F2["🔮 Smart Freight Logistics & Fleet Matching"]
        F3["🔮 WhatsApp / SMS Alert Engine"]
        F4["🔮 Predictive Price Forecasting ML Models"]
        F5["🔮 Multilingual Voice AI Assistant"]
    end

    Core -->|Extensible REST Hooks| FutureExt
```

---

## 🌍 29. Social Impact & Farmer Empowerment

FarmOS directly addresses **United Nations Sustainable Development Goals (SDG 1 & SDG 8)**:
- **Reducing Exploitation**: By providing direct access to regional market prices, farmers avoid selling below market value to local middlemen.
- **Democratizing Information**: Gives smallholder farmers access to the same market intelligence previously available only to large commercial traders.

---

## 💎 30. FarmOS Value Proposition

$$\text{RAW DATA} \longrightarrow \text{INTELLIGENCE} \longrightarrow \text{DECISION} \longrightarrow \text{ACTION}$$

FarmOS does not just display data; it converts raw government data into clear decision support that helps farmers make profitable choices.

---

## 🔄 31. Complete End-to-End System Flow

```mermaid
flowchart TD
    Farmer(["Farmer"]) -->|Login / Register| Auth["JWT Auth"]
    Auth -->|Add Crop Harvest| HarvestDB[("Neon PostgreSQL DB")]
    
    Farmer -->|Search Market Opportunities| OppController["Opportunity Controller"]
    OppController -->|Fetch Mandi Data| Agmarknet["Govt Agmarknet API"]
    Agmarknet -->|Raw Market Prices| OppService["Opportunity Engine Service"]
    
    OppService -->|Compute Gross Returns & Opportunity Scores| RankResult["Ranked Markets Payload"]
    RankResult -->|Display UI| UI["Market Comparison UI Card"]
    
    Farmer -->|Ask Floating AI Assistant| ChatController["Chat Controller"]
    ChatController -->|Inject Opportunity Context| Gemini["Google Gemini AI"]
    Gemini -->|Actionable Selling Advice| UI

    Buyer(["Verified Buyer"]) -->|Browse Marketplace| UI
    Buyer -->|Place Order| OrderSystem["Order Controller"]
    OrderSystem -->|Atomic DB Transaction| HarvestDB
    OrderSystem -->|Notify Farmer| Farmer
```

---

## 📋 32. Project Status Overview

### ✅ Implemented
- [x] Full-Stack React + Node.js + PostgreSQL Architecture
- [x] JWT Authentication & Role Middleware (`farmer`, `buyer`, `admin`)
- [x] Live Govt Mandi Prices API (`data.gov.in` / Agmarknet)
- [x] Market Opportunity Engine (Gross Returns & FarmOS Opportunity Score)
- [x] Weather Intelligence Service with 15-minute Map Cache & Open-Meteo Integration
- [x] Site-Wide Floating AI Assistant with Google Gemini API
- [x] Buyer Marketplace & Order Management with Atomic Transactions
- [x] e-NAM Official Resources & Workflow Integration
- [x] OpenAPI / Swagger Interactive Documentation (`/api-docs`)

### 🔮 Future Scope
- [ ] Digital Payment Gateway (Razorpay/UPI)
- [ ] Freight Logistics & Distance Matrix API Integration
- [ ] WhatsApp / SMS Automated Price Spike Alerts
- [ ] Predictive Price Trends Machine Learning Model

---

## ⚖️ 33. Commercial Disclaimer

> **Disclaimer**: FarmOS is a decision-support prototype platform. Market prices, weather forecasts, and commodity trends are derived from third-party government and open data services (`data.gov.in`, `api.open-meteo.com`). Opportunity scores and calculated gross values are estimated decision-support indicators and do not constitute guaranteed commercial returns or financial advice. Users should verify critical commercial transactions independently.

---

## 🏁 34. Final Summary

FarmOS connects every harvest to its best opportunity by combining real agricultural market data, market comparison, opportunity scoring, weather intelligence, context-aware AI guidance, and a future-ready marketplace architecture.

```
  🌱 GROW       ──>   🌾 HARVEST   ──>   📊 UNDERSTAND   ──>   ⚖️ COMPARE
                                                                     │
  💰 SELL       <──   🤝 CONNECT   <──   🏆 CHOOSE       <───────┘
```

---
*Maintained by the FarmOS Development Team • Built for Smart India Hackathon & Open-Source Agricultural Innovation.*
