# ThermalPaste Frontend 🧪⚡

> Modern, high-performance community platform for PC builders, overclockers, benchmarkers, and hardware enthusiasts.

[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3.3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-v5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

**ThermalPaste** is a full-featured web client built with **React 19**, **Vite**, and **Tailwind CSS v4**. It connects to the ThermalPaste Node/Express backend to offer high-speed feeds, sub-group communities (`g/community`), hardware build discussions, native drag-and-drop Cloudinary image uploads, threaded comments, bookmarking, and real-time environmental carbon emission metrics.

---

## ✨ Features

- **⚡ Live Post Feed & Community Scoping:** Paginated global feeds, sub-group feeds (`/communities/:groupId`), and private group visibility checks.
- **🖼️ Native Cloudinary Post & Avatar Uploads:** Drag-and-drop image dropzones with client-side format checks (JPEG, PNG, WebP) and 10MB limits, live `FileReader` previews, and direct streaming through backend endpoints to Cloudinary CDN.
- **🔺 Atomic Upvote / Downvote Engine:** Reddit-style reaction counter with accurate delta updates (net `-2` on reverse votes) and immediate optimistic UI updates.
- **💬 Nested Threaded Discussions:** Full post view (`/post/:id`) featuring nested author replies, inline comment creation, and comment vote controls.
- **🔖 Saved Bookmarks:** Toggle bookmarking on any post card with instantaneous synchronization across the dedicated `/saved` page.
- **🛡️ Secure Authentication & Route Guards:** Protected routes (`ProtectedRoute`) and guest-only routes (`PublicOnlyRoute`) with HttpOnly cookie sessions.
- **🔄 Single-Flight Silent Token Refresh:** Axios response interceptor that intercepts 401 errors, requests token rotation via `POST /api/auth/refresh`, and seamlessly replays in-flight requests without page reloads or auth drops.
- **🌱 Carbon Footprint Monitoring:** Built-in Sustainable Web Design model displaying network data transfer emissions in real time (`CarbonFootprintDisplay`).
- **📱 Fully Responsive Design:** Hand-crafted cyber/dark aesthetics optimized for viewports from 360px mobile screens up to ultrawide monitors.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Core Framework** | **React 19** (`^19.2.8`) | Modern React with React Compiler plugin for optimized render performance |
| **Bundler & Dev Server** | **Vite** (`^8.2.0`) | Lightning-fast HMR and ESM-powered build toolchain |
| **Styling** | **Tailwind CSS v4** (`^4.3.3`) | Utility-first CSS using the new `@theme` design tokens |
| **Data Fetching & Cache** | **TanStack Query v5** (`^5.102.8`) | Declarative server state management, query caching, and invalidation |
| **Routing** | **React Router v6** (`^6.28.0`) | Data-router configured via `createBrowserRouter` |
| **HTTP Client** | **Axios** (`^1.20.0`) | Promise-based HTTP client with cookie credentials and interceptors |
| **Icons** | **Lucide React** (`^1.31.0`) | Consistent, clean icon set |
| **Sustainability** | **react-carbon-footprint** (`^1.0.0`) | Real-time byte transfer and CO2 emissions tracking |

---

## 📁 Codebase Structure

```text
ThermalPaste/
├── public/                     # Static public assets (favicons, fallback images)
├── src/
│   ├── assets/                 # SVGs, brand logos, and static illustrations
│   ├── components/             # Reusable UI widgets and layout blocks
│   │   ├── CarbonFootprintDisplay.jsx # Floating live network CO2 footprint widget
│   │   ├── CreateGroupForm.jsx        # Community / sub-group creation modal
│   │   ├── CreatePostForm.jsx         # Post creation modal with Cloudinary dropzone
│   │   ├── Navbar.jsx                 # Top nav with search dropdown, user menu, and CTAs
│   │   ├── PostCard.jsx               # Universal post card with voting, image, & bookmark
│   │   ├── ProtectedRoute.jsx         # Route wrapper redirecting unauthenticated users to /login
│   │   ├── PublicOnlyRoute.jsx        # Route wrapper redirecting authenticated users to /
│   │   └── Sidebar.jsx                # Left navigational sidebar with sub-group links
│   ├── context/
│   │   └── AuthContext.jsx     # User auth session provider and custom useAuth() hook
│   ├── data/
│   │   └── mockData.js         # Local development fixtures and sample post fallbacks
│   ├── pages/                  # Page-level route views
│   │   ├── CommunitiesListPage.jsx # Community directory listing all joined & available groups
│   │   ├── CommunitiesPage.jsx     # Individual sub-group community feed & header
│   │   ├── HomePage.jsx            # Main aggregated feed view
│   │   ├── LoginPage.jsx           # User sign-in page
│   │   ├── PostDetailsPage.jsx     # Single post view, comment tree, & author Edit/Delete modals
│   │   ├── ProfilePage.jsx         # User profile with bio, avatar upload, & joined groups
│   │   ├── RegistrationPage.jsx    # User sign-up page
│   │   └── SavedPostsPage.jsx      # Bookmarked posts feed view
│   ├── services/               # Modular API and data layers
│   │   ├── api.js              # Configured Axios instance with silent refresh interceptor
│   │   ├── auth.js             # Auth endpoints (login, register, logout, getMe)
│   │   ├── groups.js           # Community endpoints (list, get, create, join, leave)
│   │   ├── posts.js            # Post CRUD, votes, comments, and query key factories
│   │   ├── profile.js          # Profile management and avatar upload services
│   │   └── queryClient.js      # Global TanStack QueryClient instance
│   ├── App.jsx                 # Router definitions and global root layout
│   ├── index.css               # Tailwind CSS v4 theme variables and base styling
│   └── main.jsx                # Application entry point with providers
├── .env                        # Local environment configuration
├── details.pdf                 # Comprehensive full-stack session engineering report
├── guide.md                    # Core team guidelines, activity log, and conventions
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and npm scripts
└── vite.config.js              # Vite configuration and plugin pipeline
```

---

## 🧭 Application Routes

All application routes are defined in [`src/App.jsx`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/App.jsx):

| Route Path | View Component | Guard | Description |
|---|---|---|---|
| `/` | [`HomePage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/HomePage.jsx) | `ProtectedRoute` | Aggregated feed across joined and public communities |
| `/login` | [`LoginPage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/LoginPage.jsx) | `PublicOnlyRoute` | User authentication form |
| `/register` | [`RegistrationPage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/RegistrationPage.jsx) | `PublicOnlyRoute` | New user account registration |
| `/profile` | [`ProfilePage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/ProfilePage.jsx) | `ProtectedRoute` | User bio, avatar upload, and joined community list |
| `/saved` | [`SavedPostsPage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/SavedPostsPage.jsx) | `ProtectedRoute` | Filtered list of user-bookmarked posts |
| `/communities` | [`CommunitiesListPage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/CommunitiesListPage.jsx) | `ProtectedRoute` | Directory of all available and joined communities |
| `/communities/:groupId` | [`CommunitiesPage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/CommunitiesPage.jsx) | `ProtectedRoute` | Feed and metadata for a specific sub-group |
| `/post/:id` | [`PostDetailsPage`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/pages/PostDetailsPage.jsx) | `ProtectedRoute` | Detailed post view, author actions, and comment tree |

---

## 🎨 Theme & Color System

The application uses Tailwind CSS v4 with custom tokens configured in [`src/index.css`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/index.css):

```css
@theme {
  --color-tp-bg: #0B0D11;         /* Deep canvas background */
  --color-tp-card: #0F1117;       /* Card & elevated container background */
  --color-tp-border: #222834;     /* Subtle container border */
  --color-tp-input: #161922;      /* Input fields & sub-panels */
  --color-tp-text: #F3F4F6;       /* Primary typography color */
  --color-tp-secondary: #8F99A8;  /* Secondary / muted typography */
  --color-tp-muted: #4B5563;      /* Inactive / disabled states */
  --color-tp-accent: #00D8F6;     /* Electric Cyan accent */
  --color-tp-accentDim: #00c4e0;  /* Cyan hover highlight */
  --color-tp-purple: #A78BFA;     /* Tech badge highlight */
}
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **npm**: `v9.0.0` or higher
- **ThermalPaste Backend**: Running locally on `http://localhost:4000` (see `ThermalPaste-backend` repo)

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rohan9932/ThermalPaste-frontend.git
   cd ThermalPaste
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create or verify the `.env` file in the project root:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

---

### Running the Application

- **Start Development Server:**
  ```bash
  npm run dev
  ```
  The app will be available at `http://localhost:5173`.

- **Production Build:**
  ```bash
  npm run build
  ```
  Compiles optimized production bundles to the `dist/` directory.

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

- **Run Linting:**
  ```bash
  npm run lint
  ```

---

## 🔌 API & Authentication Flow

1. **HttpOnly Cookie Architecture:**
   Session tokens (`accessToken` and `refreshToken`) are stored in secure HttpOnly cookies set by the backend server. The frontend Axios client is initialized with `withCredentials: true`.
2. **Silent Refresh Interceptor ([`src/services/api.js`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/services/api.js)):**
   - Intercepts any `401 Unauthorized` response on authenticated endpoints.
   - Single-flights a refresh request to `POST /api/auth/refresh` so concurrent 401s do not trigger duplicate token rotations.
   - On success, re-executes the original request with the fresh token.
   - On refresh failure, clears query cache and allows `ProtectedRoute` to redirect to `/login`.
3. **Multipart Form Uploads ([`src/services/posts.js`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/src/services/posts.js)):**
   - Automatically detects whether the payload is standard JSON or a `FormData` instance and attaches appropriate `multipart/form-data` headers.

---

## 📄 Documentation & Reports

- **Engineering Session Report:** [`details.pdf`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/details.pdf) — Printable 4-page technical breakdown of the Post CRUD, Cloudinary pipeline, and voting engine architecture.
- **Team Guidelines & Activity Log:** [`guide.md`](file:///Volumes/Mac%20Drive/Projects/ThermalPaste/guide.md) — Ground rules, coding conventions, and developer activity history.

---

## 👥 Authors & Team

Developed by the **ThermalPaste Engineering Team**:
- **Rohan**
- **Shakib**
- **Shafayat**
