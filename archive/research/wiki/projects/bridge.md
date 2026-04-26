# BRIDGE

- **Hackathon / event:** HackPrinceton
- **Year / date:** 2026 (likely Spring; verify from Devpost)
- **Prize won:** unverified — Devpost text doesn't say
- **Sponsor tracks involved:** **K2 Think** (used `MBZUAI-IFM/K2-Think-v2` directly), Gemini (used `gemini-2.5-flash` for natural-language planning)
- **Devpost / press / video / repo:** repo only — https://github.com/CaoMatthew/HackPrinceton.git
- **Local clone:** `../sponsors/k2-think/clones/bridge/`

## Pitch (one sentence)

Tell a robot arm "grab the coffee mug by the handle" in plain English; an LLM compiles your sentence into a 3-step Python plan that drives a physics-simulated Franka Panda arm.

## What's actually in the repo (verified vs. claimed)

The Devpost prose describes a much bigger system than the code implements. Be honest about what's a working prototype vs. an aspirational architecture diagram:

| Devpost claim | Reality |
|---|---|
| Spinning Kinect captures real 3D point cloud | ❌ Aspirational. No Kinect code, no point cloud, no sensor I/O. |
| CLIP + Segment Anything 3D for semantic injection | ❌ Aspirational. CLIP/SAM3D are listed in "Built With" but absent from the repo. |
| Geometric decomposition into primitives (cylinder + torus) | ❌ Aspirational. Object positions are hardcoded in `scene.py` as a 6-line dict. |
| Affordance map drives grasp choice | ❌ Aspirational. No affordance code; the grasp point is the literal `mug.handle` coordinate from the dict. |
| LLM as orchestrator writing real-time Python from a "Bank of Primitives" | ✅ **Real and clean.** Two-stage Gemini → K2 → 4-function DSL. (See `llm.py`.) |
| NVIDIA Isaac Sim with IK + RL | ⚠️ Partial. PyBullet (not Isaac Sim) handles IK; no RL — `grasp` is just "close fingers for 50 steps." |
| Reinforcement Learning for micro-grasp | ❌ Aspirational. |

**Total code: ~250 lines across 6 Python files.** That's fine — it's a 36-hour hack — but the takeaway is that the *vision* is what they sold; the *implementation* is a tight LLM-to-physics demo loop.

## The unique sauce (what made it stand out)

1. **The two-stage LLM compile** — Gemini 2.5 Flash drafts a numbered natural-language plan, then K2 Think v2 compiles that plan into a tiny constrained Python DSL. This is the actually-novel pattern in the repo, and it's reusable far beyond robotics.
2. **The DSL is 4 functions wide.** The K2 system prompt limits output to `move_to / grasp / lift / place`. That tiny surface area is what makes the `eval()` step in `main.py` trustworthy — they sandbox by enumeration, not by parsing.
3. **Demo theatre:** the prose hides how minimal the demo is. The judges saw "tell the robot what to do in English → arm moves" and that's emotionally complete even if the plumbing is a 6-key dict.

## Implementation needles (actual code patterns)

### 1. Two-stage LLM compile (`llm.py`)

```python
def gemini_plan(task: str) -> str:
    prompt = f"""You are a robot task planner.
Break the task into clear, numbered steps.
Rules:
- Be concise
- Use object names like "mug handle"
- Be explicit about parts (e.g., handle, top)
- Do NOT write code
- Do NOT explain anything
Task:
{task}"""
    return gemini_model.generate_content(prompt).text.strip()

def k2_compile(plan_text: str) -> str:
    system_prompt = """You are a robot planner.
Convert the plan into Python function calls.
Available functions:
- move_to(target)
- grasp(target)
- lift(height)
- place(target)
Rules:
- Only use these functions
- Use "mug.handle" format
- Output ONLY valid Python code
- One function per line
- No explanations"""
    response = requests.post(K2_API_URL, headers={
        "Authorization": f"Bearer {K2_API_KEY}",
        "Content-Type": "application/json",
        "accept": "application/json",
    }, json={
        "model": "MBZUAI-IFM/K2-Think-v2",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": plan_text}
        ],
        "stream": False
    })
    output = response.json()["choices"][0]["message"]["content"].strip()
    return output.replace("```python", "").replace("```", "").strip()
```

**Why it works:** Generalist LLMs (Gemini Flash) are great at decomposing fuzzy human intent into numbered steps but bad at strict syntax. Specialist reasoning models (K2) are great at constrained structured output but worse at intent inference. Stacking them in series gives you the strengths of both, cheaply. See `patterns/two-stage-llm-compile.md`.

### 2. Sandbox-by-enumeration interpreter (`main.py`)

```python
def execute_plan(code):
    lines = code.split("\n")
    plan = []
    for line in lines:
        line = line.strip()
        if "#" in line:
            line = line.split("#")[0].strip()
        if (line.startswith("move_to(") or
            line.startswith("grasp(") or
            line.startswith("lift(") or
            line.startswith("place(")):
            plan.append(line)
    plan = plan[:3]  # KEEP ONLY FIRST VALID PLAN (max 3 steps)
    for line in plan:
        eval(line, {}, {
            "move_to": actions.move_to,
            "grasp":   actions.grasp,
            "lift":    actions.lift,
            "place":   actions.place,
        })
```

**Why it works:** They use `eval()` — normally a code-injection footgun — but only after a startswith-prefix whitelist and an empty-globals call. The K2 prompt restricts the DSL, the Python guard restricts execution. Belt + suspenders.

The `[:3]` cap is a pragmatic demo guard: if K2 hallucinates extra lines, the arm doesn't run away on stage.

### 3. Smooth IK motion (`actions.py`)

```python
def move_ee_smooth(target_pos, target_orn, steps=120, sleep=1./240.):
    state = p.getLinkState(robot, endEffectorIndex)
    current_pos = state[0]
    for i in range(steps):
        alpha = i / steps
        interp_pos = [current_pos[j] + alpha * (target_pos[j] - current_pos[j]) for j in range(3)]
        jointPoses = p.calculateInverseKinematics(robot, endEffectorIndex, interp_pos, targetOrientation=target_orn)
        for j in range(7):
            p.setJointMotorControl2(robot, j, p.POSITION_CONTROL, targetPosition=jointPoses[j], force=300)
        p.stepSimulation()
        time.sleep(sleep)
```

**Why it works:** No RL, no diffusion policy. Linear interpolation between current and target end-effector position, IK at each step, position control. ~30 lines, looks great on stage.

## Capability stack

| Layer | Choice |
|---|---|
| LLM (planning) | Gemini 2.5 Flash via `google-generativeai` |
| LLM (compile) | K2 Think v2 (`MBZUAI-IFM/K2-Think-v2`) via raw HTTPS POST |
| Physics sim | PyBullet (not Isaac Sim, despite Devpost) |
| Robot model | `franka_panda/panda.urdf` from `pybullet_data` |
| Motion | `p.calculateInverseKinematics` + position control |
| Secrets | `python-dotenv` |

## Why it would win

The **emotional payoff is in the demo loop**: typed sentence → arm moves → repeat. Judges don't see the dict; they see natural-language robotics. Combined with a hardware-leaning Devpost narrative (Kinect, Isaac Sim, RL), the team set high judge expectations and let the live demo prove the smaller working core.

## Reusable for us at HackTech 2026?

- ✅ **angle:** The two-stage LLM compile is a transferable architecture for *anything* where intent is fuzzy and execution must be safe — robot control, browser automation, IDE actions, financial transactions, medical workflows. Substitute the DSL.
- ✅ **angle:** The sandbox-by-enumeration interpreter is a great answer when judges ask "how do you keep the LLM from doing something dangerous?"
- ⚠️ **risk:** If we go robotics, do not over-promise CV/RL on a Devpost we can't ship — judges check repos sometimes.
- 🚫 **saturated:** Pure language-to-PyBullet demos. The novelty bar at HackTech is higher; we'd need either real hardware or a real-world action surface.

## Cross-links

- Patterns: [`two-stage-llm-compile.md`](../patterns/two-stage-llm-compile.md)
- Tools: [`k2-think.md`](../tools/k2-think.md), [`pybullet.md`](../tools/pybullet.md)
