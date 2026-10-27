# SkillRadar — Station OS v2.6
### 3D Sci-Fi Career Exploration & Skill-Development Station for College Students

[![Built with React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev)
[![Three.js Powered](https://img.shields.io/badge/Three.js-3D_Hub-violet.svg)](https://threejs.org)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-0db7ed.svg)](https://www.docker.com/)

---

## 🚀 Overview

**SkillRadar** is a functional career exploration, simulation, and skill-development platform designed specifically for college students. Set inside a 3D walkable spaceship hub inspired by crewmate sci-fi games (custom characters, environments, neon consoles, and UI), students navigate between rooms or switch to a full 2D console mode to assess skills, simulate enterprise jobs, identify skill gaps, and follow personalized learning roadmaps grounded in real labor market datasets.

---
## 🌐 Live Demo

**Explore SkillRadar Station OS v2.6:** [Launch SkillRadar Career Compass]https://skillradar-station-paxicvh98-jaanvi4.vercel.app/

Experience an interactive, AI-powered career exploration platform that helps college students explore career paths, assess their skills, identify skill gaps, simulate real-world job tasks, and build personalized learning roadmaps.

- **Live Website:** (https://skillradar-station-paxicvh98-jaanvi4.vercel.app/)
- **Source Code:** https://github.com/jaanvi131313-collab/SkillRadar
- **Platform:** React, TypeScript, Three.js, Tailwind CSS
- **Core Features:** 3D Career Hub, Skill Assessment, Role Matching, Job Simulations, AI Career Advisor, and Skill Development Roadmaps
<img width="957" height="497" alt="Screenshot 2026-10-26 233848" src="https://github.com/user-attachments/assets/dfef4883-71d4-4103-ad41-7fe14dd3137b" />


## 📊 Dataset Inspection & Provenance Report

The project is built on the audited workbook **`Dataset.xlsx`** (8.8 MB, 15 sheets):

| Sheet Name | Row Count | Description / Role in SkillRadar |
| :--- | :---: | :--- |
| `README` | 18 | Central template scope and dataset limitation declarations. |
| `01_Source_Register` | 8 | Provenance origins: Fliar BI (SRC001, CC BY-NC 4.0), LinkedIn sample (SRC006), Headcount Labs (SRC004). |
| `02_Raw_Jobs` | 16,459 | Staged raw postings from India and international tech samples. |
| `03_Clean_Jobs` | 16,001 | Normalized job titles, standard role IDs, INR salaries, cities (Bangalore, Mumbai, Pune, Delhi NCR, etc.). |
| `04_Skill_Taxonomy` | 136 | Standardized skill entities, definitions, aliases, and corpus mention counts. |
| `05_Job_Roles` | 66 | Standardized canonical roles with definitions and role families. |
| `06_Extracted_Skills` | 12,324 | Extracted skill-to-job relations, requirement types (`required` vs `mentioned`), and confidence scores. |
| `07_Gold_Labels` | 992 | Human-annotated ground truth evaluation records. |
| `08_Feature_Table` | 1,000+ | NLP and tabular ML feature extractions. |
| `09_Predictions` | 1,000+ | Model classification outputs. |
| `10_Model_Evaluation` | 100+ | Precision, recall, and F1 performance metrics. |
| `11_Data_Quality` | 11 | Acceptance criteria audits (Q001-Q010): deduplication, missing descriptions, salary normalization. |
| `12_Data_Dictionary` | 155 | Full field-level definitions and provenance data types. |
| `13_Import_Plan` | 50+ | Schema validation rules. |
| `14_Market_Benchmarks`| 515 | Macro postings, employer distributions, and monthly time-series benchmarks. |

### Data Provenance & Grounding Limitations:
1. **Salary Normalization:** Fliar BI salaries are recorded in INR; annual period is inferred. 
2. **Text Coverage:** Full textual descriptions exist for 2,057 eligible rows in the LinkedIn corpus; Fliar BI rows specify role and salary attributes without body text.
3. **No False Guarantees:** Match scores represent alignment with modeled dataset posting requirements, **never** a probability or guarantee of employment.

---

## 🕹️ 3D Hub & 2D Console Experience

SkillRadar replicates the visual hierarchy of the reference interface:
- **3D Hub Deck:**
  - Walkable circular station deck with concentric glowing floor rings and cyan perimeter rim.
  - 7 Portal Gateway arches with glowing neon signboards facing inward.
  - Custom Astronaut Crewmate 3D avatar with shiny cyan visor, backpack oxygen tank, and customized suit colors.
  - Third-person camera tracking, WASD / Arrow movement, collision boundaries, and proximity detection.
  - Floating interaction prompt: `[Press E or Click to Enter <Room Name>]`.
- **2D Console Mode:**
  - One-click toggle (`V` shortcut or top navbar pill) providing instant access to all 7 room workflows for low-end hardware or keyboard navigation.
- **Mission Board & Radar:**
  - Left collapsible mission board displaying real-time journey progress (%).
  - Bottom-left circular **Hub Radar** mini-map displaying room blips, student position marker, and instant fast-travel.
- **Audio Feedback:**
  - Native Web Audio API synthesizer for sci-fi terminal beeps and milestone chimes without external audio assets.

---
## 🤖 Station AI Career Advisor

SkillRadar integrates an AI-powered career assistant that helps students interpret career analytics and make informed skill-development decisions. The assistant provides conversational guidance grounded in the SkillRadar dataset rather than relying solely on generic career advice.
<img width="564" height="488" alt="Screenshot 2026-10-27 161624" src="https://github.com/user-attachments/assets/2cd3bfd1-f205-444a-8628-e9ac9b858470" />

### Key Capabilities

- **Dataset-Grounded Answers:** Responds to career questions using the available SkillRadar dataset and its documented information.
- **Skill Requirement Analysis:** Explains the important skills associated with specific roles, including Data Analyst, Business Analyst, and other supported careers.
- **Role Match Interpretation:** Helps students understand the weighted Role Fit score, skill alignment, and the difference between demonstrated skills and target requirements.
- **Salary & Career Comparisons:** Supports questions about available salary benchmarks and comparisons between roles where the relevant dataset information exists.
- **Skill-Gap Guidance:** Helps students understand which skills require improvement and how these gaps relate to their target career.
- **Interactive Career Exploration:** Allows students to ask follow-up questions through a conversational chat interface.

### Responsible AI & Data Grounding

The assistant is designed to support career exploration, not to guarantee employment outcomes. Role Fit scores indicate alignment with modeled job requirements and should not be interpreted as probabilities of getting hired. Responses about salaries, skills, and career requirements depend on the coverage and quality of the underlying dataset.

**Example questions:**
- What are the top skills for a Data Analyst in the dataset?
- How should I interpret my weighted Role Fit score?
- How does the Data Analyst role compare with the Financial Analyst role?
- Which skills should I improve for my target career?
## 🏢 Seven Rooms & Workflows

1. **Station Lobby (Airlock Alpha):**
   - Student onboarding, crewmate space suit color picker, education background, major, career interests, and clearance status.
2. **Skill Scan Lab:**
   - Multi-choice technical scenario quizzes (SQL, Excel, Python, Power BI, Statistics, Problem Solving) with code snippets, instant technical explanations, and verifiable evidence generation.
   - 1–5 self-assessment slider with canonical taxonomy definitions.
   - Audited Evidence Ledger distinguishing verified quiz, practical simulation, and self-reported skills.
3. **Career Explorer:**
   - Searchable and filterable catalog across 66 canonical roles and 16,000+ postings.
   - Median salaries in INR, top geographic hiring hubs (Bangalore, Mumbai, Pune, Delhi NCR, Hyderabad), required skills, and side-by-side role comparisons.
4. **Role Match Command Center ("Check My Fit"):**
   - Deterministic explainable weighted skill alignment calculation:
     $$\text{Score} = \frac{\sum (\text{Weight}_i \times \min(\text{Demonstrated}_i / \text{Target}_i, 1.0))}{\sum \text{Weight}_i} \times 100$$
   - Displays Data Completeness percentage; warns against false precision if completeness is below 40%.
   - Segregates matched skills, partial matches, gaps, and unassessed skills.
5. **Job Simulation Arena:**
   - **Data Analyst:** Raw transaction anomaly triage, interactive in-memory SQL sandbox (`SELECT`, `WHERE`, `GROUP BY`, `ORDER BY`), and regional conversion funnel diagnosis.
   - **Financial Analyst:** Liquidity & solvency ratio calculations (Current Ratio, Debt-to-Equity), operating margin compression analysis, and Capex investment feasibility recommendation.
   - **Business Analyst:** MoSCoW requirement triage, process workflow bottleneck analysis, and Gherkin acceptance criteria drafting (`Given / When / Then`).
   - Deterministic auto-grading rubric with itemized points, transparent feedback, and saved attempts.
6. **Skill Upgrade Station (Learning Roadmap):**
   - Personalized weekly schedule calibrated to target role gaps and weekly available hours (4h, 8h, 15h, 20h).
   - Reputable official resource links (PostgreSQL, SQLBolt, Pandas, MDN, Khan Academy, IIBA, React.dev).
   - Measurable completion criteria ("Reading alone must not mark a skill mastered").
   - Milestone checkboxes, study notes editor, and schedule recalibration.
7. **Command Center Bridge:**
   - XP trajectory, Clearance Level, Badge showcase (First Orbit, Data Pioneer, Orbit Explorer, Calibration Ace, Simulation Veteran, Master Strategist, Station Commander).
   - Skill radar proficiency bars across all 6 core categories.
   - Prominent **"Continue Active Mission"** action button routing straight to the next milestone.

---

## 🛠️ Quickstart & Local Execution

### Prerequisites:
- Node.js 18+ (tested on Node v24)
- npm 9+

### Steps:
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```
Visit `http://localhost:3000` in your web browser.

---

## 🐳 Deployment to Any Open-Source Platform

SkillRadar is packaged with clean production configurations for all modern deployment targets:

### 1. Docker & Docker Compose (Self-Hosted, VPS, Portainer, Dokku, Coolify, CapRover)
```bash
# Build and run containerized Nginx instance on port 3000
docker compose up -d --build
```
Or with direct Docker commands:
```bash
docker build -t skillradar:latest .
docker run -d -p 3000:80 --name skillradar skillradar:latest
```

### 2. Coolify / CapRover / Dokku (Open-Source PaaS)
- Simply point Coolify or Dokku to this Git repository. The included `Dockerfile` and `nginx.conf` will automatically build the static assets and serve them via high-performance Nginx with SPA routing support.

### 3. Vercel
```bash
npx vercel deploy
```
*(Pre-configured via `vercel.json` with SPA route rewrites).*

### 4. Netlify
```bash
npx netlify deploy --prod
```
*(Pre-configured via `netlify.toml` with build commands and redirect rules).*

---

## 📜 Provenance & License Notice
- Fliar BI India Salary Benchmarks: CC BY-NC 4.0.
- LinkedIn Tech Job Postings: Educational research sample.
- Built for SkillRadar Station OS v2.6.

## 📈 Market Opportunity & Market Sizing — TAM, SAM & SOM

SkillRadar uses a TAM–SAM–SOM framework to illustrate its potential market opportunity in India's higher-education and career-development ecosystem.

The estimates below use a proposed annual licence price of ₹150 per student. They are illustrative planning estimates, not verified revenue forecasts.

### Total Addressable Market (TAM)

**Estimated market size: ₹649.5 crore annually**

TAM represents the broadest potential market, covering approximately 4.33 crore higher-education students in India.

**Calculation:**

4.33 crore students × ₹150 per student per year = ₹649.5 crore.

### Serviceable Available Market (SAM)

**Estimated market size: ₹128.6 crore annually**

SAM narrows the market to the assumed target segment of undergraduate students in Commerce and Engineering streams.

- Undergraduate share assumption: 78.9%
- Commerce and Engineering share assumption: 25.1%
- Estimated target audience: approximately 85.8 lakh students

**Calculation:**

85.8 lakh students × ₹150 per student per year ≈ ₹128.6 crore.

### Serviceable Obtainable Market (SOM)

**Estimated market size: ₹1.29 crore annually**

SOM represents an illustrative initial adoption target of approximately 1% of the SAM audience by Year 5.

- Target adoption: approximately 85,751 students
- Equivalent institutional reach: approximately 107 colleges, assuming around 800 students per college
- Estimated annual revenue at the assumed licence price: approximately ₹1.29 crore

### SOM Sensitivity Analysis

| Assumed SAM Adoption | Estimated Annual Revenue |
|---|---:|
| 0.5% | ₹0.64 crore |
| 1% | ₹1.29 crore |
| 2% | ₹2.57 crore |

### Sources & Assumptions

- **Student population:** All India Survey on Higher Education (AISHE), 2021–22, Ministry of Education, Government of India.
- **Undergraduate share:** AISHE 2020–21, as used in the illustrative model.
- **Licence price:** Assumed at ₹150 per student per year.
- **Adoption rate:** Assumed for scenario planning; not based on demonstrated customer acquisition.
- **Institutional reach:** Approximate, based on an assumed average of 800 students per college.
- **Scope:** B2C revenue is excluded from this estimate.

**Interpretation:** TAM describes the broad potential market, SAM identifies the segment SkillRadar intends to serve, and SOM estimates a possible share of that segment that the platform could reach over time. These figures depend on the assumptions above and should be validated before being used as commercial forecasts.
<img width="952" height="511" alt="Screenshot 2026-10-27 161933" src="https://github.com/user-attachments/assets/a719ce9c-4046-4ccf-8b19-25e30327fa08" />

