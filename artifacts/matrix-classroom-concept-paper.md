# Concept Paper: Curriculum as Code — An AI-Powered Executable Lesson Platform for Equitable STEM Learning

**Submit to:** `STEMK12@nsf.gov` / `DRLAISL@nsf.gov`
**Program:** NSF STEM K-12 (NSF 25-545)
**PI:** Abraham Romero, M.Ed. candidate / 8th Grade Math Teacher, Vanguard Academy
**Institution:** The University of Texas Rio Grande Valley (UTRGV)
**Contact:** abraham.romero01@utrgv.edu

---

## 1. Vision & Problem

> Can artificial intelligence lift up underprivileged students, or does it only serve those who are already succeeding?

This is the central question driving our work. In Texas, over 400,000 8th graders take the STAAR math exam each year — a disproportionate number of them from low-income, Hispanic-majority districts like the Rio Grande Valley where we teach. Current AI-in-education tools overwhelmingly serve self-directed, already-advantaged learners: tutoring bots for the motivated, essay helpers for the fluent. The students who need the most support — those in under-resourced classrooms with high teacher turnover — are precisely those least served by existing AI approaches.

**Our thesis:** AI's highest value in K-12 education is not as a student-facing tutor but as a **teacher-facing amplifier** — a system that automates the repetitive, timing-sensitive, easy-to-forget parts of lesson delivery while giving the teacher superhuman situational awareness of what every student understands, in real time.

## 2. The Innovation: Curriculum as Code

We are building an **executable state curriculum** — the first platform that treats a lesson not as a PDF or slide deck, but as a **runnable program** with state, timers, branching, peer-discourse hooks, and per-student memory. We call this the Matrix Classroom.

### Core Architecture

The system has three layers:

| Layer | What | Example |
|-------|------|---------|
| **Content** (Authored `.lesson` files) | Typed slots with verbatim TEKS-aligned curriculum content, discourse stems, misconception data | A Bluebonnet Grade 8 lesson on trend lines — 9 slots including Bell Ringer, Hook, DI Blocks, 3A Talk stems, Practice problems, Exit Ticket |
| **Runtime** (Lesson Orchestrator) | State machine that dispatches slots to classroom chat rooms at timed intervals, collects responses, routes to memory | The orchestrator runs the 5-Step Campus Cycle: Bell Ringer → Hook → Direct Instruction → 3A Discourse → Practice → Closure |
| **Transport** (Matrix + Honcho) | Encrypted chat rooms as the delivery medium + per-student vector memory over the curriculum | Honcho tracks per-TEKS evidence quality across 51 lessons — enabling forgetting-curve spiral review and a STAAR early-warning system |

### Key Components

1. **Teacher Radar** — A private DM channel between the bot and the teacher. The bot processes the noise of 21 typing students and surfaces real-time signals: stuck teams, misconception clusters, silent students, and suggested 90-second interventions. This is what we mean by "teacher amplifier, not teacher replacer."

2. **Honcho Memory Layer** — Per-student vector memory that tracks evidence quality (not just participation, but actual mathematical understanding) across every TEKS standard over the full curriculum. Enables:
   - **Forgetting-curve spiral review** — auto-inserts review problems in Bell Ringers based on temporal decay of demonstrated mastery
   - **Per-TEKS STAAR projection** — by February, a student-level early-warning system that rivals commercial products at a fraction of the cost
   - **Dynamic breakout grouping** — real-time sub-rooms for reteach vs. extension based on current understanding

3. **Math Input Handler** — Solves the fundamental problem that middle schoolers cannot type fractions, graphs, or geometry into a chat interface. Students snap a photo of handwritten work; a vision model transcribes it; a step-by-step symbolic verifier (ValiMath pattern) checks correctness before any feedback reaches the student.

4. **Lesson Playback Studio** — Every class session produces a replayable artifact: a timeline of bot posts and student discourse, a misconception heatmap by TEKS, auto-drafted small-group plans for the next day, and an honest-by-design async replay for absent students.

### Built on Open Infrastructure

- **Curriculum:** Bluebonnet Learning (TEA OER), free and TEKS-aligned — no licensing barriers to scaling
- **Transport:** Matrix protocol (self-hosted Synapse) — encrypted, open standard, student-safe with room-blocking and no federation
- **Memory:** Honcho (open-source, pgvector + Redis) — privacy-first, designed for FERPA compliance from day one
- **Stack:** Self-hosted on a single Linux server behind Cloudflare Tunnel, with documented failover-to-printed-PDF for when the internet drops

## 3. Research Questions

1. **Teacher Practice:** Does the Teacher Radar model — an AI system that amplifies teacher awareness rather than replacing teacher judgment — improve the quality and timeliness of in-class instructional interventions?

2. **Student Outcomes:** For underserved middle school students (low-income, Hispanic-majority, high teacher turnover districts), does AI-facilitated executable curriculum produce learning outcomes at least equivalent to traditional teacher-led instruction?

3. **Equity:** Does the system differentially benefit students at different levels of prior achievement? Does it close gaps or widen them?

4. **Curriculum Fidelity:** Can we maintain byte-identical fidelity to an approved state OER curriculum while using AI for orchestration and assessment?

## 4. Research Design & Methodology

We propose a **design-based research** approach across three years:

**Year 1 — Build & Pilot (one classroom, one lesson)**
- Stand up the full Lesson Orchestrator + Teacher Radar + Honcho pipeline for one Grade 8 Bluebonnet lesson
- Pilot with Abraham's own classroom (Vanguard Academy, 8th grade math)
- Collect qualitative data: teacher interviews, student discourse analysis, system logs
- Iterate on the curriculum-fidelity eval suite and math verification pipeline

**Year 2 — Single-Classroom Longitudinal Study (one teacher, full semester)**
- Run the full 51-lesson Grade 8 Bluebonnet curriculum through the platform
- Pre/post STAAR-aligned assessments
- Weekly teacher reflection journals + biweekly research team debriefs
- Develop the per-TEKS STAAR projection model from accumulated Honcho data

**Year 3 — Multi-Classroom Replication (3-5 teachers across 2-3 schools)**
- Recruit additional teachers in Rio Grande Valley middle schools
- Mixed-methods: quantitative outcome comparison + qualitative implementation fidelity analysis
- Refine the platform for portability (the `.lesson` spec enables any district using OER curricula to adopt the runtime)

### Why This Is Feasible

We are not starting from scratch. The infrastructure for the Matrix Classroom is already deployed and running:
- Synapse homeserver with E2EE and student room management ✅
- Hermes classroom-bot profile with Matrix gateway ✅
- Honcho memory layer with pgvector and reasoning pipeline ✅
- Attendance and check-in system ✅
- Bluebonnet facilitation notes extracted for all 51 Grade 8 lessons ✅
- COPPA/FERPA compliance analysis completed ✅

## 5. Broader Impacts

**Teaching Workforce:** The system is explicitly designed to support teachers in high-turnover, under-resourced schools. By automating the logistics of lesson delivery and providing real-time student understanding data, it reduces cognitive load on teachers and accelerates their ability to make informed instructional decisions. This is particularly critical in the Rio Grande Valley, where novice teachers often face the most challenging classrooms with the least support.

**Open Infrastructure:** Every component is built on open-source software and open educational resources. The `.lesson` runtime spec we are developing will be published under a permissive license. Any state or district using an OER curriculum (Bluebonnet, but also Louisiana, Oklahoma, or other state-developed materials) can adopt the platform.

**Broadening Participation:** The project centers on the students most often left out of AI-in-education research: rural and border-region Hispanic middle schoolers, English language learners, and students in high-poverty schools. The system is designed from day one for equitable access — with voice input paths, Spanish glossary support, and a snap-photo math interface that eliminates the typing barrier.

**AI Literacy:** The platform itself, as students interact with it, naturally exposes them to AI as a tool for learning — not as a black box that gives answers, but as a structured environment that scaffolds their own reasoning. This aligns with the goals of Executive Order 14277 on Advancing Artificial Intelligence Education for American Youth.

## 6. Budget Request (Indicative)

We request **$549,825 over 3 years** (within the STEM K-12 standard range):

| Category | Year 1 | Year 2 | Year 3 | Total |
|----------|--------|--------|--------|-------|
| PI Salary & Benefits (summer, 1 month/yr) | $18,000 | $18,500 | $19,000 | $55,500 |
| Graduate Research Assistant (12 mo/yr) | $32,000 | $33,000 | $34,000 | $99,000 |
| Equipment (server upgrade, vision GPU) | $8,000 | — | — | $8,000 |
| Participant Stipends (teacher participants) | — | $15,000 | $30,000 | $45,000 |
| Travel (dissemination, conferences) | $3,000 | $5,000 | $5,000 | $13,000 |
| Indirect Costs (F&A, negotiated rate) | — | — | — | ~$329,325 |

## 7. PI Background

Abraham Romero is an 8th grade math teacher at Vanguard Academy (Beethoven campus), a public charter school in the Rio Grande Valley, and a Master of Education candidate at UTRGV completing his degree in June 2026. He holds a BSME from UTRGV and is pursuing doctoral studies in teaching and learning with a research focus on AI in education for underserved populations. He has built the Matrix Classroom system described here — a self-hosted, FERPA-compliant instructional delivery platform — entirely self-taught, demonstrating the technical capability to execute the proposed work. He has been selected for the UTCRS Railway Safety STEM Camp (Summer 2026), designing middle school AI and robotics curriculum with LEGO SPIKE Prime.

---

## How to Proceed

We would welcome the opportunity to discuss this concept with a program officer. We are available for a brief virtual meeting at the program's convenience and can provide a more detailed white paper, a live demonstration of the existing infrastructure, or any additional information that would be helpful.

**Contact:** Abraham Romero — abraham.romero01@utrgv.edu
