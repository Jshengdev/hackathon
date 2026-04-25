---
name: 'step-04-code-testing'
description: 'Extract and test code snippets from generated lenses'

nextStepFile: './step-05-reassemble.md'
installed_path: '{project-root}/_bmad/hackathon-suite/workflows/doc-transformer'
---

# Step 4: Code Testing

## STEP GOAL

Extract code snippets from the generated lenses and test them in a sandbox environment. Annotate the lenses with test results to show what actually works.

## MANDATORY SEQUENCE

### 1. Extract Code Snippets

"**🧪 Extracting code snippets for testing...**"

Scan all generated lens files for code blocks:
```
library/technical-patterns/{tool-name}/
├── capabilities-{tool}.md
├── creative-applications-{tool}.md
├── quick-start-{tool}.md
├── code-patterns-{tool}.md
├── hackathon-tracks-{tool}.md
└── constraints-{tool}.md
```

Look for fenced code blocks:
````markdown
```javascript
// code here
```
````

Extract metadata for each snippet:
- Language (javascript, python, bash, etc.)
- Source file and line number
- Context (what lens, what section)

Store in:
```
_sessions/{session_id}/code-snippets/
├── snippet-001.js
├── snippet-002.py
├── snippet-003.sh
└── ...
```

### 2. Count and Categorize Snippets

Count total snippets found.

Categorize by testability:
- **Testable:** Has minimal dependencies, can mock
- **Needs-Key:** Requires API credentials
- **Untestable:** Too complex, requires full environment

Update status.yaml:
```yaml
code_testing:
  enabled: true
  snippets_found: {total}
  testable: {count}
  needs_key: {count}
  untestable: {count}
```

"**Found {total} code snippets:**"
- {testable} testable
- {needs_key} need API key
- {untestable} untestable

### 3. Prepare Testing Environment

For each language found:
- JavaScript: Ensure Node.js available
- Python: Ensure Python available
- Bash: Available by default

Create sandbox directory:
```
_sessions/{session_id}/sandbox/
```

### 4. Test Each Snippet

For each testable snippet:

**JavaScript example:**
```javascript
// snippet-001.js
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'test-key'
});

// Test: Does it instantiate without error?
try {
  console.log('✅ Client created successfully');
} catch (error) {
  console.log('❌ Error:', error.message);
}
```

Execute in sandbox:
```bash
cd _sessions/{session_id}/sandbox/
node snippet-001.js
```

Capture output and errors.

**Python example:**
```python
# snippet-002.py
import anthropic

try:
    client = anthropic.Anthropic(api_key="test-key")
    print("✅ Client created successfully")
except Exception as e:
    print(f"❌ Error: {e}")
```

Execute:
```bash
python snippet-002.py
```

### 5. Classify Test Results

For each snippet, determine result:

**✅ TESTED: Works as documented**
- Code executes without errors
- Produces expected behavior
- No missing dependencies

**❌ TESTED: Fails - [reason]**
- Code has errors
- Missing imports
- Syntax issues

**⚠️ NEEDS-KEY: Requires valid API credentials**
- Code structure is correct
- But needs real authentication to fully test

**🔒 UNTESTABLE: Requires production environment**
- Too complex for sandbox
- Needs external services
- Can't be mocked easily

### 6. Annotate Lens Files

Go back to each lens file and add annotations above/below code blocks:

**Before:**
````markdown
```javascript
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```
````

**After:**
````markdown
```javascript
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

**✅ TESTED (2026-01-22):** Works with valid API key
**⚠️ NOTE:** Requires `ANTHROPIC_API_KEY` environment variable
**Dependencies:** `@anthropic-ai/sdk` (auto-installs via npm)
````

**If snippet failed:**
````markdown
```javascript
// Original code that failed
const client = new Anthropic(process.env.API_KEY); // Wrong env var name
```

**❌ TESTED (2026-01-22):** Fails - undefined API key

**✓ FIXED VERSION:**
```javascript
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Correct format
});
```
````

### 7. Update All Lens Files

For each lens file:
- Read current content
- Find code blocks
- Add test annotations
- Write back to file

Use Edit tool for each annotation.

### 8. Calculate Test Statistics

Count results:
- Total snippets tested: {count}
- Passed: {count}
- Failed: {count}
- Needs-key: {count}
- Untestable: {count}
- Pass rate: {passed / (passed + failed) * 100}%

Update status.yaml:
```yaml
code_testing:
  enabled: true
  snippets_found: {total}
  snippets_tested: {tested}
  snippets_passed: {passed}
  snippets_failed: {failed}
  pass_rate: {percentage}
  completed: {timestamp}
```

### 9. Report Testing Results

"**✅ Code testing complete!**"

- 📊 Snippets tested: {tested} / {total}
- ✅ Passed: {passed} ({pass_rate}%)
- ❌ Failed: {failed}
- ⚠️ Needs API key: {needs_key}
- 🔒 Untestable: {untestable}

**Quality gate:**
- Target: >80% pass rate
- Actual: {pass_rate}%
- Status: {✅ PASS or ⚠️ REVIEW NEEDED}

### 10. Load Next Step

"**Next: Reassembling and cross-referencing...**"

Update status: `status: testing_complete`

Load `{nextStepFile}` for reassembly.

---

## SUCCESS METRICS

✅ All code snippets extracted
✅ Snippets tested in sandbox
✅ Test results classified accurately
✅ Lens files annotated with results
✅ Pass rate ≥ 80% (quality target)
✅ status.yaml updated with test stats

## FAILURE CONDITIONS

❌ Cannot extract code snippets
❌ Sandbox environment not available
❌ Test execution fails
❌ Cannot annotate lens files
❌ Pass rate < 50% (indicates doc quality issues)

---

_Step 4: Code Testing — Doc Transformer Workflow_
