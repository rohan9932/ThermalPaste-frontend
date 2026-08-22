# ThermalPaste - Agent & Project Guide

## 🤖 Agent Instructions (MANDATORY)

1. **Always read this file** before starting any new task on this project.
2. **Identify the active user**: Always ask the user who is currently driving (Dark, Rohan, or Shafayat) before writing any code, unless they have already stated it in the current conversation.
3. **Update this file** (specifically the "User Activity Log" section) with a brief summary of every edit or prompt fulfilled. This keeps the project history clear.
4. **Strictly adhere to the Core Guidelines** below.

## 🛠️ Core Guidelines

- **Simplicity First**: Keep the codebase as easy and readable as possible. Always go for the simplest approach.
- **No Unapproved Additions**: Do not add unnecessary code, features, or npm packages without asking first.
- **State Management**: Avoid using the Context API unless absolutely necessary. Avoid deep prop drilling (use composition instead).
- **Theme Consistency**: Do not hallucinate styles or patterns. Strictly follow the existing theme and component structure.
- **Responsive & Dynamic Design**: Ensure the site is dynamic and fully optimized for both PC and narrow screens on mobile phones so that layouts never break.

## 🎨 Theme & Architecture Quick Reference

- **Colors**: Background `#0B0D11`, Card `#0F1117`, Accent `#00D8F6` (Cyan), Purple `#A78BFA`, Text `#F3F4F6`, Muted `#8F99A8`.
- **Folder Rules**: Reusable UI parts go in `src/components/`. Full screen views go in `src/pages/`.
- **Mock Data**: Keep temporary mock data directly inside the files where they are used until a backend API is integrated.

## 👥 User Activity Log

_There are 3 people working on this project. Agents must track work separately for each user by updating the lists below after completing a prompt._

### User 1 (Dark)

- [2026-08-20] Initialized project tracking and created this `guide.md` file to establish ground rules and activity logs.
- [2026-08-21] Fixed community routing: added dynamic route `/communities/:groupId` to App.jsx, updated Sidebar subgroup buttons to route there, updated PostCard and CommunitiesPage badges to act as navigation links.
- [2026-08-21] Created `CommunitiesListPage.jsx` to list all joined subgroups when the user clicks the Communities button in the sidebar (route `/communities`).
- [2026-08-21] Added instructions to Core Guidelines for dynamic and responsive layouts across PC and mobile screens.
- [2026-08-21] Implemented `CreateGroupForm.jsx` (renamed from `CreateGroupModal.jsx`) and connected it to the "Create a Group" button in the Sidebar to allow users to create new communities with credentials (name, tagline, category, description, privacy).
- [2026-08-21] Refactored `PostDetailsPage.jsx` to dynamically take post data directly from whichever post was clicked (via route state and params) without any dummy/mock database inside the page. Updated `PostCard.jsx` and `CommunitiesPage.jsx` to pass the clicked post data seamlessly and fixed HTML5 state cloning in CommunitiesPage.
- [2026-08-21] Resolved merge conflicts in `CommunitiesPage.jsx`, incorporating updated card design while preserving dynamic clickable post card links and icon rendering.
- [2026-08-22] Fixed "Create a Group" button in `Sidebar.jsx` by restoring the `<CreateGroupForm />` modal component rendering in the JSX tree.
- [2026-08-22] Restyled `PostDetailsPage.jsx` to match HomePage and CommunitiesPage theme tokens, layout structure (`flex-1 p-4 sm:p-6 w-full`, `space-y-6`, `mx-auto max-w-4xl`), vote controls (`ArrowUp`/`ArrowDown`), and dark card aesthetics.
- [2026-08-22] Added comment voting (`CommentItem` sub-component) to `PostDetailsPage.jsx` with independent upvote/downvote controls and score display matching post cards.
- [2026-08-22] Added nested reply feature to comments in `PostDetailsPage.jsx` with inline reply forms, reply voting, and total discussion count calculation.
- [2026-08-22] Enhanced comment reply button styling in `PostDetailsPage.jsx` with a distinct pill button layout, border accents, and active cyan highlights.

### User 2 (Rohan)

- _No recent activity._

### User 3 (Shafayat)

- [2026-08-21] Restyled CommunitiesPage to match HomePage: replaced ArrowBigUp/ArrowBigDown with ArrowUp/ArrowDown, rewrote PostCard styles to use explicit HomePage color tokens (#0B0D11, #0F1117, #222834, #00D8F6, #8F99A8, #C4C9D4, #161922, #2A3142), aligned layout wrappers (p-4 sm:p-6, space-y-6, max-w-4xl), and fixed missing JSX closing tags.
- [2026-08-21] Added sub-group filtering to CommunitiesPage: filtered posts by `g/${groupId}`, updated post count badge to show filtered length, added empty state when no posts exist.
- [2026-08-21] Replaced hardcoded `communityIcon` JSX in POSTS data with a `COMMUNITY_ICON_MAP` derived from Sidebar SUB_GROUPS so post icons match the sidebar icons per community.
- [2026-08-21] Fixed CommunitiesPage post badge and community header to dynamically render the correct community icon via `COMMUNITY_ICON_MAP`.
- [2026-08-21] Made CommunitiesPage and CommunitiesListPage responsive by aligning both to HomePage's layout structure: `flex-1 p-4 sm:p-6 w-full` main wrapper, `space-y-6` + `mx-auto max-w-4xl` inner container, and replaced theme tokens with explicit hex color codes in CommunitiesListPage.
- [2026-08-21] Adjusted CommunitiesPage community header to use `flex flex-col lg:flex-row` so the description text stays full-width on small and medium screens, and only switches to side-by-side on large screens.
- [2026-08-21] Restyled ProfilePage to match HomePage/CommunitiesPage design: aligned main wrapper to `flex-1 p-4 sm:p-6 w-full`, replaced `max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-6` with `space-y-6` + `mx-auto max-w-4xl space-y-6`, removed `font-sans`, and replaced all `tp-*` theme tokens with explicit hex color codes.
- [2026-08-21] Adjusted ProfilePage text styles to match CommunitiesPage: removed italic from bio, changed activity item titles to `text-white`, changed profile preview card from gradient to solid `bg-[#0F1117]`, and aligned all body/secondary text colors to `#8F99A8` and `#C4C9D4`.
- [2026-08-21] Verified production build passes after all changes.

---

## 📌 Suggested Project Tracking (Keep Minimal)

_To keep things clean, use these sections to track ongoing work without needing external tools._

### 🎯 Current Focus

- Setting up baseline project guidelines and agent instructions.

### 🐛 Known Issues / Tech Debt

- _None logged yet._
