# Fish-the-Phish: AI-Powered Email Forensics

**Fish-the-Phish** is a sophisticated security tool that deconstructs suspicious emails using a multi-layered forensic approach. It combines real-time URL reputation checks, domain age verification, and Large Language Model (LLM) analysis to determine if an email is a phishing attempt.

---

## Key Features

* **Link Extraction:** Automatically pulls all URLs from raw email text.
* **Multi-Source Forensics:**
* **VirusTotal API:** Checks live URL reputation against 70+ antivirus engines.
* **WHOIS Forensics:** Analyzes domain registration dates to catch "burn-and-turn" phishing domains.


* **AI Intelligence Layer:** Uses **Groq (Llama 3.3 70B)** to analyze the psychological triggers (urgency, fear, greed) and technical discrepancies in the content.
* **⚡ High Performance:** Implements parallel API calling and Groq’s ultra-fast LPU inference.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Shadcn/UI |
| **Backend** | Next.js API Routes (Edge-ready) |
| **AI Brain** | Groq Llama 3.3 70B (OpenAI-compatible SDK) |
| **Forensics** | VirusTotal API, API Ninjas (WHOIS) |
| **Icons** | Lucide React |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/benmarcel/fish-the-phish.git
cd fish-the-phish

```

### 2. Install dependencies

```bash
npm install or 
bun install or 
pnpm install 

```

### 3. Environment Setup

Create a `.env` file and add your keys:

```env
VIRUSTOTAL_API_KEY=your_key_here
API_NINJAS_KEY=your_key_here
GROQ_API_KEY=your_key_here

```

### 4. Run Development Server

```bash
npm run dev or 
bun run dev or 
pnpm run dev

```

---

## System Architecture

1. **Input:** User pastes raw email text.
2. **Extraction:** Regex patterns identify all unique URLs.
3. **Technical Scan:** * `Promise.all` executes VirusTotal and WHOIS checks in parallel.
* Domain "newness" is calculated (flagged if < 30 days).
4. **AI Analysis:** The raw text + technical findings are sent to **Groq**.
5. **Output:** A structured `AnalysisResponse` object is returned to the UI.

---

## Example Output

```json
{
  "threatLevel": "high",
  "summary": "Urgent account security phish.",
  "analysis": "Uses a typosquatted domain (amaz0n) and false urgency.",
  "verdict": "Do not click. Report and delete."
}

```

---

## Challenges Overcome

* **OpenAI Quota Limitations:** Transitioned from OpenAI to **Groq** to provide a high-speed, cost-effective free tier for the project.
* **WHOIS Timeouts:** Replaced standard Port 43 WHOIS lookups (which are often blocked by ISPs/Cloud providers) with an HTTPS-based REST API for 100% reliability.
* **LLM JSON Consistency:** Implemented strict system prompting and JSON-mode validation to ensure the frontend never crashes on malformed AI responses.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
