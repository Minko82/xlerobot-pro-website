# AGENT_PROJECT.md

## Project

**XLerobot Docs & Lab Site**

A docs-first website for the XLerobot robotics project and related lab work.

This site is not just a project homepage. It is a:

* documentation hub
* tutorial platform
* troubleshooting guide
* lab notebook/devlog
* contributor onboarding system

The goal is to help people **successfully build, run, and understand** XLerobot-related workflows (hardware + software + ROS2 + perception/manipulation), while also showcasing real engineering progress.

---

## Why this exists

Most robotics projects only have:

* a GitHub repo
* a partial README
* scattered notes/videos
* brittle setup instructions

We want to build something better:

* **clear, reproducible setup docs**
* **task-based tutorials**
* **symptom-based troubleshooting**
* **honest lab notes** (what worked, what broke, what changed)
* **consistent documentation standards** so collaborators can contribute without guesswork

This should feel like a real engineering documentation system, not a random collection of pages.

---

## Product vision

Build a **beautiful, practical home base** for XLerobot and lab work that helps people:

1. understand what XLerobot is
2. get a working setup
3. complete tutorials
4. troubleshoot common problems
5. follow progress over time

The site should be:

* beginner-safe (clear guidance)
* expert-respectful (real technical depth)
* reproducible (tested commands, expected outputs)
* maintainable (templates + standards)

---

## Primary audiences

### 1) Builders / Students (main audience)

People trying to replicate the setup or learn from XLerobot.

They need:

* setup guides
* hardware BOMs
* ROS2 commands
* troubleshooting help
* explanations of concepts (frames, topics, IK, etc.)

### 2) Engineers / Recruiters / Collaborators

People evaluating engineering quality.

They need:

* architecture clarity
* evidence of technical rigor
* demos and milestones
* visible iteration process

### 3) Future contributors

People helping build docs/tutorials/site.

They need:

* page templates
* style guide
* clear repo structure
* review standards

---

## Non-negotiable principles

Use these to make decisions when building pages or features.

### 1) Docs first

This is a docs/tutorial system first, not a flashy marketing site.

**Implications**

* prioritize information architecture and content templates
* optimize for usability and learning
* visual polish matters, but only after clarity

### 2) Reproducibility over vibes

Every guide should help users actually reproduce outcomes.

**Implications**

* include versions and tested environments
* include exact commands
* include verification steps and expected outputs
* include common failures and fixes

### 3) Task-first navigation

Users think in outcomes, not categories.

**Implications**

* emphasize flows like “Get camera online” / “Validate TF” / “Run first reach”
* category structure is fine, but onboarding should be task-oriented

### 4) One source of truth

Do not duplicate setup instructions across multiple pages.

**Implications**

* maintain canonical setup pages
* tutorials should link to setup pages, not re-explain everything
* fix docs at the source page, not via copy-paste patches

### 5) Honest engineering

Show real progress, including rough edges.

**Implications**

* lab notes can mention failures and debugging process
* avoid over-polished claims unsupported by evidence

### 6) Consistency beats creativity (for docs pages)

Docs should follow templates.

**Implications**

* no freestyle page layouts
* use standard sections for setup/tutorial/troubleshooting/lab notes
* shared components for repeated UI patterns

---

## Upstream docs relationship (important)

We are building on top of upstream resources (e.g. xLeRobot, LeRobot, ROS2, RealSense docs), but we are **not** just mirroring or linking out.

### Upstream docs are:

* references
* source material
* component-level documentation

### XLerobot docs are:

* the integration layer
* the tested workflow
* the “golden path”
* the practical operator manual

### Rule

Do not create pages that only link to upstream docs.

If linking upstream:

* add local explanation
* explain how it fits the XLerobot workflow
* add tested commands / notes / gotchas

---

## Target stack (locked)

* **Astro** (framework)
* **Starlight** (docs site system)
* **MDX** (content format)
* **Tailwind CSS** (styling)
* **GitHub** (repo + PR workflow)
* **Vercel or Cloudflare Pages** (deployment)

### Why this stack

* docs-first UX
* easy content authoring for collaborators
* static and fast
* flexible enough for custom components later

---

## Site architecture (high-level)

### Top-level sections

1. **Home**

   * what XLerobot is
   * quick links
   * latest milestone/demo

2. **Start Here**

   * onboarding flow for new users
   * prerequisites
   * learning path
   * setup overview

3. **Docs**

   * canonical setup and reference material
   * hardware / software / architecture / calibration / reference

4. **Tutorials**

   * outcome-based walkthroughs
   * task-first learning

5. **Troubleshooting**

   * symptom-based fixes
   * verification after fixes

6. **Lab Notes**

   * dated engineering updates
   * evidence + next steps

7. **Contributing**

   * contributor onboarding
   * style guide
   * templates
   * PR checklist

---

## Golden Path (v1)

This is the intended onboarding sequence for a new user.

1. **Start Here** (what XLerobot is + who this is for)
2. **Prerequisites** (tools, OS, expected skill level)
3. **Software Setup** (ROS2 + dependencies)
4. **Device Setup** (camera / robot / environment)
5. **Verify camera publishing**
6. **Verify TF / transforms**
7. **Run first reach tutorial** (camera point → end-effector)
8. **Troubleshoot if needed**
9. **Continue to advanced tutorials**

Every core page should support this path and link forward to the next step.

---

## Required page types and templates

All content should fit one of these page types. No freestyle docs pages.

### 1) Setup Guide

Use for installation/configuration.

**Required sections**

* Goal
* Prerequisites
* Tested on
* Steps
* Verify it works
* Common issues
* Next step

### 2) Tutorial

Use for outcome-based learning.

**Required sections**

* Outcome
* Concepts used
* Prerequisites
* Estimated time
* Steps
* Expected output
* Why this matters
* Next tutorials

### 3) Reference Page

Use for commands/topics/config.

**Required sections**

* Scope
* Quick answer
* Details
* Related pages

### 4) Troubleshooting Article

Use for one failure mode.

**Required sections**

* Symptoms
* Likely causes
* Fix steps
* Verification
* Prevention tips
* Related issues

### 5) Lab Note / Devlog

Use for progress updates.

**Required sections**

* Date + title
* What I worked on
* What changed
* Problems found
* Evidence (clip/image/log)
* Next step
* Related docs

---

## Documentation standards (must follow)

### Commands

* Must be copy-pasteable
* Include exact command syntax
* If placeholders are used, explain them

### Verification

Every setup/tutorial page must include a **verification section**:

* what success looks like
* logs/screenshots/behavior to expect
* a quick check command if possible

### “Tested on” block

Every setup/tutorial page must include:

* date last tested
* hardware used
* software versions (ROS2 distro, OS, key packages)

### Linking

* link to prerequisites instead of assuming them
* link forward to next steps
* link troubleshooting pages when relevant

### Writing style

* practical and direct
* explain why steps matter
* avoid “just” / “simply” when steps are non-trivial
* define acronyms on first use
* short paragraphs, scan-friendly structure

---

## Design direction

The visual style should feel like a **modern engineering lab**:

* clean
* technical
* minimal
* readable
* not corporate-marketing fluff

### Priorities

1. readability
2. navigation clarity
3. code block usability
4. consistent callouts/components
5. tasteful visual polish

### Visual notes

* dark mode should be excellent
* one accent color (XLerobot brand)
* use diagrams/screenshots/demo clips where they improve understanding
* avoid unnecessary animation

---

## Reusable UI components to build early

These components should be reused across pages to keep the site consistent.

1. **Callout**

   * info / warning / gotcha / pro-tip variants

2. **Step**

   * structured tutorial step block with title/body/verification

3. **CommandBlock**

   * code block with copy button and optional shell/ROS labels

4. **ExpectedOutput**

   * display logs/screenshots/what success looks like

5. **BOMTable**

   * part, quantity, notes, optional link

6. **DemoClip**

   * embedded clip/GIF/video with caption and “what to look for”

---

## Repo structure (recommended)

```text
xlerobot-site/
  docs/
    start-here/
    docs/
      hardware/
      software/
      architecture/
      calibration/
      reference/
    tutorials/
    troubleshooting/
    lab-notes/
    contributing/
  src/
    components/
      Callout.astro
      Step.astro
      CommandBlock.astro
      ExpectedOutput.astro
      BOMTable.astro
      DemoClip.astro
    styles/
    content/
      assets/
        images/
        clips/
        diagrams/
  public/
  .github/
    ISSUE_TEMPLATE/
    pull_request_template.md
```

---

## Contributor workflow (human or AI agent)

### Roles

**Technical owner (Rane)**

* defines architecture and standards
* provides source notes/media
* reviews technical correctness

**Contributor / Agent**

* creates pages from templates
* formats content in MDX
* applies style guide
* maintains links/nav consistency
* submits PRs

### Standard workflow

1. Receive task with:

   * page type
   * title
   * target audience
   * source material (notes/commands/video)
   * definition of done
2. Draft page using required template
3. Add verification + tested-on block
4. Add links to prerequisites/next steps
5. Run local checks (links/build)
6. Submit PR

---

## Definition of done (all pages)

A page is not done unless all are true:

* [ ] Correct page template used
* [ ] Clear purpose and audience
* [ ] Prerequisites listed
* [ ] “Tested on” block included (if setup/tutorial)
* [ ] Verification section included
* [ ] Commands are copy-pasteable
* [ ] Related links / next step added
* [ ] Formatting matches site conventions
* [ ] No broken links
* [ ] If applicable, screenshots/logs/media included

---

## Agent instructions (how to work on this project)

If you are an AI coding/doc agent working in this repo:

### Your priorities

1. Preserve clarity and consistency
2. Follow templates exactly
3. Optimize for reproducibility
4. Do not invent unverified technical steps
5. Ask for missing technical details only if truly necessary (otherwise leave TODO markers)

### Do

* keep edits scoped
* use existing components when possible
* improve wording for clarity and flow
* add TODO placeholders for missing values (versions, screenshots, logs)
* maintain internal links

### Don’t

* redesign site architecture without explicit direction
* add new page types without approval
* duplicate setup instructions across multiple pages
* write vague tutorials without verification steps
* replace concrete commands with generic prose

### When information is missing

Use explicit placeholders like:

* `TODO(Rane): add tested ROS