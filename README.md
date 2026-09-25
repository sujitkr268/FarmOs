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

## 🏛️ Verified Agricultural Business & Trader Directory

FarmOS provides a transparent, dual-category directory that strictly separates **External Public Businesses** from **Voluntarily Registered FarmOS Buyers**:

### 1. Public Trader / Business Directory (`public_traders`)
- Real existing agricultural businesses discovered from legitimate public/official sources (APEDA, WBSAMB, APMCs, WB Rice Millers Association, Government MSME Udyam).
- No registration required on FarmOS.
- Stores only publicly available business info + source/evidence URLs.
- **Verification Levels**:
  - 🟢 **FarmOS Verified Business** (`source_verified`): Supported by government registration/statutory board evidence (APEDA, WBSAMB, APMC license).
  - 🌐 **Public Business Information** (`website_verified`): Verified official business website exists.
  - 🏢 **Public Business Listing** (`unverified` / `needs_review`): Public market yard directory listing without independent government reference.

### 2. FarmOS Registered & Verified Buyers (`users` table, `role = 'buyer'`)
- Voluntary registration on FarmOS.
- Requires email/phone registration, buyer profile, optional e-NAM / Udyam reference, and admin review (`pending` → `verified` / `rejected`).
- **Privacy & Consent Control**: Phone and email contact details are displayed **ONLY** when `show_contact_publicly = true`.

### API Endpoints
- `GET /api/traders` (Filters: `state`, `district`, `mandi`, `commodity`, `business_type`, `verification_status`)
- `GET /api/traders/:id`
- `GET /api/buyers` (Filters: `state`, `district`, `commodity`, `verification_status`)
- `GET /api/buyers/:id`
- `PUT /api/buyers/profile` (Protected buyer profile update)
- `GET /api/admin/buyers/pending` (Admin review)
- `PUT /api/admin/buyers/:id/verify` (Admin approval)
- `PUT /api/admin/buyers/:id/reject` (Admin rejection)
- `POST /api/admin/traders`, `PUT /api/admin/traders/:id`, `DELETE /api/admin/traders/:id` (Admin directory management)

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
FarmOS provides calculated decision support. It does not guarantee market prices, buyers, transportation rates, or commercial profits.

❓ 2. Problem Statement

Indian farmers frequently face the following challenges:

┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│     Price Asymmetry       │     │   Lack of Comparisons     │     │     Data Isolation        │
│ Farmers know what crop    │     │ Mandi price lists exist   │     │ Weather, prices, buyer    │
│ they have, but do not know│ --> │ but do not compare market │ --> │ information and transport│
│ which market may provide  │     │ returns for a specific    │     │ data exist separately.    │
│ better returns.           │     │ harvest quantity.         │     │                           │
└───────────────────────────┘     └───────────────────────────┘     └───────────────────────────┘
Raw Data vs. Actionable Decision Support
Dimension	Raw Government Mandi Data	FarmOS Decision Support
Output Type	Static price records	Evaluated market opportunities
Quantity Context	Price per quintal	Farmer's actual harvest quantity
Return Calculation	Manual arithmetic required	Estimated gross value calculated automatically
Market Comparison	Individual market records	Multiple markets compared together
Transportation	Not included	Estimated road distance and freight
Net Return	Not available directly	Estimated gross value minus estimated freight
Guidance	Limited to raw data	Opportunity ranking + AI explanation
Buyer Discovery	Separate process	Potential buyer/trader discovery
💡 3. The FarmOS Solution

FarmOS unifies agricultural data feeds, internal harvest listings, logistics calculations, and AI reasoning into an integrated workflow:

FarmOS does not replace government mandis or guarantee earnings. It provides calculated information to help farmers compare selling opportunities.

📊 4. Key Features Status
Feature	Description	Status
JWT Authentication	Secure registration and login for Farmers, Buyers, and Admins	✅ Implemented
Role-Based Access	Middleware enforcing farmer, buyer, and admin permissions	✅ Implemented
Harvest Management	Farmers can create, read, update, and delete crop harvest listings	✅ Implemented
Mandi Market Prices	Government of India Agmarknet/data.gov.in market price integration	✅ Implemented
Opportunity Engine	Compares available markets using deterministic calculations	✅ Implemented
FarmOS Opportunity Score	0–100 score based on price strength and consistency	✅ Implemented
Smart Freight Logistics	Road routing, vehicle selection, freight estimation, and fallback routing	✅ Implemented
Estimated Net Return	Estimated gross value minus estimated freight cost	✅ Implemented
Weather Intelligence	Current weather and 7-day forecast using Open-Meteo	✅ Implemented
Weather Caching	15-minute in-memory cache with fallback handling	✅ Implemented
AI Agriculture Assistant	Context-aware chatbot powered by Google Gemini API	✅ Implemented
Floating Assistant	Site-wide floating AI assistant	✅ Implemented
Buyer Marketplace	Buyers can browse available farmer harvests	✅ Implemented
Order Management	Buyers place orders and farmers accept/reject them	✅ Implemented
Public Trader Directory	Public agricultural businesses and trader information	✅ Implemented
Potential Buyer Discovery	Commodity and location-based buyer matching	✅ Implemented
Buyer Verification	FarmOS registered buyer verification workflow	✅ Implemented
Farmer/Buyer Trust System	Platform-level verification and trust badges	✅ Implemented
Buyer Privacy Controls	Public contact information consent controls	✅ Implemented
e-NAM Guidance	Official e-NAM resources and workflow guidance	✅ Implemented
English & Hindi Interface	Static interface localization with language persistence	✅ Implemented
Swagger API Docs	Interactive OpenAPI documentation at /api-docs	✅ Implemented
Digital Payments	Online payment / escrow integration	🔮 Future Scope
WhatsApp/SMS Alerts	Automated price and weather notifications	🔮 Future Scope
Predictive Analytics	Machine-learning based price forecasting	🔮 Future Scope
🚀 5. Core Innovation — Market Opportunity Engine

Simply listing raw market prices requires the farmer to manually compare markets, convert quantities, estimate revenue, and consider transportation costs.

The FarmOS Market Opportunity Engine automates this process:

The engine separates the calculation layer from the AI explanation layer.

This means market prices, freight calculations, and opportunity scores are calculated by FarmOS services rather than being invented by the AI assistant.

🏗️ 6. Complete System Architecture
🔄 7. Farmer Decision Workflow
🧮 8. Market Opportunity Engine Deep-Dive
8.1 Unit Conversion

Agmarknet prices are reported per quintal.

1 Quintal = 100 kg

Formula:

Quantity in Quintals = Quantity in kg / 100

Example:

500 kg = 5 quintals
8.2 Estimated Gross Value
Estimated Gross Value
= Quantity in Quintals × Modal Price

Example:

5 quintals × ₹2,500/quintal
= ₹12,500 estimated gross value
8.3 FarmOS Opportunity Score

The FarmOS Opportunity Score ranges from 0 to 100.

Opportunity Score
= Price Score + Consistency Score

The score is capped at 100.

Price Ratio Score
Price Score =
(Selected Market Modal Price /
Highest Modal Price in Dataset) × 70
Price-Range Consistency Score
Consistency Ratio =
Minimum Price / Maximum Price
Consistency Score =
Consistency Ratio × 30

The score is an analytical indicator used for comparing available market records. It is not a guarantee of future price performance.

🚚 8.4 Smart Freight Logistics & Estimated Net Return

A market with a higher selling price may not produce the highest estimated net return when transportation costs are considered.

FarmOS therefore integrates a Smart Freight Logistics Engine.

Vehicle Requirement
Vehicles Required =
CEILING(Quantity in kg / Vehicle Capacity)
Trip Cost
Trip Cost =
MAX(Minimum Charge, Road Distance × Base Rate)
Estimated Freight Cost
Estimated Freight Cost =
Trip Cost × Number of Vehicles
Estimated Net Return
Estimated Net Return =
Estimated Gross Revenue - Estimated Freight Cost
Vehicle Configuration
Vehicle Category	Typical Vehicle	Capacity	Base Rate	Minimum Charge
Mini Truck	Tata Ace / Bolero Pickup	1,000 kg	₹20/km	₹500
Small Truck	Eicher / Canter	3,000 kg	₹30/km	₹1,000
Medium Truck	6-Wheeler / 17ft Eicher	9,000 kg	₹45/km	₹2,000
Heavy Truck	10-Wheeler / Multi-Axle	20,000 kg	₹65/km	₹3,500

These are FarmOS-configured estimates for decision support and are not guaranteed real-world transport quotations.

Routing Strategy

FarmOS uses the following routing hierarchy:

OpenRouteService for road distance and travel time.
Known APMC coordinate data where available.
Haversine geographical estimation fallback when live routing is unavailable.
A road-circuity factor may be applied to geographical fallback distances.

When logistics data is available, candidate markets can be re-ranked using estimated net return.

🏛️ 9. Government Market Data Integration

FarmOS integrates with the official Government of India data ecosystem through the Agmarknet dataset available on data.gov.in.

Schema & Fields
Field	Description
state	State where the mandi is located
district	District of the mandi
market	Official market/APMC name
commodity	Crop or commodity
variety	Commodity variety
grade	Reported quality grade
arrival_date	Market arrival reporting date
min_price	Minimum reported price in ₹/quintal
max_price	Maximum reported price in ₹/quintal
modal_price	Modal price in ₹/quintal

FarmOS does not claim ownership of government data. Market figures displayed by FarmOS reflect available records from the government data feed.

🌤️ 10. Weather Intelligence & Caching

FarmOS integrates the Open-Meteo REST API for weather information.

The weather service provides:

Current weather information
Daily forecast information
Agricultural decision context
Backend caching
Graceful handling of upstream failures
Caching Architecture

FarmOS does not generate fake weather values when the upstream service is unavailable.

🤖 11. AI Agriculture Assistant

FarmOS includes a context-aware AI Agriculture Assistant powered by the Google Gemini API.

The assistant can help explain:

Mandi prices
Market opportunities
Weather information
Freight and transportation
Selling decisions
General agriculture questions
Context Injection

The AI assistant is designed to explain FarmOS calculations and available data, rather than independently inventing market prices, freight costs, or guaranteed selling outcomes.

🌐 12. e-NAM Integration

FarmOS provides transparent guidance regarding the National Agriculture Market (e-NAM).

Provided Information
Official e-NAM portal resources
Stakeholder information
APMC/e-NAM workflow guidance
Registration guidance
Trading process explanation
Official links

FarmOS does not scrape private e-NAM trader registration information or expose private trader credentials.

FarmOS acts as an information and decision-support layer around the official e-NAM ecosystem.

🏢 13. Verified Agricultural Business & Buyer Directory

FarmOS separates public agricultural businesses from voluntarily registered FarmOS buyers.

13.1 Public Trader / Agricultural Business Directory

The public trader directory can contain agricultural businesses supported by legitimate public or official sources.

Sources may include:

APEDA
WBSAMB
APMC/public market information
Agricultural business websites
Public business information

Each record can contain source/evidence information.

Verification Levels
FarmOS Verified Business
        ↓
Supported by available official/public evidence

Public Business Information
        ↓
Official/public business information available

Public Business Listing
        ↓
Public listing requiring additional review

These labels describe the evidence available to FarmOS and are not government certifications.

13.2 FarmOS Registered Buyers

Registered buyers can provide:

Business name
Contact person
State
District
Mandi
Commodities
Buying capacity
e-NAM reference
Udyam reference
Official website
Public contact preference
13.3 FarmOS Buyer Verification

Registered buyers can move through a platform verification process:

Registered Buyer
      ↓
Profile Information
      ↓
Verification Review
      ↓
Pending
      ↓
Verified / Rejected

FarmOS verification is a platform-level trust status and does not represent government certification.

13.4 Privacy

Buyer contact information is only displayed publicly when the buyer has enabled the appropriate public-contact preference.

🔐 14. Authentication & Authorization

FarmOS uses:

JSON Web Tokens (JWT)
bcryptjs password hashing
Authentication middleware
Role-based authorization middleware
Supported Roles
Role	Main Permissions
farmer	Manage harvests, view orders, manage incoming orders
buyer	Browse marketplace, place orders, manage buyer profile
admin	Administrative management, verification and platform oversight
Trust / Verification Status

User roles and verification status are separate concepts.

Examples:

Registered Farmer
FarmOS Verified Farmer

Registered Buyer
FarmOS Verified Buyer

Verification does not change the user's underlying role.

🛒 15. Order & Marketplace System

Farmers can create harvest listings and buyers can place orders.

Atomic database transactions help prevent conflicting harvest quantity updates.

🗄️ 16. Database Architecture

FarmOS uses PostgreSQL hosted on Neon Cloud.

Core Data Models

The project includes core models for:

Users
Harvests
Orders
Public agricultural businesses/traders
Buyer verification/profile information
Simplified Relationship
USERS
 │
 ├── FARMER
 │      └── HARVESTS
 │              └── ORDERS
 │
 ├── BUYER
 │      └── ORDERS
 │
 └── ADMIN
        └── Verification / Management

PUBLIC_TRADERS
      └── Public Agricultural Business Information
Buyer Profile Information

The buyer profile system can include:

business_name
contact_person
state
district
mandi
commodities
buying_capacity
enam_reference
udyam_reference
official_website
show_contact_publicly
verification_status
verification_notes

Sensitive verification information is not intended for public exposure.

🖥️ 17. Frontend Architecture

FarmOS uses React 18 + Vite.

Main Frontend Responsibilities
UI rendering
Route management
Authentication state
API communication
Market comparison
Weather presentation
AI assistant interface
Marketplace
Farmer dashboard
Buyer dashboard
Admin dashboard
English/Hindi localization
Main Frontend Architecture
React Application
       ↓
React Router
       ↓
Layouts
       ↓
Pages
       ↓
Reusable Components
       ↓
Context / State
       ↓
Axios API Client
       ↓
FarmOS Backend
Authentication

AuthContext.jsx manages authentication state and user information.

API Client

Axios is used for REST API communication, including authentication token handling.

Localization

English and Hindi translations are stored locally and selected through the application's language context.

⚙️ 18. Backend Architecture

FarmOS backend is built with Node.js and Express.

Request
   ↓
Route
   ↓
Authentication / Role Middleware
   ↓
Controller
   ↓
Service
   ↓
PostgreSQL / External API
   ↓
Response
Backend Layers
Routes

Define HTTP endpoints.

Controllers

Handle request validation, response formatting, and HTTP status codes.

Services

Contain:

Market data integration
Opportunity calculations
Logistics calculations
Weather integration
AI integration
e-NAM information
Business logic
Middleware

Handles:

JWT authentication
Role-based authorization
📁 19. Project Structure
FarmOs/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── logisticsRates.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── enamController.js
│   │   ├── harvestController.js
│   │   ├── logisticsController.js
│   │   ├── marketController.js
│   │   ├── opportunityController.js
│   │   ├── orderController.js
│   │   └── weatherController.js
│   │
│   ├── database/
│   │   └── schema.sql
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
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
│   │
│   ├── services/
│   │   ├── chatService.js
│   │   ├── enamService.js
│   │   ├── logisticsService.js
│   │   ├── marketService.js
│   │   ├── opportunityService.js
│   │   └── weatherService.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── docs/
│   └── images/
│       ├── floating_assistant.png
│       ├── landing_page.png
│       └── mandi_prices.png
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── buyer/
│   │   │   ├── farmer/
│   │   │   └── public/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
🔌 20. API Endpoint Documentation
Authentication
Method	Endpoint	Description	Auth
POST	/api/auth/register	Register user	❌
POST	/api/auth/login	Login and receive JWT	❌
GET	/api/auth/profile	Get current profile	✅
Market
Method	Endpoint	Description	Auth
GET	/api/market/prices	Query Agmarknet market prices	❌
Opportunity Engine
Method	Endpoint	Description	Auth
GET/POST	/api/opportunities/compare	Compare market opportunities	❌
POST	/api/opportunities/evaluate	Evaluate selling opportunities	❌
Logistics
Method	Endpoint	Description	Auth
GET	/api/logistics/vehicles	Get vehicle configuration	❌
GET	/api/logistics/estimate	Estimate logistics	❌
POST	/api/logistics/estimate	Calculate freight and routing	❌
Weather
Method	Endpoint	Description	Auth
GET	/api/weather	Current weather and forecast	❌
AI Assistant
Method	Endpoint	Description	Auth
POST	/api/chat	Send message to AI assistant	❌
e-NAM
Method	Endpoint	Description	Auth
GET	/api/enam/info	e-NAM information and official resources	❌
Harvests
Method	Endpoint	Description	Auth
POST	/api/harvests	Create harvest	Farmer
GET	/api/harvests	Get available harvests	❌
GET	/api/harvests/:id	Get harvest details	❌
PUT	/api/harvests/:id	Update harvest	Farmer
DELETE	/api/harvests/:id	Delete harvest	Farmer
Orders
Method	Endpoint	Description	Auth
POST	/api/orders	Place order	Buyer
GET	/api/orders/my-orders	Buyer's orders	Buyer
GET	/api/orders/incoming	Farmer's incoming orders	Farmer
PUT	/api/orders/:id/status	Accept/reject order	Farmer
Public Traders
Method	Endpoint	Description	Auth
GET	/api/traders	Search/filter public traders	❌
GET	/api/traders/:id	Get trader details	❌
Buyers
Method	Endpoint	Description	Auth
GET	/api/buyers	Search verified buyers	❌
GET	/api/buyers/:id	Get buyer information	❌
PUT	/api/buyers/profile	Update buyer profile	Buyer
Admin Buyer Verification
Method	Endpoint	Description	Auth
GET	/api/admin/buyers/pending	View pending buyers	Admin
PUT	/api/admin/buyers/:id/verify	Verify buyer	Admin
PUT	/api/admin/buyers/:id/reject	Reject buyer	Admin
Admin Trader Management
Method	Endpoint	Description	Auth
POST	/api/admin/traders	Create trader record	Admin
PUT	/api/admin/traders/:id	Update trader	Admin
DELETE	/api/admin/traders/:id	Delete trader	Admin
Admin
Method	Endpoint	Description	Auth
GET	/api/admin/users	User registry	Admin
GET	/api/admin/harvests	All harvests	Admin
GET	/api/admin/orders	All orders	Admin
GET	/api/admin/dashboard	Platform statistics	Admin
API Documentation
GET /api-docs

Provides interactive Swagger/OpenAPI documentation.

🛠️ 21. Technology Stack
Layer	Technology	Purpose
Frontend UI	React 18	Component-based user interface
Build Tool	Vite	Development server and production build
Routing	React Router DOM	Client-side navigation and route protection
HTTP Client	Axios	REST API communication
State Management	React Context API	Authentication and language state
Styling	CSS3	Application styling and responsive layout
Backend Runtime	Node.js	Server-side JavaScript runtime
Server Framework	Express 5	REST API and middleware
Database	PostgreSQL	Relational database
Database Host	Neon Cloud	Managed PostgreSQL hosting
Authentication	JWT	Stateless authentication
Password Security	bcryptjs	Password hashing
API Documentation	Swagger / OpenAPI	Interactive API documentation
Market Data	Government Agmarknet / data.gov.in	Mandi market prices
Weather	Open-Meteo	Weather and forecast data
Routing / Logistics	OpenRouteService	Road distance and travel-time routing
AI Engine	Google Gemini API	Context-aware agricultural assistant
Deployment	Vercel	Frontend hosting
Backend Hosting	Render	Backend hosting
Repository	GitHub	Source control
🔑 22. Environment Variables
Backend

Create:

backend/.env

Example:

PORT=5000

DATABASE_URL=your_neon_postgresql_connection_string

JWT_SECRET=your_jwt_secret

DATA_GOV_API_KEY=your_datagov_api_key

GEMINI_API_KEY=your_gemini_api_key

OPENROUTESERVICE_API_KEY=your_openrouteservice_api_key

CLIENT_URL=https://farm-os-beta-roan.vercel.app
Frontend

Create:

frontend/.env

Example:

VITE_API_URL=http://localhost:5000/api

For production:

VITE_API_URL=https://farmos-df0q.onrender.com/api

⚠️ Never commit real API keys, database credentials, JWT secrets, or production .env files to GitHub.

💻 23. Local Development Setup
Prerequisites
Node.js 18+
npm
Git
1. Clone Repository
git clone https://github.com/sujitkr268/FarmOs.git
cd FarmOs
2. Backend
cd backend
npm install

Create .env using the required variables.

Start backend:

npm run dev

Backend:

http://localhost:5000
3. Frontend

Open another terminal:

cd frontend
npm install

Create:

VITE_API_URL=http://localhost:5000/api

Start:

npm run dev

Frontend:

http://localhost:5173
☁️ 24. Deployment Architecture

FarmOS is deployed using Vercel, Render, Neon, and GitHub.

Production Services

Frontend:

https://farm-os-beta-roan.vercel.app

Backend:

https://farmos-df0q.onrender.com

Backend API:

https://farmos-df0q.onrender.com/api
🔒 25. Security Practices

FarmOS follows several security practices:

Password Security

Passwords are hashed using bcryptjs.

JWT Authentication

Authenticated requests use JWT bearer tokens.

Backend Secrets

Sensitive API keys are stored on the backend and are not intended to be exposed through the frontend.

SQL Injection Protection

Database operations use parameterized PostgreSQL queries.

Role-Based Authorization

Protected backend routes use role middleware.

Contact Privacy

Buyer contact details are only exposed publicly according to the buyer's public-contact preference.

Verification Privacy

Verification information is handled through protected administrative workflows and is not intended to expose sensitive documents publicly.

Environment Security

Production credentials must remain outside public source control.

🧪 26. Testing & Verification

FarmOS testing includes:

Backend API verification
Authentication testing
Market API testing
Weather API testing
Logistics testing
Opportunity engine testing
Buyer/trader verification testing
Marketplace testing
Order workflow testing
Frontend production build testing
Frontend Build
npm run build

The production frontend is built using Vite.

API Documentation

Swagger/OpenAPI documentation is available through:

/api-docs
Important Validation Areas
Authentication
Market Data
Opportunity Calculation
Logistics Calculation
Weather
AI Assistant
Marketplace
Orders
Buyer Verification
Trader Directory
API Security
Frontend Build
⚠️ 27. Current Limitations

FarmOS is a decision-support prototype and has several practical limitations.

Market Data

Mandi prices depend on the availability and freshness of the government data feed.

Road Routing

OpenRouteService routing depends on:

API availability
valid coordinates
routing service response

FarmOS includes coordinate and geographical fallback mechanisms where applicable.

Freight Estimates

Freight rates are FarmOS-configured estimates based on vehicle capacity and configured rates.

They are not live transport-provider quotations.

Market Availability

The presence of a market price record does not guarantee that a farmer can immediately sell a specific quantity at that price.

Buyer Discovery

A potential buyer match does not guarantee a purchase or transaction.

AI

AI-generated explanations should be treated as contextual assistance and not as guaranteed financial, legal, agricultural, or commercial advice.

e-NAM

FarmOS provides official e-NAM guidance but does not directly participate in private e-NAM auction bidding.

🔮 28. Future Scope
💳 1. Digital Payment Gateway
Razorpay / UPI integration
Digital payment confirmation
Digital invoices
Optional escrow-style workflows
🚚 2. Advanced Freight Marketplace
Real-time transport-provider matching
Live freight quotations
Fleet availability
Toll estimation
Transport-provider discovery
🔔 3. Automated Notifications
WhatsApp price alerts
SMS notifications
Weather warnings
Opportunity alerts
📈 4. Predictive Market Intelligence
Historical price analysis
Price trend visualization
Machine-learning forecasting
Seasonal demand analysis
🎙️ 5. Multilingual Voice Assistant
Voice-based farmer interaction
Additional Indian languages
Speech-to-text
Text-to-speech
📐 29. Future-Proof Architecture

FarmOS is designed so additional services can be connected through the existing REST API architecture without replacing the core platform.

🌍 30. Social Impact & Farmer Empowerment

FarmOS aims to improve agricultural decision-making by reducing information gaps.

Key Impact Areas
Market Transparency

Farmers can view available government mandi price information.

Market Comparison

Farmers can compare multiple markets instead of relying on a single local price.

Transportation Awareness

FarmOS introduces estimated logistics costs into the selling decision.

Buyer Discovery

Farmers can discover potential agricultural businesses and registered buyers.

Digital Accessibility

The platform supports both English and Hindi interfaces.

FarmOS aligns conceptually with Sustainable Development Goals including:

SDG 1 — No Poverty
SDG 8 — Decent Work and Economic Growth
💎 31. Value Proposition
RAW DATA
   ↓
INTELLIGENCE
   ↓
COMPARISON
   ↓
ESTIMATED RETURN
   ↓
DECISION
   ↓
ACTION

FarmOS transforms fragmented agricultural information into a structured decision-support workflow.

The platform connects:

🌾 Harvest
   ↓
📊 Market Data
   ↓
⚖️ Comparison
   ↓
🚚 Logistics
   ↓
💰 Estimated Net Return
   ↓
🤝 Buyer Discovery
   ↓
🏆 Selling Opportunity
🔄 32. End-to-End System Flow
📋 33. Project Status Overview
✅ Implemented
 Full-Stack React + Node.js + PostgreSQL Architecture
 JWT Authentication
 Role-Based Authorization
 Farmer, Buyer & Admin Roles
 Harvest Management
 Live Government Mandi Prices via Agmarknet
 Market Opportunity Engine
 FarmOS Opportunity Score
 Smart Freight Logistics
 Estimated Freight Cost Calculation
 Estimated Net Return Optimization
 OpenRouteService Road Routing
 Geographical Routing Fallback
 Weather Intelligence
 15-Minute Weather Cache
 Google Gemini AI Agriculture Assistant
 Floating AI Assistant
 Buyer Marketplace
 Order Management
 Atomic Order/Harvest Transactions
 Public Trader / Agricultural Business Directory
 Potential Buyer Discovery
 FarmOS Registered Buyer System
 FarmOS Buyer Verification Workflow
 Farmer/Buyer Trust Verification
 Buyer Public Contact Privacy Controls
 e-NAM Official Resources & Workflow Guidance
 English & Hindi Interface
 Swagger / OpenAPI Documentation
 Vercel Frontend Deployment
 Render Backend Deployment
 Neon PostgreSQL Database
🔮 Future Scope
 Digital Payment Gateway
 Real-Time Transport Provider Matching
 Live Freight Quotations
 WhatsApp / SMS Automated Alerts
 Predictive Price Forecasting
 Multilingual Voice AI Assistant
⚖️ 34. Commercial Disclaimer

Disclaimer: FarmOS is a decision-support prototype platform. Market prices, weather forecasts, and other information are derived from third-party government and open data services. Opportunity scores, gross values, freight costs, and net-return figures are calculated estimates and do not constitute guaranteed commercial returns, guaranteed buyers, or financial advice. Transport rates are configured estimates and may differ from actual local quotations. Users should independently verify critical commercial transactions.

🏁 35. Final Summary

FarmOS connects every harvest to its best available opportunity by combining:

🌾 HARVEST
     ↓
📊 GOVERNMENT MARKET DATA
     ↓
⚖️ MARKET COMPARISON
     ↓
🚚 FREIGHT ESTIMATION
     ↓
💰 ESTIMATED NET RETURN
     ↓
🏆 OPPORTUNITY RANKING
     ↓
🤝 BUYER DISCOVERY
     ↓
🤖 AI EXPLANATION
     ↓
🛒 MARKETPLACE / SELLING ACTION

FarmOS brings together agricultural market intelligence, logistics estimation, weather information, buyer discovery, marketplace functionality, and AI-assisted explanations in a single platform.

The central idea is simple:

Connect every harvest to its best available opportunity using transparent, calculated agricultural intelligence.

Maintained by the FarmOS Development Team • Built for Smart India Hackathon & Open-Source Agricultural Innovation.
*Maintained by the FarmOS Development Team • Built for Smart India Hackathon & Open-Source Agricultural Innovation.*
