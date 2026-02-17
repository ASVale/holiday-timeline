# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>generate-test-cases</name>
<description>Analyze code and generate a structured list of test cases following battle-tested INCLUDE/EXCLUDE rules. Outputs Given-When-Then format covering all code branches. Use before writing actual tests.</description>
<location>project</location>
</skill>

<skill>
<name>generate-tests</name>
<description>Generate high-quality unit tests from test cases. Applies proven testing principles like Given-When-Then structure, focused tests, clean test data, and behavior-driven testing. Supports multiple languages with specialized rules for Java.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>

---

## Web Development Agent Framework

> This project uses a cross-model multi-agent framework. Both Claude and Gemini share the `.ai/` knowledge base below.

### Shared Knowledge Base (`.ai/`)

| File | Purpose | Read Before |
|------|---------|-------------|
| `.ai/context.md` | Tech stack, conventions, architecture | Any code changes |
| `.ai/design-system.md` | Colors, typography, components, patterns | Any UI work |
| `.ai/design-references.md` | Curated best-practice sites | Any design work |
| `.ai/product-vision.md` | North star, personas, roadmap | Product suggestions |
| `.ai/changelog.md` | Dated log of all changes | Understanding recent context |

### Agent Routing

| Signal | Role | Agent Definition |
|--------|------|-----------------|
| "build", "implement", "add feature", "fix bug", code changes | 🔧 Web Developer | `~/.ai-webdev/agents/web-developer.md` |
| "design", "UI", "UX", "layout", "styling", "look and feel" | 🎨 Design Lead | `~/.ai-webdev/agents/design-lead.md` |
| "test", "verify", "check", "QA", "does it work" | 🧪 QA Engineer | `~/.ai-webdev/agents/qa-engineer.md` |
| "suggest", "what should", "roadmap", "improve", "what's next" | 📋 Product Strategist | `~/.ai-webdev/agents/product-strategist.md` |
| "update docs", "README", after significant changes | 📝 Doc Keeper | `~/.ai-webdev/agents/doc-keeper.md` |

### Workflow Chains

- **Feature Request**: Design Lead → Web Developer → QA Engineer → Doc Keeper
- **Bug Fix**: QA Engineer (reproduce) → Web Developer (fix) → QA Engineer (verify)
- **Product Discovery**: Product Strategist → Design Lead → User Approval

See `~/.ai-webdev/workflows/` for detailed step-by-step guides.
