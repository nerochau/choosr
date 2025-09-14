# Choosr

**AI-powered Chrome extension that helps you make smarter shopping decisions.**

Choosr compares products on Amazon by analyzing price, reviews, ratings, and shipping. With one click, it generates an **evidence-backed Decision Card** that summarizes pros and cons, ranks options, and highlights the most efficient choice.

---

## 🚀 Features (MVP)

- **Popup Extension** → Activate Choosr directly on Amazon product or search pages.  
- **Smart Data Extraction** → Collects product details (price, ratings, review count, shipping).  
- **AI-Powered Summaries** → LLM-generated pros/cons from reviews.  
- **Efficiency Score** → Weighted ranking based on price vs quality.  
- **Compare Products** → Side-by-side product comparison in the popup.

---

## 🌱 Roadmap

- 🔍 **Natural language queries** (“Best headphones under $200 with >4.3 stars”)  
- 🛍️ **Multi-site support** (Walmart, Target, Reddit, etc.)  
- 👤 **Personalized ranking** based on user preferences  
- 🤖 **AI Agent Mode** for cross-platform product discovery  
- 🛡️ **Provenance + anti-fake review filtering**

---

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS (popup UI)  
- **Extension:** Chrome Manifest V3  
- **Backend:** Node.js / Express (API + scraping logic)  
- **AI:** OpenAI / Claude API for review summarization  
- **Storage:** Simple JSON/Redis cache (for now)

---

## 📦 Installation (Dev Setup)

1. Clone the repo:  
   ```bash
   git clone https://github.com/your-username/choosr.git
   cd choosr
