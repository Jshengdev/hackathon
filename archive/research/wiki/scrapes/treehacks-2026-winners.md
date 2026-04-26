# TreeHacks 2026 Winners — Field Report for HackTech 2026

**Source gallery:** [treehacks-2026.devpost.com/project-gallery](https://treehacks-2026.devpost.com/project-gallery)
**Event:** Stanford TreeHacks 12, Feb 13–15, 2026, ~1,000 hackers, ~$500K–$1M+ in prizes ([Stanford Daily](https://stanforddaily.com/2026/02/15/12th-annual-treehacks/), [TreeHacks homepage](https://treehacks.com/))
**Total submissions in gallery:** 378
**Winners identified (Winner badge on Devpost):** **64**
**Winners with public GitHub repos found:** **60 of 64** (94%)
**Sponsor reality check:** **Neither K2 Think nor Dedalus Labs nor Listen Labs nor Ironsight sponsored TreeHacks 2026.** TreeHacks's sponsor stack was OpenAI, Anthropic, Google Cloud, NVIDIA, Modal, Y Combinator, Cloudflare, Vercel, Perplexity, Zoom, Suno, HeyGen, RunPod, Browserbase, Fetch.ai, Bright Data, Greylock, Visa, Elastic, Warp, OpenEvidence, Neo, Graphite, Zingage, Decagon, Interaction Co. (Poke), Stanford Ecopreneurship. Useful as a *style* and *pattern* benchmark — the K2 Think + Dedalus angle is your differentiator at HackTech, not something to copy from TreeHacks.

---

## Winners table

Sorted roughly by visibility on the gallery (page 1 first = highest-ranked grand prizes). "Repo" column: ✅ public GitHub URL found / ❌ no repo found.

| # | Project | Pitch | Industry | Tech / capability stack | Prize / track | Repo | GitHub |
|--|--|--|--|--|--|--|--|
| 1 | [Shepherd](https://devpost.com/software/raising-cane) | Motorized smart cane using iPhone LiDAR + CV that physically steers blind users away from obstacles, with GPS voice nav | Accessibility / hardware | Swift, ARKit, DeepLabV3, Vision, CoreBluetooth, CoreHaptics, Arduino, BLE, FreeRTOS, GCP Geocoding, OpenRouteService | **Grand Prize 1st** + OpenEvidence Healthcare Grand Prize | ✅ | [tonywangs/shepherd](https://github.com/tonywangs/shepherd) |
| 2 | [Robosurge](https://devpost.com/software/we-use-nix) | "Cursor for surgery" — VR + AI-controlled robotic arms let one surgeon operate remotely, replacing a 10-person team | Healthcare / robotics | Meta Quest 3 VR, Intel RealSense, ArUCo, SAM, YOLOv11, Lean theorem prover, Nix, FastAPI, WebRTC, WebSockets | **Grand Prize 2nd** | ✅ | [quantum9Innovation/treehacks2026](https://github.com/quantum9Innovation/treehacks2026) |
| 3 | [ChromaChord](https://devpost.com/software/chromachord) | Real-time chord suggestions from 24-D chroma vector theory, plus track generation | Music / dev tool | Claude, Next.js, Python, Perplexity Sonar, Vercel | **Grand Prize 3rd** + Suno Best Musical Hack | ✅ | [J4Joshua/JASS-APP](https://github.com/J4Joshua/JASS-APP) |
| 4 | [diffuji](https://devpost.com/software/diffuji) | Diffusion-powered instant camera printing half-real / half-dreamed thermal photos | Hardware / creative | Raspberry Pi 2W, Gemini 2.5 Flash Image, gpt-image-1.5, FLUX.1-Kontext via Modal, thermal printer, OLED | Most Creative + Neo "Most Likely to Become a Product" | ✅ | [alexkranias/dispo](https://github.com/alexkranias/dispo) |
| 5 | [Mira](https://devpost.com/software/mira-w65b0a) | Eldercare AI on Ray-Ban Meta glasses: 3D scene reconstruction + medical reasoning + caregiver dashboard | Healthcare / spatial AI | Ray-Ban Meta Gen 3, Depth-Anything-v2, Grounded SAM 2, Grounding DINO, MapAnything, HLoc, SuperPoint, LightGlue, ElevenLabs, Whisper, Gemini, GPT-4o-mini, Perplexity Sonar, Modal, Twilio, FastAPI, Viser, Tailscale | Most Impactful + OpenAI AI Track 1st | ✅ | [nathanjzhao/treehacks2026](https://github.com/nathanjzhao/treehacks2026) |
| 6 | [Freak in the Sheets](https://devpost.com/software/freak-in-the-sheets-7jl542) | LLVM backend that compiles real software to a Google Sheet | Dev tools / systems | LLVM, C, C++, JS | Most Technically Complex + Human Capital Fellowship ($50K/person) | ✅ | [kognise/freak-in-the-sheets](https://github.com/kognise/freak-in-the-sheets/) |
| 7 | [Sentinel](https://devpost.com/software/sentinel-c8ki50) | Full-stack AI agent that ships a working bare-metal OS to Raspberry Pi from scratch in 24h | Dev tools / embedded | Claude Opus, Claude Agent SDK, FastAPI, SSE, Next.js, Raspberry Pi Zero W, BCM2835, PYNQ-Z2 FPGA, ARM asm, Vivado | Best Hardware Hack | ✅ | [apple-314/treehacks26](https://github.com/apple-314/treehacks26) |
| 8 | [HeartStart](https://devpost.com/software/heartstart) | Autonomous mobile robot performs CPR on cardiac arrest detection | Healthcare / robotics | Arduino, ROS2, OpenCV, Python, Twilio, wearable HR sensor | Best Beginner Hack | ✅ | [nicolewongbiz/cpr-robot](https://github.com/nicolewongbiz/cpr-robot.git) |
| 9 | [VisionOS](https://devpost.com/software/visionos-5euxo7) | Conversational agentic OS for blind devs — replace screen reader with voice agent that codes, shops, controls apps | Accessibility / agents | GPT-4.1 mini STT, Cartesia TTS, LangGraph, Elasticsearch + JINA, Perplexity Sonar, Stagehand/Browserbase, Agent-S/Simular, Electron | OpenAI AI Track 1st | ✅ | [ledaniel0/treehacks2026](https://github.com/ledaniel0/treehacks2026) |
| 10 | [ContainOS](https://devpost.com/software/containos) | Physics-grounded multi-agent copilot for first-3-hours wildfire containment | Climate / civic ops | Claude, GPT-4o, Gemini, FastAPI, React 19, Leaflet, WebSockets, Pydantic, IndexedDB | OpenAI AI Track 1st | ✅ | [maanitg/containment](https://github.com/maanitg/containment) |
| 11 | [ShadowGuard](https://devpost.com/software/shadowguard-l6yv7p) | Network-layer AI firewall that detects + redacts PHI in real time before it leaves the hospital | Healthcare / security | Python, mitmproxy, OpenAI, Vapi, D3.js, Node.js | OpenEvidence Healthcare Grand Prize | ✅ | [shamanthak-hegde/ShadowGuard](https://github.com/shamanthak-hegde/ShadowGuard) |
| 12 | [Project Lend](https://devpost.com/software/project-lend) | Autonomous food bank — AI + robotics sourced and shipped 50+ lbs to Palo Alto shelters during the hackathon itself | Civic / robotics | Claude Agent SDK, Claude Code, Claude Vision (Haiku 3.5), Fetch.ai, Poke (Interaction Co.), Python, React, Warp | Anthropic Human Flourishing 1st | ✅ | [PranavViswanath/project-lend](https://github.com/PranavViswanath/project-lend) |
| 13 | [Tribune](https://devpost.com/software/tribune) | "GitHub for democracy" — scrapes city council agendas, AI-phones residents, generates policy diffs where every change cites a constituent | Civic / agents | Next.js 16, FastAPI, Claude, Gemini 2.0 Flash, OpenAI Realtime, Elasticsearch + JINA + RRF, Twilio WebSocket, Mapbox | Anthropic Human Flourishing 1st | ✅ | [arihantjain4/Tribune](https://github.com/arihantjain4/Tribune) |
| 14 | [Bloom](https://devpost.com/software/bloom-dvjpea) | Voice-first AI caretaker for seniors: cognitive monitoring (early-dementia signal), wearable health, family dashboard | Healthcare / agents | Claude, Stagehand/Browserbase, ElevenLabs, React Native + Expo, Next.js, FastAPI, MongoDB, WHOOP API, Gmail/Beeper/WhatsApp, Vercel Workflows, OpenEvidence | Anthropic Human Flourishing 1st + Decagon Best Conversation Assistant | ✅ | [Kevinxygu/treehacks](https://github.com/Kevinxygu/treehacks) |
| 15 | [Mirage](https://devpost.com/software/synsplatt) | Synthesizes 3D world-model training data for hard-to-capture scenes (driving in a hailstorm) | Robotics / data | Gaussian splatting, Modal, GCP Veo3, Python, Vercel | Modal Inference Grand Prize | ✅ | [kyan-yang/treehacks-2026](https://github.com/kyan-yang/treehacks-2026) |
| 16 | [ShotSpot](https://devpost.com/software/shotspot-kfvp1n) | "Stop scrubbing video" — auto-extracts relevant clips for ML datasets in minutes vs weeks | Dev tools / vision | OpenAI CLIP, Whisper, EasyOCR, Modal GPUs, MongoDB Atlas vector, Bright Data, FastAPI, React | Modal Inference Grand Prize + Bright Data Best AI Web Data | ✅ | [aedutta/shot-spot-treehacks-26](https://github.com/aedutta/shot-spot-treehacks-26/tree/main) |
| 17 | [jiggle wiggle](https://devpost.com/software/jiggle-wiggle) | AI movement coach watches you + a reference (YouTube/instructor/AI-gen) and gives real-time form feedback | Fitness / vision | MediaPipe Pose WASM, SAM2, GPT-4o-mini, OpenAI TTS, Groq, HeyGen Avatar, Perplexity Sonar Pro, Zoom SDK, Modal, ElevenLabs, Bright Data | Modal Inference Grand Prize + Zoom×Render | ✅ | [cindyzli/jigglewiggle](https://github.com/cindyzli/jigglewiggle) |
| 18 | [GridVeda](https://devpost.com/software/gridveda) | Edge-AI predictive transformer fault detection on Jetson; quantum-classical ensemble, 98% accuracy on multi-fault | Energy / edge | Quantum VQC, XGBoost/LightGBM/CatBoost ensembles, Jetson Orin Nano Super, RTX 5090, cuQuantum, Nemotron Nano 4B, Perplexity Sonar, GPT-4, Three.js, D3, FastAPI, TensorRT | Stanford Ecopreneurship "Best Prototyping" | ✅ | [TheRaven5520/GridVeda](https://github.com/TheRaven5520/GridVeda) |
| 19 | [Morro](https://devpost.com/software/morro) | Geoengineering OS — predict natural disasters, pick rain/cloud-seeding interventions, prevent impact | Climate / ops | Google DeepMind GraphCast, NVIDIA Earth2Studio, Random Forest, pandas, xarray, zarr, Vercel | Stanford Ecopreneurship "Best Context Incorporation" | ✅ | [Thaarak/graphcast](https://github.com/Thaarak/graphcast.git) |
| 20 | [Mobius](https://devpost.com/software/mobius-the-first-ai-agent-to-build-a-unicorn) | Autonomous agent runs 11+ hours, 3,000+ turns, builds a full-stack startup from zero (engineering + marketing + legal) | Agents / dev tools | Claude Agent SDK, GCP Vertex AI, Modal sandboxes, Convex, Browserbase, Elastic + Jina, TS + Bun, Slack | YC "Iconic Company" 1st + Modal Sandbox Challenge | ❌ | no repo found |
| 21 | [TradeProof](https://devpost.com/software/tradeproof) | AI infrastructure for blue-collar trade work: AI-vision feedback on actual jobs, portable credentialing, marketplace | Workforce / vertical agents | Next.js, Claude (vision + code), C#, Unity, Meta XR, OpenXR, Supabase, Stripe, Vercel | YC "Iconic Company" 1st | ❌ | no repo found |
| 22 | [aesthetica](https://devpost.com/software/aesthetica) | Spatial fashion on Meta glasses — gesture-tag any outfit you see, get matched products + evolving taste profile | Retail / spatial | Meta glasses, FastAPI/WebSockets, Next.js, Supabase + SQLAlchemy, Redis/Celery, TF.js (BodyPix + MoveNet) | YC "Iconic Company" 1st | ✅ | [socratesosorio/aesthetica](https://github.com/socratesosorio/aesthetica) |
| 23 | [HireUp](https://devpost.com/software/hireright) | TikTok-style two-tower matching + scarcity-based applications for recruiting | Workforce / agents | FastAPI, OpenAI, React, TS, NumPy, SQLite | YC "Iconic Company" 1st | ✅ | [pahu2353/HireUp](https://github.com/pahu2353/HireUp) |
| 24 | [Zeta](https://devpost.com/software/zeta-jwq9te) | "Grammarly for math" — Chrome ext for Overleaf that translates LaTeX → Lean and flags proof errors | Education / dev tools | Lean 4, FastAPI, PyTorch, LoRA/PEFT, vLLM, Modal, W&B, AWS | YC "Iconic Company" 1st | ✅ | [aryans-15/treehacks-2026](https://github.com/aryans-15/treehacks-2026) |
| 25 | [evolve(browser)](https://devpost.com/software/evolve-browser) | Chromium fork: ask in plain English for a browser extension, get one generated | Dev tools / agents | FastAPI, LangChain/LangSmith, GPT-5.2, Nemotron Super 49B, graph RAG, Chromium, Manifest V3, NetworkX | YC "Iconic Company" 1st | ✅ | [adeng27/evolve-browser](https://github.com/adeng27/evolve-browser/) |
| 26 | [Hellocare](https://devpost.com/software/hellocare) | Schedules, explains, and turns medical paperwork into next steps for elderly + low-English-proficiency patients | Healthcare / voice | Next.js 16, Vercel AI SDK, GPT-4o, AssemblyAI, Vapi, Firebase, i18n | Google Cloud AI Track | ✅ | [smallboar/HelloCare](https://github.com/smallboar/HelloCare) |
| 27 | [Bye! Buy!](https://devpost.com/software/bye-buy) | AI agents cross-list, negotiate, and auto-pay for online resale | Commerce / agents | FastAPI, Next.js 16, GPT-5.2, Browserbase + Stagehand, Playwright, Stripe escrow | Google Cloud AI + Browserbase Best Stagehand | ✅ | [jpsingaraju/bye-buy](https://github.com/jpsingaraju/bye-buy) |
| 28 | [TORQ](https://devpost.com/software/torq) | Turn any car into self-driving via Jetson Thor retrofit; CAN bus + iOS app + 10.5B param VLA | Automotive / edge | NVIDIA Jetson AGX Thor, Alpamayo R1 VLA, Holoscan FPGA, Comma.ai Red Panda, Sunnypilot fork, ThunderKittens, TensorRT, Swift, MQTT | NVIDIA Edge AI Track | ✅ | [bryandong24/treehacks2026](https://github.com/bryandong24/treehacks2026), [JoelGrayson/Treehacks2026](https://github.com/JoelGrayson/Treehacks2026) |
| 29 | [Sprout](https://devpost.com/software/greenguardian-microfarm) | Autonomous robotic microfarm — Jetson Nano + custom CNC gantry waters individual plants by species | Agriculture / edge | Arduino, Claude, CUDA, Jetson Nano, Ollama, Qwen, GPIO/I2C | NVIDIA Edge AI Track | ✅ | [lethan3/cactushacks](https://github.com/lethan3/cactushacks) |
| 30 | [Detour](https://devpost.com/software/detour-64kpds) | Edge-first satellite collision avoidance — agent decides when to maneuver, generates burn commands | Aerospace / edge | Nemotron-3-Nano-30B via vLLM, SGP4 propagator, Next.js, Three.js, ASUS GX10 / DGX Spark, Cloudflare | NVIDIA Edge AI Track | ✅ | [keanucz/detour](https://github.com/keanucz/detour) |
| 31 | [CalTrack](https://devpost.com/software/caltrack-i0pq3n) | Disaster impact prediction — fuses device-location signals + fire risk to coordinate emergency response | Civic / climate | Earth2Studio, NVIDIA DGX Spark, Nemotron + Personaplex, FastAPI, PyTorch, VAPI, CrewAI, Apple WPS, HERE | NVIDIA Edge AI Track | ✅ | [alangrewco/treehacks](https://github.com/alangrewco/treehacks) |
| 32 | [Prereq](https://devpost.com/software/prereq-sg1thw) | Live knowledge graphs from lectures so you can't fall behind; profs see live mastery | Education / agents | Claude (Sonnet/Haiku), Next.js, Express, Flask, PostgreSQL, Supabase, Socket.IO, Zoom RTMS SDK, Perplexity Sonar | Zoom Education Track | ✅ | [jasonyi33/prereq](https://github.com/jasonyi33/prereq) |
| 33 | [TA-DA](https://devpost.com/software/ta-da-intelligent-teaching-assistant) | Zoom-native AI TA detects student confusion, generates concept cards in real time | Education / agents | Elasticsearch, Fetch.ai, LangChain, GPT-4 / xAI, Zoom RTMS SDK, Redis, Docker | Zoom Education Track | ✅ | [pb2323/TA-da](https://github.com/pb2323/TA-da) |
| 34 | [Minerva](https://devpost.com/software/minerva-3sj6z0) | AI avatar 1:1 tutor across K-12 → workforce reentry | Education / voice | Claude (Haiku/Opus), HeyGen LiveAvatar, Next.js, Zoom Video SDK, Manim, Desmos, GeoGebra | Zoom Education Track + HeyGen Best Creation | ✅ | [anton-3/minerva](https://github.com/anton-3/minerva) |
| 35 | [Monolith](https://devpost.com/software/monolith-z10684) | Shared agent context across devs via Recursive Language Models — "one context, run everywhere" | Dev tools / agents | Claude, MCP, Modal sandboxes/volumes, OpenAI, Cloudflare Workers + Containers, Python, UV | Modal Sandbox Challenge | ✅ | [WingchunSiu/Monolith](https://github.com/WingchunSiu/Monolith) |
| 36 | [Longshot](https://devpost.com/software/longshot) | Burned $5,500 running 100+ coding agents at 1,200 commits/hr to build Minecraft in one shot | Dev tools / agents | Claude SDK, GPT-5.2, GLM-5, Modal, Gource viz, MCP, Poke | Modal Sandbox Challenge | ✅ | [andrewcai8/agentswarm](https://github.com/andrewcai8/agentswarm) |
| 37 | [RescueRX](https://devpost.com/software/rescuerx) | Multi-agent system mining shelved drugs for off-label disease treatments | Healthcare / agents | 97k-entity / 5.87M-relationship knowledge graph, neural relational embeddings, Morgan fingerprints, Tanimoto, FAERS data, Perplexity Sonar | OpenEvidence Best Use of Clinical Info | ✅ | [Donglomur/TreeHacks](https://github.com/Donglomur/TreeHacks) |
| 38 | [Sunday](https://devpost.com/software/sunday-94odas) | iMessage-native AI concierge for events, food, reservations, social matchmaking | Consumer / agents | Claude Agent SDK, Browserbase + Stagehand, Perplexity Sonar, Vapi, Supermemory, Next.js, Vercel AI SDK | Anthropic Best Use of Claude Agent SDK | ✅ | [priyanshbhatter24/sunday](https://github.com/priyanshbhatter24/sunday) |
| 39 | [Keryx](https://devpost.com/software/keryx-k49dta) | Drones map buildings in minutes → AI-operable world model; assistive agents navigate to food/elevator | Spatial / robotics | Apple Depth Pro, Qwen3-VL, Modal GPUs, FastAPI, vLLM, OpenCV, PyTorch, Poke + MCP | Human Capital Fellowship ($50K/person) | ✅ | [WubbLord/treehacks-26](https://github.com/WubbLord/treehacks-26) |
| 40 | [OnTab](https://devpost.com/software/ontab) | "Cursor Tab for everything" — predicts the next browser action, executes on Tab press | Dev tools / agents | Claude Haiku/Sonnet, FastAPI, HuggingFace, Modal, ONNX, Plasmo, Stagehand, WebGPU, WebLLM, PyTorch | Human Capital Fellowship ($50K/person) | ✅ | [csaye/ontab](https://github.com/csaye/ontab) |
| 41 | [Edamame](https://devpost.com/software/m-4f2iwy) | AI clones of every employee from Slack/Drive/Gmail/GitHub/Notion — answers questions w/ source citations | Enterprise / agents | Next.js 16, Supabase pgvector, GPT-5.3, text-embedding-3-small, Whisper, OAuth integrations | Greylock Best Multi-Turn Agent ($10K) | ✅ | [angelinaquan/edamame-treehacks](https://github.com/angelinaquan/edamame-treehacks/) |
| 42 | [aimogus](https://devpost.com/software/aimogus) | Among Us simulation evaluating LLM deception + alignment interventions | AI safety / research | Flask, Modal, OpenRouter, PyTorch, Transformers, W&B | Greylock Best Multi-Turn Agent | ✅ | [samarth-bhargav/treehacks-amogus](https://github.com/samarth-bhargav/treehacks-amogus) |
| 43 | [Power Lever](https://devpost.com/software/power-lever) | Agentic inference optimization: dynamic GPU orchestration + speculative decoding | Infrastructure / agents | Claude Agent SDK, FastAPI, Modal, OpenAI, Vercel, vLLM | Greylock Best Multi-Turn Agent | ❌ | no repo found |
| 44 | [Mira Mira on Da Wall](https://devpost.com/software/mira-3xqlos) | AI smart-mirror layers clothes onto your reflection, suggests purchases from your shopping/email/calendar | Retail / spatial | Two-way mirror hardware + webcam, MediaPipe gesture, OpenAI, ElevenLabs, Perplexity Sonar, SerpAPI, HeyGen, Pika, MCP, Firecrawl, Google OAuth | Visa "Generative Edge: Future of Commerce" ($10K) | ✅ | [23jmo/mirrorless](https://github.com/23jmo/mirrorless) |
| 45 | [Voider](https://devpost.com/software/voider) | Voice-first shopping brain — orchestrates cross-platform price compare + agentic payments | Commerce / voice agents | Claude, ElevenLabs Conversational AI, Next.js 16, Elasticsearch, Fetch.ai uAgents, Bright Data, Jina, Visa Agent Payment Protocol, LangChain, MCP | Fetch.ai Best Overall + Best Multi-Agent + Best Monetised | ✅ | [Sohamiscurious/TreeHacks2026](https://github.com/Sohamiscurious/TreeHacks2026) |
| 46 | [HackOverflow](https://devpost.com/software/hackoverflow-stack-overflow-for-ai-agents-at-hackathons) | Stack Overflow for AI agents — persistent verified solutions, escalate to humans | Dev tools / agents | Claude, Cursor, Elasticsearch, Fetch.ai, Modal, RunPod, v0, Vercel | Fetch.ai (3 prizes) + RunPod Best Flash | ✅ | [vrinda-inani/treehacks26](https://github.com/vrinda-inani/treehacks26) |
| 47 | [AgentPlace](https://devpost.com/software/agentplace) | AI-native marketplace where agents haggle for you | Commerce / agents | Fetch.ai uAgents, ASI:One, Python, TS, Supabase, React | Fetch.ai (3 prizes) | ✅ | [patidararnav/agentplace](https://github.com/patidararnav/agentplace) |
| 48 | [RepoRx](https://devpost.com/software/molecule-mcbob) | GPU-accelerated diffusion sims to find FDA-approved drug-repurposing candidates for cancer | Healthcare / agents | DiffDock, RDKit, molecular docking, arXiv/PubChem/RCSB, Perplexity Sonar Pro, RunPod Blackwell, Fetch.ai | Fetch.ai (2 prizes) + RunPod Best Flash | ✅ | [ezou1/tree26](https://github.com/ezou1/tree26) |
| 49 | [NeuroBlocks](https://devpost.com/software/neuroblocks-cz7n9k) | "LEGO for AI" — drag-and-drop neural network builder | Education / dev tools | Next.js 14, FastAPI, PyTorch, OpenAI, RunPod, Supabase, Chart.js | RunPod Best Flash | ✅ | [tupdaily/AIPlayground](https://github.com/tupdaily/AIPlayground) |
| 50 | [ADapt](https://devpost.com/software/adapt-ujvn5e) | Master video → AI-localized variants per audience segment in seconds | Marketing / agents | FastAPI, Next.js 16, FFmpeg, Elasticsearch, GPT-5, Whisper, Perplexity Sonar, RunPod, MCP | RunPod Best Flash | ✅ | [ssiddhantsood/treehacks](https://github.com/ssiddhantsood/treehacks) |
| 51 | [Gallop](https://devpost.com/software/gallop) | Multi-agent AI cybersecurity platform — detects intrusions, fires defensive actions in real time | Security / agents | eBPF, Elasticsearch, Elastic Agent Builder + Workflows, Next.js, Rust, OpenAI, Jina, vector search | Elastic Best End-to-End Agentic | ✅ | [Eth007/gallop](https://github.com/Eth007/gallop) |
| 52 | [CareLink](https://devpost.com/software/carelink-k1pzeh) | Voice AI w/ RAG clinical reasoning — flags post-surgical complications before readmission | Healthcare / voice | Claude SDK, Elasticsearch, ElevenLabs, ES\|QL, Perplexity Sonar, Twilio, RAG | Elastic Best End-to-End Agentic | ✅ | [JoyZhuoz/carelink](https://github.com/JoyZhuoz/carelink) |
| 53 | [4sight](https://devpost.com/software/4sight-neoslb) | Bangle.js watch + Ray-Ban glasses biometric monitor predicts when you'll make bad decisions, intervenes | Consumer / spatial / wearable | Bangle.js 2, Meta Ray-Bans, Expo/React Native, XGBoost, FastAPI, Cloudflare Containers/D1/Workers, Modal, Gemma 3 4B VLM, GPT-4o-mini, Poke, Screen Time API | Cloudflare Best Use ($250K credits) | ✅ | [kl527/4sight](https://github.com/kl527/4sight) |
| 54 | [Concierge](https://devpost.com/software/concierge-1tjlf5) | Two Poke agents collaborate on shared context (email + web + texts) to find + buy the perfect gift | Consumer / agents | Browserbase, Bun, FastMCP, Next.js, OpenAI, Poke, SQLite | Interaction Co. (Poke) + Browserbase | ✅ | [andaero/treehacks26](https://github.com/andaero/treehacks26) |
| 55 | [The Orchestration Co. of Palo Alto](https://devpost.com/software/the-orchestration-company-of-palo-alto) | Apple Vision Pro AR control room — supervise multiple Claude Code agents as desks in a 3D office | Dev tools / spatial / agents | Swift, visionOS, RealityKit, FastAPI, FastMCP, Modal, Claude Agent SDK, OpenAI STT/TTS, Browserbase/Stagehand, ElevenLabs, Next.js, Cloudflare | Interaction Co. (Poke) | ✅ | [FO214/treehacks](https://github.com/FO214/treehacks), [soooooooot/treehacks-agent-repo](https://github.com/soooooooot/treehacks-agent-repo) |
| 56 | [HIVE](https://devpost.com/software/hive-swarm-intelligence) | Swarm of computer-use agents in parallel across Gmail/Docs/Sheets/Slides/Forms/Calendar/Drive | Productivity / agents | Browserbase, Claude Agent SDK, Fetch.ai, Modal (GPT-OSS-120B on B200), Stagehand, vLLM, Next.js, Vercel | Browserbase Best Stagehand | ✅ | [bossbobster/hive](https://github.com/bossbobster/hive/tree/main) |
| 57 | [.dot](https://devpost.com/software/dot-bringing-humanity-to-in-home-care) | Multimodal speech-to-speech in-home eldercare agent — patient charts + medical knowledge + medication routine + emergency contacts | Healthcare / hardware / voice | Anthropic Claude, Arduino, barcode scanner, Browserbase, OpenAI Realtime API, Perplexity, Next.js 15, Postgres, Prisma, WS2812B LEDs, OpenWakeWord | Zingage Best Voice AI for Healthcare | ✅ | [o-bm/dot](https://github.com/o-bm/dot) |
| 58 | [Snappier](https://devpost.com/software/snappier) | Record your screen once → AI infers intent, automates it across connected SaaS | Productivity / agents | Next.js 15, Gemini (video), Claude Haiku/Sonnet, Whisper, Cloudflare R2, Clerk, Composio (100+ SaaS), Manifest V3 | Graphite "Most Likely to Get Acquired" + Vercel | ✅ | [nintang/snappier-treehacks](https://github.com/nintang/snappier-treehacks) |
| 59 | [Arena](https://devpost.com/software/arena-lz2m84) | Agents *compete* to write the frontend that best serves you — live UI previews instead of PR review | Dev tools / agents | Express, GitHub API, Next.js, Probot, Smee.io, Vercel, Warp Oz Agent SDK | Warp Best Use of Warp Agents | ✅ | [TomBinford/treehacks](https://github.com/TomBinford/treehacks/) |
| 60 | [Maestro](https://devpost.com/software/maestro-n0uqyz) | Turn a broom into a playable guitar — CV + hand tracking + posture coach + AI music gen | Music / vision | MediaPipe, OpenCV, WebSocket Python server, Qwen2.5-VL, NVIDIA Music Flamingo, ASUS GX10 Blackwell, Suno API, iPhone chord detector | Suno Best Musical Hack | ✅ | [markmusic27/treehacks](https://github.com/markmusic27/treehacks) |
| 61 | [NextOp](https://devpost.com/software/nextop) | AI coach that translates military careers into civilian résumés + benefits + training | Workforce / voice | Claude API, FastAPI, React + TS, Hume EVI, sentence-transformers, Bright Data, SQLite | Bright Data Best AI Web Data | ✅ | [cocozxu/NextOp](https://github.com/cocozxu/NextOp) |
| 62 | [kiru](https://devpost.com/software/kiru) | Voice agent that calls customer support and negotiates your bills down | Consumer / voice | FastAPI, Next.js, Twilio, Deepgram, OpenAI/Anthropic/vLLM, Perplexity, Bright Data, WebSockets | Bright Data Best AI Web Data | ✅ | [Pranav-Karra-3301/treehacks-26](https://github.com/Pranav-Karra-3301/treehacks-26/tree/main) |
| 63 | [Tonguekeeper](https://devpost.com/software/tonguekeeper) | Autonomous AI agents compile + cross-reference vocabulary/grammar from scattered sources into a living language atlas (one language dies every 2 weeks) | Civic / linguistics / agents | Next.js 16, Express + Socket.io, Claude Haiku/Sonnet, Perplexity Sonar, JINA embeddings + reranker, Elasticsearch, BrightData Web Unlocker, Browserbase/Stagehand, HeyGen, Cloudflare R2/KV, force graph, Leaflet, D3 | Perplexity Best Use of Sonar | ✅ | [lourdrickvalsote/tonguekeeper](https://github.com/lourdrickvalsote/tonguekeeper) |
| 64 | [Synapse](https://devpost.com/software/a-p1lt2h) | "Claim-level truth forensics" — break content into atomic claims, verify each, show provenance | Civic / agents | Claude API, Perplexity Sonar, Semantic Scholar, FastAPI, React + TS, Supabase pgvector, Firecrawl, BeautifulSoup, Railway, Vercel | Perplexity Best Use of Sonar | ✅ | [yravipati/TreeHacks-2026](https://github.com/yravipati/TreeHacks-2026) |

---

## Industry breakdown

Counts overlap (many projects bridge categories — counted in primary).

- **Agents / dev tools** (15 winners): Mobius, Longshot, Monolith, Sentinel, evolve(browser), Sunday, OnTab, HackOverflow, AgentPlace, Snappier, Arena, ADapt, Edamame, HIVE, Bye! Buy! → **dominant category**. Heavy use of Claude Agent SDK + Modal sandboxes + Browserbase Stagehand. This is the "AI builds AI" wave.
- **Healthcare** (10): Shepherd, Robosurge, Mira, ShadowGuard, Bloom, Hellocare, RescueRX, RepoRx, CareLink, .dot. Skewed eldercare + post-discharge + drug discovery; OpenEvidence sponsor inflated count.
- **Spatial / vision / VLM-grounded** (8): Mira, Mirage, Keryx, aesthetica, Mira Mira on Da Wall, 4sight, Orchestration Co. (visionOS), Maestro. Strong over-representation vs typical hackathons — Ray-Ban Meta + Apple Vision Pro + Jetson made VLM hardware accessible.
- **Climate / sustainability / energy** (5): ContainOS, GridVeda, Morro, Sprout, CalTrack. Stanford Ecopreneurship + NVIDIA Edge AI tracks pulled this hard.
- **Education** (5): Prereq, TA-DA, Minerva, Zeta, NeuroBlocks. Zoom track sponsored most.
- **Civic / democracy / truth** (4): Tribune, Synapse, Tonguekeeper, Project Lend.
- **Hardware / robotics** (5): Shepherd, Robosurge, HeartStart, diffuji, TORQ (others use HW but center it).
- **Commerce / consumer agents** (6): Voider, Mira Mira, AgentPlace, Concierge, Bye! Buy!, Sunday.
- **Workforce / hiring** (3): HireUp, NextOp, TradeProof.
- **Security** (2): Gallop, ShadowGuard.
- **Aerospace / automotive** (2): Detour (satellites), TORQ (cars).
- **Infrastructure / inference** (3): Mirage, Power Lever, Monolith.
- **AI safety / research** (1): aimogus.

**Pattern signals:**
- **Vertical agent stacks on critical infra** is *the* winning archetype: ContainOS (wildfire), GridVeda (grid), CalTrack (disaster), Detour (satellites), TORQ (vehicles), ShadowGuard (hospital networks), Tribune (city councils), Gallop (SOC). 8+ of 64 winners. Your direction is dead-center.
- **VLM + spatial reasoning** had a breakout year — Mira, Keryx, aesthetica, 4sight, Orchestration Co., Maestro all leveraged VLMs grounded in real-world geometry (depth, splatting, hand tracking, AR).
- **Multi-capability stacks (3+ frontier modalities)** dominated grand prizes: Shepherd (LiDAR + voice + hardware + agent), Mira (VLM + voice + 3D + medical), Robosurge (VR + CV + robotics + theorem prover). The grand-prize winners *all* had 3+.
- **Grounded / cited-source reports** was a quiet winning pattern: Tribune ("every change cites a constituent"), Synapse ("trace any idea back to origin"), Edamame ("answers with source citations"), Tonguekeeper (cross-references atlas). Aligns with your "audit-grade" angle.

**Under-represented (gaps to attack):**
- Finance / fintech (just 1 unawarded — Autonomous Dual Mandate Agent)
- Supply chain / logistics
- Gov / military ops centers (Ironsight angle is wide open)
- Trading floors / regulated industries beyond healthcare

---

## Architectural-pattern overlap with your direction

### Vertical-agent-stack on critical infrastructure
- [ContainOS](https://devpost.com/software/containos) — wildfire incident-command copilot, physics-grounded. Multi-LLM ensemble. **Closest analog.** Repo: [maanitg/containment](https://github.com/maanitg/containment).
- [GridVeda](https://devpost.com/software/gridveda) — power grid edge AI, 98% multi-fault detection. Repo: [TheRaven5520/GridVeda](https://github.com/TheRaven5520/GridVeda).
- [CalTrack](https://devpost.com/software/caltrack-i0pq3n) — disaster impact + emergency dispatch. CrewAI mesh. Repo: [alangrewco/treehacks](https://github.com/alangrewco/treehacks).
- [Detour](https://devpost.com/software/detour-64kpds) — satellite collision avoidance, edge inference. Repo: [keanucz/detour](https://github.com/keanucz/detour).
- [Gallop](https://devpost.com/software/gallop) — SOC multi-agent triage. Elastic Agent Builder. Repo: [Eth007/gallop](https://github.com/Eth007/gallop).
- [ShadowGuard](https://devpost.com/software/shadowguard-l6yv7p) — hospital network firewall, real-time PHI redaction. Repo: [shamanthak-hegde/ShadowGuard](https://github.com/shamanthak-hegde/ShadowGuard).
- [Tribune](https://devpost.com/software/tribune) — civic ops, every diff cited to voice. Repo: [arihantjain4/Tribune](https://github.com/arihantjain4/Tribune).

### Spatial reasoning / VLM-grounded (Localize-and-Zoom on raw video)
- [Mira](https://devpost.com/software/mira-w65b0a) — Ray-Ban + Grounded SAM 2 + Grounding DINO + MapAnything. **This is the Localize-and-Zoom-on-raw-video reference architecture** (HLoc + LightGlue + SuperPoint). Repo: [nathanjzhao/treehacks2026](https://github.com/nathanjzhao/treehacks2026).
- [Keryx](https://devpost.com/software/keryx-k49dta) — drone + Apple Depth Pro → Qwen3-VL navigable world model. Repo: [WubbLord/treehacks-26](https://github.com/WubbLord/treehacks-26).
- [Mirage](https://devpost.com/software/synsplatt) — Gaussian splat synthesis for hard-to-capture training scenes. Repo: [kyan-yang/treehacks-2026](https://github.com/kyan-yang/treehacks-2026).
- [ShotSpot](https://devpost.com/software/shotspot-kfvp1n) — CLIP + Whisper + EasyOCR multimodal video search. Repo: [aedutta/shot-spot-treehacks-26](https://github.com/aedutta/shot-spot-treehacks-26/tree/main).
- [Maestro](https://devpost.com/software/maestro-n0uqyz) — MediaPipe + Qwen2.5-VL hand-tracking grounded musical inference. Repo: [markmusic27/treehacks](https://github.com/markmusic27/treehacks).

### Multi-capability stacks (3+ frontier modalities)
- [Shepherd](https://devpost.com/software/raising-cane) — LiDAR vision + voice + haptics + hardware + GPS agent. Won grand prize 1. Repo: [tonywangs/shepherd](https://github.com/tonywangs/shepherd).
- [Mira](https://devpost.com/software/mira-w65b0a) — VLM + 3D recon + voice + medical RAG + caregiver dashboard.
- [.dot](https://devpost.com/software/dot-bringing-humanity-to-in-home-care) — voice agent + barcode HW + medical RAG + LED display + wake-word + browser automation. Repo: [o-bm/dot](https://github.com/o-bm/dot).
- [TORQ](https://devpost.com/software/torq) — VLA model + CAN bus HW + iOS app + Jetson edge.

### Grounded / audit-grade citation reports
- [Tribune](https://devpost.com/software/tribune) — every policy diff cites the voice that asked for it.
- [Synapse](https://devpost.com/software/a-p1lt2h) — atomic-claim verification with provenance trail.
- [Edamame](https://devpost.com/software/m-4f2iwy) — answers always cite which Slack thread / Drive doc.
- [Tonguekeeper](https://devpost.com/software/tonguekeeper) — cross-references scattered language sources.
- [RescueRX](https://devpost.com/software/rescuerx) — drug repurposing with FAERS + clinical-trials provenance.

### Multi-site context federation (your specific extension)
**No TreeHacks 2026 winner does this directly.** Closest precedent is:
- [Monolith](https://devpost.com/software/monolith-z10684) — federates *agent context across developers* on a shared repo via Recursive Language Models. Read this code. Repo: [WingchunSiu/Monolith](https://github.com/WingchunSiu/Monolith).
- [Edamame](https://devpost.com/software/m-4f2iwy) — federates context *across one company's surfaces* (Slack/Drive/Gmail/GitHub/Notion). Pattern is right; needs to be lifted across *organizations*.
- [HackOverflow](https://devpost.com/software/hackoverflow-stack-overflow-for-ai-agents-at-hackathons) — agents share verified solutions across runs. Repo: [vrinda-inani/treehacks26](https://github.com/vrinda-inani/treehacks26).

The federation-across-sites angle is **wide open** — nobody at TreeHacks 2026 did "evidence from site A automatically informs the agent at site B."

### K2 Think / Dedalus
- **Zero TreeHacks projects used K2 Think or Dedalus** — they were not sponsors. This is your differentiator at HackTech, not a copy target.

---

## Top 10 to clone-and-read (ranked by usefulness to your direction)

### 1. [Mira](https://devpost.com/software/mira-w65b0a) — must-read
**Repo:** [nathanjzhao/treehacks2026](https://github.com/nathanjzhao/treehacks2026)
The closest existing TreeHacks 2026 implementation of "VLM-grounded localize-and-zoom on raw video." It runs Grounded SAM 2 + Grounding DINO + MapAnything + HLoc + LightGlue + SuperPoint on Ray-Ban Meta video to do *3D scene reconstruction + object localization + medical RAG + caregiver dashboard* — five frontier capabilities in one. Won "Most Impactful" + OpenAI AI Track. Read the SfM+VLM stitching pipeline, the streaming ingest from Meta glasses (RTMP + MediaMTX), and how they share state between the patient-side voice agent and the caregiver dashboard via Supabase. **This architecture cleanly extends to multi-site federation** — replace "one home" with "a network of homes" and you have a HackTech-grade idea.

### 2. [Tribune](https://devpost.com/software/tribune) — must-read
**Repo:** [arihantjain4/Tribune](https://github.com/arihantjain4/Tribune)
The platonic ideal of "audit-grade reports where every claim cites a source." Scrapes city council agendas, AI-phones residents (Twilio + OpenAI Realtime), generates policy diffs where every change line ties back to a constituent voice clip. Elasticsearch + JINA + Reciprocal Rank Fusion is a clean reference for grounded retrieval. Read the diff-rendering and citation-binding logic — that's the pattern you steal for any audit-grade vertical agent.

### 3. [ContainOS](https://devpost.com/software/containos) — must-read
**Repo:** [maanitg/containment](https://github.com/maanitg/containment)
The tightest "vertical agent stack on critical infrastructure" example. Wildfire incident command in the first 3 hours. Multi-LLM ensemble (Claude + GPT-4o + Gemini), physics-grounded, real-time map UI. Read how they handle the multi-model orchestration, the Pydantic schemas for cross-agent state, and the IndexedDB offline cache (think: ops centers with iffy connectivity).

### 4. [Keryx](https://devpost.com/software/keryx-k49dta) — read for spatial pipeline
**Repo:** [WubbLord/treehacks-26](https://github.com/WubbLord/treehacks-26)
Drones + Apple Depth Pro + Qwen3-VL → AI-operable navigable world model. Demo theatre is built-in (the drone). The codebase shows how to wire a VLM into a 3D world model that downstream agents can query — exact pattern you'd want for industrial site mapping or ops-center spatial awareness. Modal vLLM endpoints make it deployable.

### 5. [Mobius](https://devpost.com/software/mobius-the-first-ai-agent-to-build-a-unicorn) — no repo
**no repo — Devpost-only inspiration.** Pitch is "11+ hour autonomous agent run, 3,000+ turns, ships a full company." Closest TreeHacks proof of "long-horizon Dedalus-style agent runner" pattern. Even without the code, the architecture description (Claude Agent SDK + GCP Vertex + Modal sandboxes + Convex state + Browserbase + Slack) is your reference for what a Dedalus-powered demo should look like at HackTech.

### 6. [The Orchestration Co. of Palo Alto](https://devpost.com/software/the-orchestration-company-of-palo-alto) — read for the demo theatre
**Repos:** [FO214/treehacks](https://github.com/FO214/treehacks), [soooooooot/treehacks-agent-repo](https://github.com/soooooooot/treehacks-agent-repo)
Vision Pro AR control room where agents are 3D desks. Custom MCP tools spin up Modal sandboxes on demand. The killer-toggle interaction (look at desk → focus that agent) is the kind of "wow" moment HackTech judges remember. If you have anyone with visionOS experience, read this.

### 7. [Edamame](https://devpost.com/software/m-4f2iwy) — read for federated context
**Repo:** [angelinaquan/edamame-treehacks](https://github.com/angelinaquan/edamame-treehacks/)
"AI clones of every employee" — federates context across Slack/Drive/Gmail/GitHub/Notion via OAuth + pgvector + always-cited answers. The OAuth-many-sources + always-cite pattern is the bones of your "multi-site context federation" idea, just at company scale instead of network scale. Read the ingestion + citation pipelines.

### 8. [4sight](https://devpost.com/software/4sight-neoslb) — read for multi-modal wearable stack
**Repo:** [kl527/4sight](https://github.com/kl527/4sight)
Bangle.js watch + Ray-Ban glasses + Cloudflare Workers + Modal + Gemma 3 4B VLM. A clean reference for stitching wearable biometrics + VLM + edge inference into one agent loop. Cloudflare Containers + D1 = $250K credits + low-latency global edge — useful HackTech infra play.

### 9. [Shepherd](https://devpost.com/software/raising-cane) — read for hardware+voice+vision+agent fusion
**Repo:** [tonywangs/shepherd](https://github.com/tonywangs/shepherd)
Won grand prize 1. iPhone LiDAR + DeepLabV3 + ARKit + BLE + Arduino + voice nav agent. The grand-prize lesson: a real physical thing that *moves* during the demo wins. ARKit + DeepLabV3 obstacle detection is reusable for any spatial-aware vertical agent.

### 10. [Sentinel](https://devpost.com/software/sentinel-c8ki50) — read for Claude Agent SDK extreme application
**Repo:** [apple-314/treehacks26](https://github.com/apple-314/treehacks26)
"Full-stack AI for bare-metal embedded systems" — Claude Agent SDK + Claude Opus shipped a working bare-metal OS to RPi from scratch in 24 hours. If you're going to lean on Dedalus's agent runner, this is the cleanest TreeHacks reference for "give the agent a long-horizon autonomous job, let it rip." Server-Sent Events streaming UI is also a nice pattern.

---

## "What would be insane and cool" — opinionated HackTech 2026 ideas

Rooted in winning patterns: vertical-agent-stack on critical infra + VLM spatial grounding + multi-modal stack + grounded citations + multi-site federation. Each plugs K2 Think (audit-grade reasoning model with cited reasoning traces) and Dedalus (long-horizon agent runner + sandboxed container service) for sponsor leverage.

### 1. **Sentinel-Net** — federated SOC for water utilities (or any small-municipal critical infra)
A Localize-and-Zoom + audit-grade-report pattern applied to surveillance video at multiple unstaffed pump stations / substations / water-treatment plants. Edge VLM (running on Jetson — see GridVeda, TORQ) detects anomalies (intrusion, vandalism, fire, leak), zooms on raw video, K2 Think reasons over the localized crop and produces a cited incident report ("at 02:14:37, person climbing fence at northwest corner — bbox xyz, frame 4421"). Dedalus runs the long-horizon agent loop per site. **The federation twist:** when site A detects a pattern, all sister sites get their detection thresholds auto-updated via a shared evidence ledger. Demo theatre: live multi-site dashboard on a wall, judge walks past a webcam, the system flags + cites them in real time. ~3 frontier capabilities (vision + agent + edge HW + federation).

### 2. **Containment-Mesh** — wildland-fire ops center that federates evidence across counties
Take ContainOS's first-3-hours pattern and federate it across a multi-county region. Each fire site runs an edge agent (drone footage + sensor data → VLM-grounded "what's burning where"). K2 Think synthesizes a cross-site situational picture with cited sources for every assertion ("Cal Fire camera 27, frame 12338, 03:14 confirms ember jump 0.4mi north"). Dedalus orchestrates per-site agents and a meta-orchestrator. Audit-grade IC report. Multi-capability: drone vision + voice (radio comms ingest) + agent + cited K2 reasoning + multi-site federation. The wildfire patterns ContainOS used + Tribune's grounded-citation pattern + Mirage's synthetic training data for hard scenes = unique stack.

### 3. **OR-Federate** — spatial-grounded surgical safety net across hospital network
Inspired by Robosurge + ShadowGuard + Mira + Keryx. Each OR has a ceiling-mounted camera. VLM (grounded with depth) localizes instruments, counts gauze, tracks team positions. K2 Think produces an audit-grade "OR snapshot" report each minute, citing the specific frames it reasoned over. Dedalus runs the per-OR agent. Federation: when one hospital's system catches a near-miss pattern, all federated ORs in the network get a real-time alert. Compliance & insurance gold mine. Demo theatre: simulate a "missing instrument" event in a mock OR, system catches it instantly with a cited timestamp.

### 4. **EchoFront** — multi-site voice-agent for regulated-industry compliance audits
Inspired by Tribune + Bloom + Hellocare + .dot + Synapse. Voice agent calls into 50 retail/clinic/branch locations daily, conducts compliance interviews with on-site staff, transcribes + grounds answers in K2-Think-reasoned cited reports ("staff at Site 14 said 'we don't always lock the cabinet' — voice clip 02:34, transcript line 17"). Dedalus runs the persistent calling loop. Federation: aggregated cross-site signal flags systemic risk before any single audit fails. Multi-capability: voice + agent + audit-grade citations + multi-site federation. Sponsor leverage: K2 Think for the cited reasoning traces is the killer differentiator vs the GPT-4-realtime pile.

### 5. **GridSentinel** — VLM-grounded transformer/substation inspection for utility cooperatives
Take GridVeda's Jetson-based predictive monitoring + Keryx's drone world model + Mira's spatial-VLM stack. A drone flies a substation, captures imagery, edge VLM localizes-and-zooms on every transformer, K2 Think produces a per-asset audit-grade "health card" citing specific image regions + sensor readings. Dedalus runs the long-horizon inspection loop. Federation: insights from one cooperative's substations train every other co-op's anomaly thresholds. Demo theatre: physical mini-substation diorama on the table, drone hovers over it, system pops up a 3D dashboard with cited bounding boxes. Three frontier capabilities (drone vision + spatial VLM + agent), real vertical (rural electric coops are starving for this), and the federation angle is uncopiable.

---

## Sources

### TreeHacks 2026 official
- [TreeHacks 2026 project gallery](https://treehacks-2026.devpost.com/project-gallery) (378 submissions, 64 marked Winner)
- [TreeHacks 2026 hackathon homepage](https://treehacks-2026.devpost.com/)
- [TreeHacks main site](https://treehacks.com/)
- [Stanford Daily — 12th annual TreeHacks awards $500,000 in prizes (Feb 15 2026)](https://stanforddaily.com/2026/02/15/12th-annual-treehacks/)
- [Stanford Office of Student Engagement — TreeHacks 12: Sam Altman and Llamas](https://ose.stanford.edu/news/treehacks-12-sam-altman-and-llamas)
- [EdTech Innovation Hub — Maestro wins TreeHacks](https://www.edtechinnovationhub.com/news/stanford-team-wins-treehacks-with-ai-system-that-turns-a-broom-into-a-playable-instrument)
- [TreeHacks on X / @hackwithtrees](https://x.com/hackwithtrees)

### Project pages (all 64 winners)
1. https://devpost.com/software/raising-cane
2. https://devpost.com/software/we-use-nix
3. https://devpost.com/software/chromachord
4. https://devpost.com/software/diffuji
5. https://devpost.com/software/mira-w65b0a
6. https://devpost.com/software/freak-in-the-sheets-7jl542
7. https://devpost.com/software/sentinel-c8ki50
8. https://devpost.com/software/heartstart
9. https://devpost.com/software/visionos-5euxo7
10. https://devpost.com/software/containos
11. https://devpost.com/software/shadowguard-l6yv7p
12. https://devpost.com/software/project-lend
13. https://devpost.com/software/tribune
14. https://devpost.com/software/bloom-dvjpea
15. https://devpost.com/software/synsplatt
16. https://devpost.com/software/shotspot-kfvp1n
17. https://devpost.com/software/jiggle-wiggle
18. https://devpost.com/software/gridveda
19. https://devpost.com/software/morro
20. https://devpost.com/software/mobius-the-first-ai-agent-to-build-a-unicorn
21. https://devpost.com/software/tradeproof
22. https://devpost.com/software/aesthetica
23. https://devpost.com/software/hireright
24. https://devpost.com/software/zeta-jwq9te
25. https://devpost.com/software/evolve-browser
26. https://devpost.com/software/hellocare
27. https://devpost.com/software/bye-buy
28. https://devpost.com/software/torq
29. https://devpost.com/software/greenguardian-microfarm
30. https://devpost.com/software/detour-64kpds
31. https://devpost.com/software/caltrack-i0pq3n
32. https://devpost.com/software/prereq-sg1thw
33. https://devpost.com/software/ta-da-intelligent-teaching-assistant
34. https://devpost.com/software/minerva-3sj6z0
35. https://devpost.com/software/monolith-z10684
36. https://devpost.com/software/longshot
37. https://devpost.com/software/rescuerx
38. https://devpost.com/software/sunday-94odas
39. https://devpost.com/software/keryx-k49dta
40. https://devpost.com/software/ontab
41. https://devpost.com/software/m-4f2iwy
42. https://devpost.com/software/aimogus
43. https://devpost.com/software/power-lever
44. https://devpost.com/software/mira-3xqlos
45. https://devpost.com/software/voider
46. https://devpost.com/software/hackoverflow-stack-overflow-for-ai-agents-at-hackathons
47. https://devpost.com/software/agentplace
48. https://devpost.com/software/molecule-mcbob
49. https://devpost.com/software/neuroblocks-cz7n9k
50. https://devpost.com/software/adapt-ujvn5e
51. https://devpost.com/software/gallop
52. https://devpost.com/software/carelink-k1pzeh
53. https://devpost.com/software/4sight-neoslb
54. https://devpost.com/software/concierge-1tjlf5
55. https://devpost.com/software/the-orchestration-company-of-palo-alto
56. https://devpost.com/software/hive-swarm-intelligence
57. https://devpost.com/software/dot-bringing-humanity-to-in-home-care
58. https://devpost.com/software/snappier
59. https://devpost.com/software/arena-lz2m84
60. https://devpost.com/software/maestro-n0uqyz
61. https://devpost.com/software/nextop
62. https://devpost.com/software/kiru
63. https://devpost.com/software/tonguekeeper
64. https://devpost.com/software/a-p1lt2h

### Sponsor leverage (relevant for HackTech but not used at TreeHacks)
- [MBZUAI K2 Think Hackathon launch (PRNewswire)](https://www.prnewswire.com/news-releases/mbzuai-launches-k2-think-hackathon-to-turn-ideas-into-real-world-impact-302583582.html)
- [MBZUAI K2 Think V2 launch](https://www.prnewswire.com/news-releases/mbzuai-launches-k2-think-v2-uaes-fully-sovereign-next-generation-reasoning-system-302671460.html)
- [MBZUAI — K2 Think V2 fully sovereign reasoning model](https://mbzuai.ac.ae/news/k2-think-v2-a-fully-sovereign-reasoning-model/)

### Caveats / "unverified — best lead"
- **Demo videos for individual projects:** most Devpost project pages do not link a demo video in their public scraped text; "best lead" is the project's Devpost page itself which often has an embedded YouTube/Loom not visible to text scrape.
- **Mobius / TradeProof / Power Lever / RIFFAI Atlas / NEC / AtriaAI:** no public GitHub repo found (either the project is private, deleted, or the team chose not to publish). Confirm by checking the project's "Try it out" links manually — *unverified — best lead: the Devpost project pages linked above.*
- **Page 4+ of the gallery has zero Winner badges** as of scrape time — confirming the 64-winner set. If TreeHacks staff back-fill more sponsor prizes later, recheck.
