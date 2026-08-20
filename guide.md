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
- **Theme Consistency**: Do not hallucinate styles or patterns. Strictly follow the existing Tailwind CSS theme and component structure.

## 🎨 Theme & Architecture Quick Reference
- **Colors**: Background `#0B0D11`, Card `#0F1117`, Accent `#00D8F6` (Cyan), Purple `#A78BFA`, Text `#F3F4F6`, Muted `#8F99A8`.
- **Folder Rules**: Reusable UI parts go in `src/components/`. Full screen views go in `src/pages/`.
- **Mock Data**: Keep temporary mock data directly inside the files where they are used until a backend API is integrated.

## 👥 User Activity Log
*There are 3 people working on this project. Agents must track work separately for each user by updating the lists below after completing a prompt.*

### User 1 (Dark)
- [2026-08-20] Initialized project tracking and created this `guide.md` file to establish ground rules and activity logs.

### User 2 (Rohan)
- *No recent activity.*

### User 3 (Shafayat)
- *No recent activity.*

---

## 📌 Suggested Project Tracking (Keep Minimal)
*To keep things clean, use these sections to track ongoing work without needing external tools.*

### 🎯 Current Focus
- Setting up baseline project guidelines and agent instructions.

### 🐛 Known Issues / Tech Debt
- *None logged yet.*
