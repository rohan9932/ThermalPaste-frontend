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

### User 2 (Rohan)

- _No recent activity._

### User 3 (Shafayat)

- _No recent activity._

---

## 📌 Suggested Project Tracking (Keep Minimal)

_To keep things clean, use these sections to track ongoing work without needing external tools._

### 🎯 Current Focus

- Setting up baseline project guidelines and agent instructions.

### 🐛 Known Issues / Tech Debt

- _None logged yet._
