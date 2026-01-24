# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `.zenflow/tasks/general-fixes-f017/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

### [x] Step: UI Refinement (Apple Glass & Navigation)
- Update `globals.css` for "Apple Glass" aesthetic.
- Fix Header: "AllInOne" as home link, Profile as clickable.
- Update Habit icon in `app-navigation.tsx`.

### [x] Step: Gemini & AI Fixes
- Update `lib/services/gemini.ts` to `gemini-1.5-flash`.
- Fix API key connectivity issue.
- Verify AI initialization and responses.

### [x] Step: Dashboard Widgets Implementation
- Create `goals-widget.tsx`, `habits-widget.tsx`, `journal-widget.tsx`.
- Implement data fetching for each widget from Firestore.

### [x] Step: Smart AI Analytics & Suggestions
- Implement `analytics-widget.tsx` and `smart-suggestions.tsx`.
- Create logic for AI-driven insights based on user data.

### [x] Step: Dashboard Assembly (Home Page Rework)
- Rework `app/page.tsx` to include the new widgets.
- Integrate Drift as a companion/assistant rather than the primary UI.

### [x] Step: Final Verification & Cleanup
- Run linting and build checks.
- Manual verification of all fixed features.
- Write report.md.
