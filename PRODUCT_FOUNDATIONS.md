# Better You — Product Foundations

This document captures the **product intent, domain language, and behavioral rules** for Better You.  
It exists to ensure that architecture, data models, and APIs are grounded in clear product decisions rather than premature technical assumptions.

---

## Summary

Better You is a **goal achievement platform** that combines capacity-aware planning, AI-guided adjustments, and reciprocal human support. It helps overwhelmed people make trackable progress on meaningful goals — while also supporting users who are motivated by metrics, gamification, and friendly competition through **stackable motivational layers**.

**Key characteristics:**

- **Non-punitive progress tracking** — Missing steps is data, not failure; honesty > perfection
- **Capacity-aware planning** — Overload detection recommends queued vs active goals based on weekly availability
- **Participation + boost requests** — Users can request encouragement (boost) and show up for others through replies and reactions
- **Event-first system** — All state changes emit events; behavioral data informs re-engagement, suggestions, and adjustments
- **Motivational Layers (stackable)** — Users can enable multiple layers (performance, momentum, social, mastery, competitive) to shape what they see and how progress is framed
- **Act-first navigation** — The core surface is **Act**; optional info surfaces can be **locked behind action** via a configurable Focus Wall
- **Pods (auto-generated cohorts)** — Similar-goal cohorts are derived by the system; framing can be supportive or competitive depending on enabled layers
- **Core domain objects:**
  - **LifeDomain** (Body, Mind, Relationships, Work, Money, Service, Spirituality)
  - **Goal** (queued/draft/active/paused/completed/abandoned/archived; requires domain, optional journey)
  - **Journey** (optional long-term theme; requires domain)
  - **Path** (flexible execution plan toward a goal, one per goal at MVP)
  - **Step** (recurring or one-time action with cadence and minutes estimate)
  - **Check-in** (done/partial/skipped + optional difficulty/mood/log)
  - **Checkpoint** (weekly reflection; soft-gates new goals but never blocks daily progress)

**MVP surfaces:**
- **Act = Today Action** (default entry: actionable step + check-in)
- **Focus Wall (optional)** locks secondary surfaces behind check-in completion
- **Weekly checkpoint** soft-gated (required but non-punitive)
- **Inbox** separated for participation items (boost requests, replies)

**How to use this document:**
- **For product decisions:** Use domain glossary and rules to guide feature behavior and language
- **For schema/API design:** Align data models and endpoints with the domain model and event catalog
- **For onboarding collaborators:** Start with Overview, then Glossary, then drill into specific sections as needed

**Document sections:**
1. [Product Vision & Boundaries](#1-product-vision--boundaries)
2. [Target User & Orientation](#2-target-user--orientation)
3. [Core Job-To-Be-Done](#3-core-job-to-be-done)
4. [Core User Loop](#4-core-user-loop)
5. [Community Presence](#5-community-presence)
6. [Domain Glossary](#6-domain-glossary)
7. [State Machines & Rules](#7-state-machines--rules)
8. [Domain Model (Entities + Relationships)](#8-domain-model-entities--relationships)
9. [Core Events & Flows (Event-First)](#9-core-events--flows-event-first)
10. [Minimal MVP API Surface (REST/JSON)](#10-minimal-mvp-api-surface-restjson)
11. [MVP Definition (Screens, Responsibilities, and Soft Constraints)](#11-mvp-definition-screens-responsibilities-and-soft-constraints)
12. [Theoretical Foundations](#12-theoretical-foundations)

All technical artifacts (schema, API, architecture) must align with these foundations.  
**This specification takes priority over conflicting documentation.**

---

## Quick Reference: Core Rules

### Capacity & Overload
- **Capacity** = sum of weekly availability (minutes/day Mon–Sun)
- **Load** = sum of `minutes_per_week_estimate` for all active goals
- **Utilization** = `active_load / capacity`
- **Overload thresholds:** < 0.6 (room), 0.6–0.9 (tight), > 0.9 (overloaded)
- System recommends **queued** when overloaded; **active** when not

### Goal Lifecycle
- States: `queued | draft | active | paused | completed | abandoned | archived`
- Completion is outcome-based, not step-perfection-based
- State transitions via `POST /goals/:id/transition`

### Check-ins
- Status: `done | partial | skipped`
- Only most recent can be backfilled
- Past check-ins are immutable
- "Missed" is system-derived, mostly invisible, triggers re-engagement

### Act-first (Focus Wall)
- **Act** is the primary entry surface
- When **Focus Wall** is enabled:
  - Secondary surfaces may be locked until the user records **any** check-in (done/partial/skipped)
  - **Boost Requests are never locked**

### Participation
- Introduced progressively, not punished
- Lack of participation may soft-gate features later
- Boost requests cost points; replies earn points

### Weekly Checkpoint
- Required but non-punitive
- 3 quick prompts max
- Failure does not block daily progress
- May soft-gate activating new goals

### Motivational Layers
- Layers are **stackable** (multiple may be enabled)
- Users control layers; the system may **suggest** changes based on behavior
- Some layers may be premium-gated (initial recommendation; not final)

---

## 1. Product Vision & Boundaries

**Better You helps people achieve clear, meaningful goals while actively participating in the progress of others — and allows motivational intensity to scale per individual.**

After ~3 months of use, a successful user:
- Has achieved at least one meaningful goal
- Can see clear evidence of progress
- Has participated in helping others move forward
- Feels less alone while working toward self-improvement

Success is defined not only by personal achievement, but by **reciprocal human presence**.

### Core boundaries
- This is not a passive habit tracker
- This is not a productivity optimization tool
- This is not a social feed
- Contribution and community are first-class concepts
- Missing progress is data, not failure
- Metrics and competition (when present) must be **bounded, opt-in, and non-extractive**

---

## 2. Target User & Orientation

Better You is designed for adults and late teenagers who feel overwhelmed by life's demands and struggle
to make consistent progress toward meaningful goals — while also supporting users who are motivated by metrics, performance, and friendly competition through optional layers.

The ideal early user:
- Feels pressed by time, responsibility, or mental load
- Has multiple competing priorities
- May range from beginner to advanced
- Wants structure, clarity, and encouragement that adapts to real life

### Orientation
- Life improvement is favored over professional performance
- Sustainability > speed
- Well-being > output
- **Motivation is personal**: the system supports both gentle and performance-oriented styles via stackable layers

---

## 3. Core Job-To-Be-Done

> **When I feel overwhelmed and stuck, I want Better You to help me choose and manage one or more paths toward important goals — taking into account my routine, available time, and current stage of life — so that I can make clear, trackable, and shareable progress toward achieving those goals.**

---

## 4. Core User Loop

The Better You core loop is a **guided, non-punitive, adaptive journey** supported by both AI and real people.

1. **Clarify / Choose**
   - Define or select a goal
   - Scope it realistically based on life context
   - Commit to a minimum viable plan

2. **Act**
   - Perform small, concrete steps
   - Actions are designed to fit real-life constraints

3. **Check-in (Non-Punitive)**
   - Record outcomes (done / partial / skipped)
   - No streak punishment
   - Honesty is rewarded over perfection

4. **Checkpoint**
   - Periodic review of recent activity
   - Identify patterns, blockers, and wins

5. **Adjust**
   - Modify goals, paths, or steps based on reality
   - Adjustment assumes life changed, not that the user failed

6. **Boost Request**
   - User may request encouragement or motivation
   - Optional anonymity
   - Costs internal points
   - Other users respond with encouragement

7. **Participation**
   - Users show up for others through reactions, replies, or reviews
   - Participation is reciprocal and expected over time

8. **Layer Suggestions (Optional)**
   - System may suggest enabling/disabling a motivational layer based on user interaction
   - User choice always prevails

9. **Repeat**
   - The loop continues with greater clarity, resilience, and social connection

---

## 5. Community Presence

Better You provides **ambient community presence** to reduce isolation.

- Users see real-time or recent signals of others progressing
- This is not a feed by default
- Presence is enabled by default
- Users can pause or resume it at any time

The goal is **companionship, not engagement extraction**.

When enabled layers include social/competitive framing, community signals must remain:
- bounded (no global leaderboards)
- cohort-scoped (pods)
- opt-in (competitive views)

---

## 6. Domain Glossary

### Life Domains

Better You organizes goals and progress around **7 life domains**. Every goal and journey must belong to exactly one domain.

**Domains:**
- **Body** — Physical health, fitness, nutrition, movement, sleep, and bodily care
- **Mind** — Learning, creativity, cognitive development, mental clarity, and intellectual growth
- **Relationships** — Family, friendships, intimate partnerships, social connection, and relational health
- **Work** — Career, professional development, meaningful occupation, and vocational identity
- **Money** — Financial stability, planning, literacy, resource management, and economic security
- **Service** — Contribution to others, community engagement, volunteering, and prosocial action
- **Spirituality** — Values, meaning-making, reflection, faith (if present), transcendence, and existential well-being

**Domain properties:**
- Required for all Goals and Journeys
- Power balance metrics and analytics
- Used in onboarding, goal creation, and progress tracking
- User-neutral and secular by design
- Spirituality is self-defined (faith, reflection, values, meaning)

**Theoretical basis:**
The 7-domain model is grounded in multidimensional well-being research, Self-Determination Theory (autonomy, competence, relatedness), positive psychology and flourishing frameworks, health psychology and quality-of-life models, prosocial behavior research, and spirituality research in resilience and meaning-making. Balance is measured by sustained engagement across domains without chronic neglect—not equal time distribution.

### Core Progress Concepts
- **Goal** — A specific, measurable milestone with defined completion criteria. Belongs to one Life Domain. May optionally belong to a Journey.
- **Journey** — A broader, long-term developmental direction or identity-level theme. Belongs to one Life Domain. May contain multiple Goals. Optional (not required for goal tracking).
- **Step** — A small, concrete action (recurring or one-time)
- **Check-in** — A fast status update for a step occurrence  
  - status: done / partial / skipped  
  - optional context: difficulty (3-level), mood (3-level)
- **Log** — optional free-text note attached to a check-in
- **Checkpoint** — a periodic pause to review and decide what to adjust
- **Adjust / Adjustment** — a deliberate, non-punitive change

### Human & Community Concepts
- **Participation** — actions taken to show up for others
- **Boost Request** — a short request for encouragement, optionally anonymous
- **Live Community** — ambient signals that others are progressing
- **Pod** — an auto-generated cohort of users with similar goal patterns; used to present bounded community context

### Motivation & Attention Concepts
- **Act** — the primary surface where the user engages with today’s step
- **Focus Wall** — a configurable gate that locks secondary surfaces until a check-in is recorded
- **Motivational Layer** — an additive configuration that changes what insights are visible and how progress is framed (e.g., performance metrics, mastery analytics, competitive ranking)

### Language Principles
- No punishment language
- No failure framing
- Effort > perfection
- Participation is reciprocal
- Visibility without harmful comparison
- Competition (when present) is **bounded, opt-in, and framed as information—not identity**

---

## 7. State Machines & Rules

### Goal States
- **queued** — desired but not active
- **draft** — being defined
- **active** — currently worked on
- **paused** — intentionally stopped
- **completed** — achieved satisfactorily (not perfection-based)
- **abandoned** — disengaged
- **archived** — historical reference

Completion is outcome-based, not step-perfection-based.

### Journey States
- **active** — current developmental focus
- **paused** — temporarily inactive
- **archived** — historical reference

Journeys are optional and function as organizational containers for related goals.

### Step States
- **pending**
- **completed**
- **skipped**
- **retired**

"Current step" is a focus marker, not a state.

Steps may exist before a goal is active (e.g., curated paths).

### Check-in Rules
- Only the most recent check-in can be backfilled
- Past check-ins cannot be edited
- Skipped check-ins never block progress
- "Missed" is system-derived only

Misses are used internally to trigger:
- re-engagement attempts
- adjustment suggestions
- boost prompts

### Focus Wall Rules
- When Focus Wall is enabled:
  - Secondary surfaces may be locked until user records **any** check-in (done/partial/skipped)
  - Boost request entry remains available at all times
- Focus Wall is user-controlled and may be suggested by the system (never forced)

### Participation Rules
- Participation is introduced progressively
- No punishment for non-participation
- Lack of participation may gate features later
- Specific enforcement evolves post-MVP

---

## 8. Domain Model (Entities + Relationships)

### MVP Decisions (Locked)
- **7-domain life model** powers all goals, journeys, and balance metrics
- **Goals** must have a domain; may optionally reference a Journey
- **Journeys** are optional containers that must have a domain
- Multiple active goals supported
- Include **PathTemplate** (minimal) to support curated/sellable paths
- Include **Post** (minimal, no comments), with reply behavior configurable per post type
- Replies allowed or not **via configuration** (not hard-coded by type)
- Introduce **MotivationalProfile** and **Focus Wall**
- Introduce **Pods** as derived/assigned cohorts (bounded)

### Life Domain Enumeration

```
enum LifeDomain {
  BODY,
  MIND,
  RELATIONSHIPS,
  WORK,
  MONEY,
  SERVICE,
  SPIRITUALITY
}
```

### Core Entities (MVP)

#### User
- Preferences (e.g., Live Community paused/resumed)
- Participation phase marker (grace → expected)
- Points balance (soft currency)
- **MotivationalProfile** (stackable layers + suggestion history)
- **Focus Wall enabled flag** (behavioral gate)

#### MotivationalProfile
- `enabled_layers` (array of layer keys)
- `suggestion_history` (accepted/rejected suggestions)
- **Note:** Some layers may be premium-gated (initial recommendation; not final)

#### AvailabilityProfile (Capacity Plan)
- Weekly availability map in **minutes/day** (Mon–Sun)
- Used to compute capacity and overload
- **FE note:** display as hours for values `>= 60min`, but store raw minutes

#### Goal
- Belongs to User
- **domain**: LifeDomain (required)
- **journeyId**: string (optional)
- State: `queued | draft | active | paused | completed | abandoned | archived`
- Intent ("why this matters now")
- Measurable completion criteria
- One PathInstance
- Timestamps: created/activated/completed/etc.

**Structural rules:**
- Must have exactly one LifeDomain
- May optionally reference a Journey
- If referencing a Journey, both must share the same domain

#### Journey
- Belongs to User
- **domain**: LifeDomain (required)
- State: `active | paused | archived`
- Title and description
- Optional identity-level narrative
- May contain multiple Goals (via Goal.journeyId reference)
- Can exist without active Goals

**Structural rules:**
- Must have exactly one LifeDomain
- Optional (not required for goal tracking)
- Goals may exist without a Journey
- Future AI may infer potential Journeys from clustered Goals

#### PathTemplate
- Reusable template (system/AI/curator in future)
- Includes embedded `steps_json` (array of step definitions)
- `minutes_per_week_estimate` (load)
- Tags, description, difficulty (optional)

> MVP simplification: steps are embedded in the template as JSON for speed and authoring flexibility.

#### PathInstance
- Belongs to Goal
- Derived from PathTemplate (optional)
- Holds adjustments/overrides without mutating the template

#### StepInstance
- Belongs to PathInstance
- State: `pending | completed | skipped | retired`
- Type: `recurring | one_time`
- Ordering / priority
- Source: `template | user`
- For recurring steps: cadence (e.g., daily / weekly / 3x week) and estimated minutes

#### CheckIn
- Belongs to StepInstance
- Status: `done | partial | skipped`
- Difficulty scale: 1–3
- Mood scale: 1–3
- Timestamp (captures present moment)
- Optional `logText` (free text)

#### Checkpoint
- Belongs to Goal (or PathInstance)
- Periodic record (weekly MVP)
- 3 quick prompts max (non-excruciating)
- May produce/attach Adjustments
- Optional AI summary later

#### Adjustment
- Records deliberate changes (for behavioral data + audit trail)
- Target: goal/path/step
- Change type + params (e.g., reorder, cadence change, retire step)
- Optional reason

#### Post
- Community artifact (not a feed)
- Type: `BOOST_REQUEST | PROGRESS_SHARE` (extendable later)
- Optional anonymity flag
- Body text
- For BOOST_REQUEST: status `open | closed | expired` and points cost
- Replies allowed by configuration per post type

#### PostReply
- Reply to a Post (enabled/disabled by config)
- Belongs to Post + User
- Body + optional "helpful" feedback

#### Reaction
- Belongs to User
- Targets Post or PostReply
- Type: emoji / like / short text

#### ActivitySignal (Live Community)
- Derived, append-only "ambient" events
- Generated from key actions (check-ins, checkpoints, adjustments, posts, replies)
- Used to create the "I'm not alone" feeling without building a feed

#### Pod (Derived / Assigned)
- System-assigned cohort membership(s) for the user
- Based on similarity clustering (goal type, cadence, intensity, utilization profile)
- Bounded cohort size (e.g., 10–30)
- Used to present community context without global leaderboards

> MVP note: Pod membership may be computed offline and stored as assignments (e.g., `UserPodAssignment`) to simplify retrieval.

### Key Relationships
- User 1—N Goals
- User 1—N Journeys (optional)
- User 1—1 AvailabilityProfile (versioning optional later)
- User 1—1 MotivationalProfile
- User 1—N Pod assignments (derived/assigned)
- Goal N—1 Journey (optional; Goal.journeyId)
- Goal 1—1 LifeDomain (required)
- Journey 1—1 LifeDomain (required)
- Goal 1—1 PathInstance
- PathTemplate 1—(embedded steps JSON)
- PathInstance 1—N StepInstances
- StepInstance 1—N CheckIns
- Goal 1—N Checkpoints
- Goal/Path/Step 1—N Adjustments
- User 1—N Posts
- Post 1—N PostReplies (configurable)
- User 1—N Reactions
- ActivitySignal derived from core events

### Capacity, Load, and Overload (MVP Rules)

#### Capacity (from AvailabilityProfile)
- Weekly capacity = sum of minutes/day across Mon–Sun

#### Load (from active goals)
- Each PathTemplate has `minutes_per_week_estimate`
- Active load = sum of estimates for all active goals

#### Utilization
- `utilization = active_load / capacity_week`

#### Overload Status (MVP thresholds, tunable)
- < 0.6: room
- 0.6–0.9: tight but feasible
- > 0.9: overloaded

#### Product Behavior Driven by Overload
- When selecting a PathTemplate, system recommends:
  - **queued** if overloaded or already has active goals
  - **active** if not overloaded and has no active goals
- During re-engagement, system suggests adjustments that reduce load (cadence downshift, simpler steps)

### Balance Metrics (Domain-Level)

Balance is computed primarily at the **LifeDomain level**, independent of Journeys.

**Tracked metrics:**
- Active goals per domain
- Domains with no active goals (neglect detection)
- Self-reported strain per domain (optional checkpoint data)
- Long-term inactivity per domain (time since last active goal)

**Journeys:**
- Enhance narrative structure but are **not required** for balance computation
- May be used to group related goals within a domain for visualization
- Future AI may suggest Journeys based on clustered goals within the same domain

**Balance principle:**
Balance does not mean equal time distribution. It means sustained engagement across domains without chronic neglect of any one area.

---

## 9. Core Events & Flows (Event-First)

### Event Catalog (MVP)

#### Goal, Journey & Path
- `goal_created` (draft, includes domain)
- `goal_queued`
- `goal_activated`
- `goal_paused`
- `goal_completed`
- `goal_abandoned` (inferred/confirmed)
- `goal_archived`
- `goal_journey_linked` (Goal associated with Journey)
- `goal_journey_unlinked`
- `journey_created` (includes domain)
- `journey_paused`
- `journey_activated`
- `journey_archived`
- `path_template_selected`
- `path_instance_created`

#### Steps
- `step_added` (template copy or user-created)
- `step_reordered`
- `step_retired`
- `step_completed` (one-time only)

#### Check-ins
- `checkin_recorded`
- `checkin_backfilled` (most recent expected only)
- `checkin_missed_detected` (system-derived, mostly invisible)

#### Checkpoints & Adjustments
- `checkpoint_completed`
- `adjustment_created`

#### Community
- `post_created`
- `post_reply_created` (per post-type config)
- `reaction_added`

#### Points & Participation
- `points_spent`
- `points_earned`
- `participation_phase_changed`

#### Capacity
- `availability_updated`
- `overload_status_changed` (derived/internal)

#### Presence
- `activity_signal_emitted` (derived)

#### Motivation & Attention (New)
- `focus_wall_toggled`
- `layer_enabled`
- `layer_disabled`
- `layer_suggestion_generated`
- `layer_suggestion_accepted`
- `layer_suggestion_rejected`

#### Pods (New)
- `pod_assigned` (user assigned to pod)
- `pod_unassigned` (optional)
- `pod_view_opened` (telemetry; optional)

### Critical MVP Flows

#### Flow 1 — Select Template → Create Goal (overload-aware, domain-required)
1. User selects domain (required)
2. User optionally selects or creates Journey (must match domain)
3. `path_template_selected`
4. Create `goal_created` (draft, with domain and optional journeyId) + `path_instance_created`
5. Copy template `steps_json` → StepInstances (`step_added` batch)
6. Compute overload proxy using active goals + capacity
7. Recommend `queued` vs `active` (user confirms)
8. `goal_queued` or `goal_activated`
9. Optional `activity_signal_emitted`

#### Flow 2 — Check-in (fast loop)
1. User taps status (done / partial / skipped)
2. Optional difficulty + mood (3-level each)
3. Optional log text
4. `checkin_recorded` (+ `checkin_backfilled` if applicable)
5. Emit ambient presence signal

**Note**: Recurring step "done" means **done today** (repeats). One-time step "done" means completed and advances the path focus.

#### Flow 2b — Focus Wall Unlock (when enabled)
1. User records any check-in for today
2. Focus Wall unlocks secondary surfaces for the day/session (implementation choice)
3. Optional `activity_signal_emitted`

#### Flow 3 — Miss Detection → Re-engagement (core, non-punitive)
1. System evaluates expected cadence windows for recurring steps
2. If no check-in in 2× cadence window → `checkin_missed_detected`
3. Suggest one: adjustment / boost request / pause goal
4. Record outcome (`adjustment_created` OR `post_created` OR `goal_paused`)

#### Flow 4 — Weekly Checkpoint → Adjust
1. Weekly checkpoint prompt (required but light)
2. User answers 3 quick prompts
3. `checkpoint_completed`
4. Optional `adjustment_created`
5. Emit presence signal

#### Flow 5 — Boost Request → Replies → Close Loop
1. User creates BOOST_REQUEST post (`post_created`) + `points_spent`
2. Other users reply (`post_reply_created`) + `points_earned`
3. Reactions optional (`reaction_added`)
4. Post closed/expired (later)
5. Emit presence signal

#### Flow 6 — Layer Suggestion (system-guided, user-controlled)
1. System detects behavior pattern (analytics-heavy usage, frequent adjustments, pod comparison views, etc.)
2. `layer_suggestion_generated`
3. User accepts or rejects
4. `layer_suggestion_accepted` → `layer_enabled` OR `layer_suggestion_rejected`

---

## 10. Minimal MVP API Surface (REST/JSON)

### Locked Decisions
- Goal state changes use: **`POST /goals/:id/transition`**
- Adjustments are explicit: **`POST /adjustments`** (behavioral data)
- Default community view is **Live Community** (ambient) with filters

### API Endpoints

#### 1) User + Preferences
- `GET /me`
- `PATCH /me/preferences` (e.g., liveCommunityPaused)
- `PATCH /me/motivation` (enable/disable layers, accept/reject suggestions)
- `PATCH /me/focus-wall` (toggle Focus Wall)

#### 2) Availability (Capacity Plan)
- `GET /availability`
- `PUT /availability` (minutes/day Mon–Sun)

#### 3) Path Templates
- `GET /path-templates` (list + load estimate)
- `GET /path-templates/:id` (details + steps_json)

#### 4) Journeys
- `GET /journeys?state=...` (list user's journeys)
- `POST /journeys` (create journey with domain)
- `GET /journeys/:id` (detail + associated goals)
- `PATCH /journeys/:id` (update journey)
- `POST /journeys/:id/transition` with `{ to: "active|paused|archived" }`

#### 5) Goals
- `GET /goals?state=...&domain=...&journeyId=...` (filter by state, domain, or journey)
- `POST /goals/from-template`
  - requires: domain (LifeDomain)
  - optional: journeyId
  - creates goal draft + path instance + step instances
  - returns recommended state: queued/active based on load
- `POST /goals` (create custom goal with domain, optional journeyId)
- `POST /goals/:id/transition` with `{ to: "queued|active|paused|completed|archived" }`
- `PATCH /goals/:id/journey` (link/unlink journey; validates domain match)
- `GET /goals/:id` (detail + ordered steps + current focus marker + domain + journey reference)

#### 6) Steps
- `POST /goals/:goalId/steps` (user-created step)
- `PATCH /steps/:id` (cadence, minutes estimate, order/priority, etc.)
- `POST /steps/reorder`
- `POST /steps/:id/retire`

#### 7) Check-ins
- `POST /checkins` (idempotency via `clientEventId`)
- `GET /steps/:id/checkins?limit=...`

#### 8) Checkpoints + Adjustments
- `POST /checkpoints`
- `POST /adjustments`

#### 9) Posts + Replies + Reactions
- `GET /posts?scope=live` (bounded, filterable)
- `POST /posts`
- `POST /posts/:id/replies` (allowed by config)
- `POST /posts/:id/reactions` (idempotent)

#### 10) Live Community Signals (ambient)
- `GET /activity-signals?since=timestamp` (bounded)

#### 11) Pods
- `GET /pods` (pods relevant to the user, derived/assigned)
- `GET /pods/:id` (pod summary; framing depends on enabled layers)

#### 12) Balance & Analytics (domain-level)
- `GET /balance` (active goals per domain, neglected domains, utilization per domain)
- `GET /balance/history?period=...` (domain engagement over time)

#### 13) Recommendations (load-aware + motivation-aware + domain-aware)
- `GET /recommendations/goal-state?templateId=...` (queued vs active + explanation)
- `GET /recommendations/layers` (suggest enable/disable + rationale)
- `GET /recommendations/journeys` (suggest potential Journeys inferred from goal clusters; requires user confirmation)

### Implementation Notes
- **LifeDomain** is required for all Goals and Journeys
- **Journeys** are optional; Goals can exist without a Journey
- **Domain validation**: If Goal references a Journey, both must share the same domain
- **Balance metrics** computed at domain level, not dependent on Journeys
- **Inferred Journeys**: Future AI may suggest Journeys based on goal clusters; never auto-created without user confirmation
- **Availability** stored as minutes/day; UI may show hours when >= 1h
- **"Missed"** is system-derived and mostly invisible; used for re-engagement
- **Focus Wall** is user-controlled; suggestions are permitted; never forced
- **Layers** are stackable; some may be premium-gated (initial recommendation; not final)
- **Replies** configurable per PostType to support future community modes
- **Steps in templates** embedded as JSON for MVP speed and authoring flexibility

---

## 11. MVP Definition (Screens, Responsibilities, and Soft Constraints)

This section defines the **Minimum Viable Product** in terms of
**user-facing surfaces and behavioral constraints**, without prescribing visual design
or implementation details.

### 11.1 MVP Entry and Onboarding

**Availability setup is required before meaningful goal activation.**
- Users define a weekly availability map (minutes per day)
- This data is used to:
  - estimate capacity
  - inform overload detection
  - guide goal activation vs queuing
- Availability can be edited at any time

Availability is a **planning primitive**, not a commitment contract.

Onboarding also establishes:
- Introduction to the **7 life domains** (Body, Mind, Relationships, Work, Money, Service, Spirituality)
- Clarification that goals must have a domain; Journeys are optional
- Whether Focus Wall is enabled (default may be on; exact default is a product choice)
- Initial motivational layer suggestions (optional, non-binding)

### 11.2 Act Surface (Default Entry)

The default entry surface is **Act**.

Act combines:
- **Immediate action** (what to do now)
- **Fast check-in**
- Optional minimal ambient reassurance (bounded presence)

The Act surface must:
- Show the user's current actionable step
- Provide a fast path to check-in
- Provide access to Boost Request creation (never locked)
- Serve as the central bottom navigation button destination

Live Community presence on Act must be:
- bounded
- non-extractive
- easily paused or resumed by the user

### 11.2.1 Focus Wall (Optional Gate)

When Focus Wall is enabled:
- Secondary surfaces (e.g., Metrics, Pods, Mastery, Community views) may be locked
- Lock releases after the user records **any** check-in (done/partial/skipped)

Boost requests are always accessible.

Focus Wall can be:
- toggled by user
- suggested on/off by the system based on usage
- premium-gated only if you intentionally choose to monetize attention control (not decided)

### 11.3 Goals Management

Users can manage:
- **Active goals** (currently worked on)
- **Queued goals** (intended, but not yet active)
- **Journeys** (optional long-term themes that organize goals)

At MVP:
- Multiple active goals are allowed
- Each goal has exactly one path
- Each goal must have exactly one Life Domain
- Goals may optionally belong to a Journey (same domain required)

Adding a goal from a PathTemplate must:
- Require domain selection
- Allow optional Journey selection (or creation)
- Create the goal in a non-active state by default
- Present an overload-aware recommendation
- Require explicit user confirmation to activate

Balance view shows:
- Active goals grouped by domain
- Domains with no active goals (neglect indicators)
- Optional Journey grouping within domains

### 11.4 Goal Detail and Daily Progress

Within a goal, users must be able to:
- See their path and steps in order
- Identify the current focus step
- Perform fast check-ins
- Make small adjustments without friction

Check-ins must remain:
- Fast
- Optional in context fields
- Non-punitive

### 11.5 Weekly Checkpoint (Soft-Gated)

A weekly checkpoint is required but **not punitive**.
- It consists of a small number of quick prompts
- It is used to encourage reflection and adjustment
- Failure to complete a checkpoint:
  - Does not block daily progress
  - May soft-gate activating new goals

The checkpoint exists to **slow down wisely**, not to enforce compliance.

### 11.6 Posts, Requests, and Participation

The MVP supports two post types:
- **Boost Requests** (asking for encouragement)
- **Progress Shares** (sharing effort or wins)

Posts may:
- Be anonymous or attributed
- Allow replies based on configuration
- Receive lightweight reactions

Participation is encouraged but not punished.  
An **Inbox** surface exists for items requiring attention (e.g., unanswered boost requests).

### 11.7 Pods Surface (Bounded Community Context)

Users may view pod context as enabled by their layers:
- Supportive framing (default)
- Comparative metrics (performance layer)
- Rankings (competitive layer)

Pods must be:
- auto-generated
- bounded in size
- non-global
- non-feed-like

### 11.8 Settings and Control

Users must always be able to:
- Edit availability
- Control Live Community visibility
- Adjust privacy defaults
- Enable/disable Focus Wall
- Enable/disable motivational layers

Control is explicit and reversible.

---

## 12. Theoretical Foundations

This section describes the **theoretical and conceptual basis** behind the Better You product design.
It exists to demonstrate that the system is grounded in established product, behavioral, and systems
thinking — not ad-hoc feature decisions.

Better You is intentionally designed as a **human-centered, non-punitive, capacity-aware system**
that supports progress under real-life constraints — and allows motivational intensity to scale per individual through user-controlled layers.

### 12.1. Jobs-To-Be-Done (JTBD)

**Primary reference:** Clayton Christensen

#### Core idea
People do not adopt products for features; they "hire" them to make progress in a specific situation.

#### Application in Better You
- The core JTBD explicitly starts with:
  > "When I feel overwhelmed and stuck…"
- The product is not solving "habit tracking"
- It is solving **regaining momentum, clarity, and agency**
- Emotional and social jobs are treated as first-class:
  - reducing shame
  - restoring confidence
  - feeling accompanied

#### Why it matters
JTBD explains why Better You is structured around:
- goals instead of habits
- progress instead of streaks
- reflection instead of punishment

### 12.2. Activity Theory

**Primary references:** Vygotsky, Engeström

#### Core idea
Human activity is:
- goal-oriented
- mediated by tools
- shaped by context and constraints
- adaptive over time

#### Application in Better You
- Explicit modeling of:
  - Goal → Path → Step → Check-in
- Tools (paths, steps, checkpoints) mediate user effort
- Misses and adjustments are part of normal activity, not errors
- Reflection is built into the activity loop (checkpoints)

#### Why it matters
Better You models **activity systems**, not linear task lists.
This allows the system to evolve alongside the user instead of enforcing static plans.

### 12.3. Self-Determination Theory (SDT)

**Primary references:** Deci & Ryan

#### Core idea
Human motivation is sustained when three psychological needs are met:
- Autonomy
- Competence
- Relatedness

#### Autonomy
- Users choose when to activate or queue goals
- Pausing is intentional and reversible
- No forced schedules or punishments
- Optional anonymity in community participation
- Users control Focus Wall and motivational layers (system may suggest)

#### Competence
- Steps are small and concrete
- Completion is outcome-based, not perfection-based
- Checkpoints reinforce learning instead of judgment
- Progress is visible even when imperfect
- Optional performance visibility can increase perceived competence for metric-driven users

#### Relatedness
- Live Community presence
- Boost Requests for encouragement
- Participation as a reciprocal norm
- Visibility without harmful comparison (pods are bounded; competitive views are opt-in)

#### Why it matters
Most productivity tools optimize output.
Better You optimizes **sustainable motivation under constraint**.

### 12.3a. Life Domain Model (Multidimensional Well-Being)

**Primary references:** Diener, Ryff, Seligman, Pargament, Penner

#### Core idea
Well-being is multidimensional. Sustained flourishing requires engagement across physical, cognitive, relational, occupational, financial, prosocial, and existential domains. Balance is sustained engagement, not equal distribution.

#### Application in Better You
The **7-domain life model** (Body, Mind, Relationships, Work, Money, Service, Spirituality) is grounded in:
- **Multidimensional well-being research** (Diener, Ryff) — well-being requires attention to physical, psychological, social, and existential dimensions
- **Self-Determination Theory** (Deci & Ryan) — autonomy, competence, relatedness underpin sustained motivation
- **Positive psychology and flourishing** (Seligman) — PERMA model (Positive emotion, Engagement, Relationships, Meaning, Accomplishment)
- **Health psychology and quality-of-life frameworks** — physical health (Body) and cognitive vitality (Mind) are foundational
- **Prosocial behavior research** (Penner, Batson) — contribution to others (Service) enhances meaning and relational connection
- **Spirituality research** (Pargament, Hill) — meaning-making, values, transcendence, and existential well-being (Spirituality) support resilience and life satisfaction

#### Domain properties
- Required for all Goals and Journeys
- Power balance metrics without requiring Journeys
- Secular and user-neutral by design
- Spirituality is self-defined (faith, reflection, values, transcendence)

#### Balance principle
Balance does not mean equal time across domains. It means **sustained engagement without chronic neglect** of any one area. The system detects long-term inactivity per domain and surfaces gentle prompts.

#### Why it matters
Most goal systems are domain-blind or profession-centric. Better You models **whole-life flourishing**, not just productivity optimization.

### 12.4. Cognitive Load Theory

**Primary reference:** John Sweller

#### Core idea
Failure often comes from cognitive overload, not lack of motivation or discipline.

#### Application in Better You
- Explicit modeling of user capacity (availability)
- Explicit estimation of goal/path "load"
- Overload-aware recommendations:
  - activate vs queue
  - reduce cadence
  - simplify steps
- Soft gating instead of hard blocking
- Focus Wall optionally reduces distraction and decision fatigue

#### Why it matters
The system adapts **scope to reality**, rather than demanding unrealistic consistency.
This directly reduces burnout and dropout.

### 12.5. Non-Punitive Systems Design (Resilience Engineering)

**Primary references:** Safety engineering, healthcare, aviation systems

#### Core idea
Systems should adapt to human variability instead of punishing it.

#### Application in Better You
- "Missed" is system-derived and mostly invisible
- No streak penalties by default
- No failure states tied to identity
- Adjustments are first-class outcomes
- Recovery paths are explicit

#### Why it matters
This shifts the system from:
- compliance-driven
- to resilience-driven

Users are supported in recovery, not judged for deviation.

### 12.6. Event-First / Event-Oriented Thinking

#### Core idea
Behavior should be modeled as a sequence of meaningful events,
with state derived from history rather than assumed intent.

#### Application in Better You
- Explicit event catalog (check-ins, checkpoints, adjustments, posts)
- Activity signals derived from events
- Adjustments recorded as intentional decisions
- Checkpoints act as reflective snapshots
- Layers and Focus Wall are also events (auditable personalization)

#### Why it matters
- Behavior becomes analyzable
- AI systems can reason over history
- Product decisions remain auditable
- Future evolution does not require rewriting the past

### 12.7. Sociotechnical Systems Theory

#### Core idea
Technology and human behavior form a single system.
Optimizing one without the other creates failure modes.

#### Application in Better You
- Participation expectations are designed, not assumed
- Points act as soft incentives, not coercion
- Inbox separates responsibility from ambient presence
- Community avoids global rankings and feed dynamics
- Pods provide bounded context; competitive framing is opt-in and layered

#### Why it matters
The system encourages **pro-social behavior without extraction**.
Human attention and energy are treated as scarce resources.

### 12.8. Progressive Disclosure & Evolutionary Design

#### Core idea
Systems should start simple, expose complexity gradually,
and leave room for evolution without architectural rewrites.

#### Application in Better You
- Stackable layers enable progressive complexity without forking the product
- Phased participation expectations
- Configurable reply behavior per post type
- Embedded steps JSON for MVP speed
- Clear migration paths (templates → instances → curation)

#### Why it matters
This balances:
- MVP pragmatism
- long-term scalability
- architectural honesty

### 12.9. Language as a Design Tool

**Primary references:** Lakoff, Wittgenstein, cognitive linguistics

#### Core idea
Language shapes how users interpret systems and themselves.

#### Application in Better You
- "Path" instead of "Journey"
- "Adjustment" instead of "Failure"
- "Participation" instead of "Support"
- "Missed" hidden from user-facing language
- "Act" chosen to reinforce behavior-first navigation

#### Why it matters
The language of the system:
- reduces shame
- reinforces agency
- frames growth as adaptive, not linear

### 12.10. Unifying Principle

Better You is designed around a single unifying principle:

> **Support human progress under constraint by adapting the system to reality,  
> not forcing humans to adapt to the system — while allowing motivational intensity to scale per individual.**

This principle informs:
- product decisions
- domain modeling
- event design
- community mechanics
- MVP scoping

### Summary

The Better You product design is grounded in:
- Jobs-To-Be-Done
- Activity Theory
- Self-Determination Theory
- Cognitive Load Theory
- Non-Punitive / Resilient Systems Design
- Event-first modeling
- Sociotechnical systems thinking
- Intentional language design

Together, these form a **coherent, defensible theoretical foundation**
for a human-centered personal development platform.

This document exists to make that intentionality explicit.

---

## Status

**Document version:** 4.0  
**Last updated:** 2026-02-15  
**Status:** Authoritative product specification (updated: 7-domain life model, Goals/Journeys structure, domain-level balance)

This specification defines product foundations, domain model, events, and API surface.  
All data models, APIs, and infrastructure must align with these definitions.

**Key changes in v4.0:**
- Introduced **7-domain life model** (Body, Mind, Relationships, Work, Money, Service, Spirituality)
- Separated **Goals** and **Journeys** as distinct entities
- Made Journeys **optional** (not required for goal tracking)
- Balance metrics computed at **domain level**, independent of Journeys
- Added theoretical basis for life domain model (multidimensional well-being research)