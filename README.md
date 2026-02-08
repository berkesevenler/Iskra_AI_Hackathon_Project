# ⚡ One Click AI

> **Supply chain orchestration through autonomous AI agent coordination**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![CrewAI](https://img.shields.io/badge/CrewAI-0.100-orange)](https://www.crewai.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-purple?logo=openai)](https://openai.com/)

---

## 🎯 What is One Click AI?

**One Click AI** transforms complex supply chain procurement from weeks of manual coordination into minutes of autonomous orchestration. Simply describe what you need—"assemble a Ferrari" or "source 500 industrial servo motors"—and five specialized AI agents coordinate suppliers, manufacturers, logistics, and retailers to deliver a complete execution plan.

### The Problem

Traditional supply chain coordination is **slow, opaque, and error-prone**:
- Manual email chains with dozens of suppliers
- No visibility into decision-making processes
- Weeks spent comparing quotes and checking certifications
- Geographic and cost optimization done by hand
- No unified view of the entire procurement pipeline

### The Solution

Five autonomous AI agents work together through **decentralized coordination**:
1. **Procurement Agent** (CrewAI) decomposes your intent into components
2. **Supplier Agent** evaluates 30+ global suppliers and generates quotes
3. **Manufacturer Agent** assesses facilities and creates assembly plans
4. **Logistics Agent** optimizes multi-modal shipping routes
5. **Retailer Agent** finalizes pricing and delivery experience

All agents communicate via **A2A (Agent-to-Agent) protocol** over HTTP/JSON, discover each other through a shared registry, and produce a complete execution plan with full transparency.

---

## ✨ Key Features

### 🤖 Autonomous Agent Coordination
- **No central controller** — agents discover and negotiate directly
- **Real-time transparency** — watch every decision as it happens
- **Intelligent partner selection** — balances distance, cost, capability, and reliability

### 📊 Complete Visibility
- **Live coordination log** — every agent message and decision
- **Network Coordination Report** — discovery paths, trust verification, policy enforcement
- **Interactive visualizations** — world map, dependency graphs, message flows, timelines

### 🎯 Smart Partner Selection
- **90 global partners** — 30 suppliers, 30 manufacturers, 30 logistics providers
- **Weighted scoring algorithm** — geographic proximity (40%), capability match (30%), reliability (20%), cost (10%)
- **Haversine distance calculation** — optimizes for geographic efficiency

### 💰 Realistic Cost Calculation
- **Component-level pricing** — detailed quotes for every part
- **Multi-stage cost aggregation** — parts, manufacturing, shipping, retail margin
- **Validation and fallbacks** — ensures realistic pricing even if AI calls fail

### 🚀 Production-Ready Architecture
- **FastAPI backend** with Server-Sent Events for real-time streaming
- **Next.js 16 frontend** with React 19 and Tailwind CSS 4
- **Deployed on Railway + Vercel** — fully cloud-hosted

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│              (Next.js 16 + React 19 + Tailwind)             │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/SSE
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Procurement Agent (CrewAI + GPT-4o-mini)      │  │
│  │  • Intent Analysis                                     │  │
│  │  • Component Identification                            │  │
│  │  • Orchestration                                       │  │
│  └───────────────┬────────────────────────────────────────┘  │
│                  │ A2A Protocol (HTTP/JSON)                 │
│  ┌───────────────┴────────────────────────────────────────┐  │
│  │  Supplier Agent    │  Manufacturer Agent               │  │
│  │  (Python + GPT-4o) │  (Python + GPT-4o)                │  │
│  │                    │                                    │  │
│  │  Logistics Agent  │  Retailer Agent                   │  │
│  │  (Python + GPT-4o) │  (Python + GPT-4o)                │  │
│  └───────────────────────────────────────────────────────┘  │
│                  │                                           │
│                  ▼                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Agent Registry + Partner Database            │  │
│  │  • 5 Registered Agents                                │  │
│  │  • 30 Suppliers (with coordinates, specs, costs)     │  │
│  │  • 30 Manufacturers (capabilities, capacity)         │  │
│  │  • 30 Logistics Providers (modes, coverage)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Agent Communication Flow

1. **User submits intent** → Procurement Agent receives request
2. **Procurement Agent** queries Agent Registry → discovers all available agents
3. **Procurement Agent** queries Partner Database → scores and shortlists partners
4. **Procurement Agent** → **Supplier Agent**: "Check availability for X components"
5. **Supplier Agent** → **Procurement Agent**: Returns quotes with pricing and lead times
6. **Procurement Agent** → **Manufacturer Agent**: "Evaluate assembly capacity"
7. **Manufacturer Agent** → **Procurement Agent**: Returns assembly plan and timeline
8. **Procurement Agent** → **Logistics Agent**: "Plan route from suppliers → manufacturer → customer"
9. **Logistics Agent** → **Procurement Agent**: Returns optimal route and shipping costs
10. **Procurement Agent** → **Retailer Agent**: "Finalize delivery plan and pricing"
11. **Retailer Agent** → **Procurement Agent**: Returns retail price and customer experience plan
12. **Procurement Agent** compiles final execution plan → streams to user via SSE

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router
- **React 19** — UI library
- **Tailwind CSS 4** — Styling
- **Framer Motion** — Animations
- **react-simple-maps** — World map visualization
- **@xyflow/react** — Dependency graph visualization
- **lucide-react** — Icons

### Backend
- **FastAPI** — Python web framework
- **CrewAI** — Multi-agent orchestration framework
- **OpenAI GPT-4o-mini** — LLM for agent reasoning
- **Uvicorn** — ASGI server
- **Server-Sent Events (SSE)** — Real-time streaming

### Infrastructure
- **Railway** — Backend hosting
- **Vercel** — Frontend hosting
- **Python 3.13** — Backend runtime
- **Node.js** — Frontend runtime

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Python 3.13+** and **pip**
- **OpenAI API Key** ([get one here](https://platform.openai.com/api-keys))

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Iskra_AI_Hackathon_Project
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env.local  # Create if needed
# Add your OPENAI_API_KEY to .env.local
```

### 3. Frontend Setup

```bash
# From project root
npm install
```

### 4. Run Locally

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
# Server runs on http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
npm run dev
# App runs on http://localhost:3000
```

### 5. Open the App

Visit [http://localhost:3000](http://localhost:3000) and navigate to the Dashboard.

---

## 📖 Usage

### Example Queries

Try these in the dashboard:

```
Procure all parts to assemble a Ferrari — cheapest options, delivery within 30 days
```

```
Order 500 industrial servo motors for our Berlin factory, budget under $200K, 14-day deadline
```

```
Source all materials for 1,000 custom electric bicycles — prioritize EU suppliers with ISO 9001
```

### What Happens

1. **Enter your procurement request** in the dashboard
2. **Watch real-time coordination** — agents communicate and make decisions live
3. **Review the execution plan** — complete breakdown of suppliers, costs, timelines
4. **Explore visualizations** — world map, dependency graph, message flow, timeline
5. **Read the Network Coordination Report** — full transparency into every decision

---

## 📁 Project Structure

```
Iskra_AI_Hackathon_Project/
├── backend/
│   ├── main.py                 # FastAPI server & orchestration
│   ├── agents.py               # Supplier, Manufacturer, Logistics, Retailer agents
│   ├── procurement.py          # CrewAI Procurement Agent
│   ├── registry.py             # Agent Registry (AgentFacts metadata)
│   ├── selector.py             # Partner selection algorithm
│   ├── data/
│   │   ├── suppliers.py        # 30 supplier database
│   │   ├── manufacturers.py   # 30 manufacturer database
│   │   └── logistics_providers.py  # 30 logistics provider database
│   ├── requirements.txt
│   └── railway.toml           # Railway deployment config
├── src/
│   ├── app/
│   │   ├── page.js             # Landing page
│   │   ├── dashboard/
│   │   │   └── page.js         # Main dashboard
│   │   └── layout.js           # Root layout
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── IskraLogo.js
│   │   └── viz/
│   │       ├── WorldMap.js
│   │       ├── DependencyGraph.js
│   │       ├── MessageFlow.js
│   │       └── CoordinationTimeline.js
│   └── styles/
├── public/                     # Static assets (videos, images)
├── package.json
├── .npmrc                      # npm config (legacy-peer-deps)
└── README.md
```

---

## 🌐 Deployment

### Backend (Railway)

1. **Connect your GitHub repo** to Railway
2. **Set root directory** to `backend`
3. **Add environment variable**: `OPENAI_API_KEY`
4. **Railway auto-detects** FastAPI and deploys
5. **Copy your Railway URL** (e.g., `https://your-app.up.railway.app`)

### Frontend (Vercel)

1. **Connect your GitHub repo** to Vercel
2. **Add environment variable**: `NEXT_PUBLIC_BACKEND_URL` = your Railway URL
3. **Vercel auto-detects** Next.js and deploys
4. **Your app is live!**

### Update Backend URL

If you hardcoded the Railway URL in `src/app/dashboard/page.js`, update it:

```javascript
const RAILWAY_URL = "https://your-railway-url.up.railway.app";
```

---

## 🎨 Features in Detail

### Real-Time Coordination Log
Every agent message, decision, and reasoning step streams to your dashboard in real time. See exactly what each agent is doing, when, and why.

### Network Coordination Report
A comprehensive report documenting:
- **Discovery Paths** — how partners were found and scored
- **Trust & Verification** — certification checks (ISO 9001, IATF 16949, etc.)
- **Policy Enforcement** — budget, jurisdiction, quality standards
- **Message Exchanges** — complete A2A communication log
- **Execution Summary** — order sequence, timing, routing, cost breakdown

### Interactive Visualizations
- **World Map** — see all partner locations with zoom/pan
- **Dependency Graph** — visualize agent and partner relationships
- **Message Flow** — timeline of all agent communications
- **Coordination Timeline** — phase-by-phase breakdown

### Smart Partner Selection
The system uses a **weighted scoring algorithm** to select optimal partners:
- **Geographic proximity** (40%) — Haversine distance calculation
- **Capability match** (30%) — specialization and certifications
- **Reliability** (20%) — historical performance rating
- **Cost efficiency** (10%) — cost multiplier vs. baseline

---

## 🔧 Configuration

### Environment Variables

**Backend** (`.env.local` in `backend/`):
```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=8000  # Optional, defaults to 8000
```

**Frontend** (Vercel environment variables):
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.up.railway.app
```

### Customizing Partner Database

Edit the partner databases in `backend/data/`:
- `suppliers.py` — Add/modify suppliers
- `manufacturers.py` — Add/modify manufacturers
- `logistics_providers.py` — Add/modify logistics providers

Each partner needs:
- `x`, `y` coordinates (latitude, longitude)
- `specialization` or `capabilities` list
- `reliability` score (0-1)
- `cost_multiplier` or `cost_per_km_usd`
- `certifications` list

---

## 🐛 Troubleshooting

### Backend won't start
- Check that `OPENAI_API_KEY` is set in `.env.local`
- Ensure Python 3.13+ is installed
- Verify all dependencies: `pip install -r requirements.txt`

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_BACKEND_URL` in Vercel (for production)
- Check browser console for CORS errors

### Supplier agent returns 0 quotes
- This can happen with very large component lists
- The system has a fallback mechanism that generates synthetic quotes
- Check backend logs for OpenAI API errors

### 405 Method Not Allowed
- Ensure backend is running and accessible
- Check that the route `/api/run` accepts POST requests
- Verify CORS middleware is configured correctly

---

## 🎯 Future Enhancements

- [ ] Multi-project management with persistent storage
- [ ] Agent performance metrics and analytics
- [ ] Custom partner database import/export
- [ ] Budget constraints and optimization
- [ ] Multi-currency support
- [ ] Integration with real supplier APIs
- [ ] Agent learning from historical decisions

---

## 📄 License

This project was created for a hackathon. All rights reserved.

---

## 🙏 Acknowledgments

- **CrewAI** — Multi-agent orchestration framework
- **OpenAI** — GPT-4o-mini for agent reasoning
- **FastAPI** — Modern Python web framework
- **Next.js** — React framework
- **Railway** & **Vercel** — Hosting platforms

---

## 📧 Contact

Built with ⚡ by **Iskra AI**

For questions or feedback, open an issue or reach out to the team.

---

**Made for the hackathon. Built for the future of supply chain automation.**
